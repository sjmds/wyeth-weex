
import network from '../../modules/network/network'

// const storage = weex.requireModule('storage')
import store from '../../modules/store'

import CIData from '../../modules/CIData'
import { checkRegister } from '../../modules/login'

var audioPlayer = window.audioPlayer ||
  new Vue({
    props: {
    },
    data: {
      audio: Object,
      isPlay: false,
      isFirst: true,
      autoPlay: false,      // 加载完成后是否自动播放
      songIndex: 0,
      playlist: [],
      songPlay: {
        id: 0,
        title: '没有歌曲',
        singer: '',
        src: '',
        poster: require('assets/default_tabcenter.png'),
        audio_duration: 0,
        section: [],
        point: 0
      },
      mode: [
        {
          index: 0,
          name: '顺序播放',
          icon: require('assets/mode_order.png')
        },
        {
          index: 1,
          name: '随机播放',
          icon: require('assets/mode_random.png')
        },
        {
          index: 2,
          name: '单曲循环',
          icon: require('assets/mode_cycle.png')
        },
        {
          index: 3,
          name: '单曲播放',
          icon: require('assets/mode_order.png')
        }
      ],
      modeIndex: 0,
      handleId: null
    },
    created: function () {
      console.log('audioPlayer create')
      // 创建dom节点audio
      this.audio = document.createElement('audio')
      this.audio.preload = 'auto'
      var self = this
      this.audio.addEventListener('loadedmetadata', function (e) {
        self.onload(e)
      }, false)
      this.audio.addEventListener('canplay', function (e) {
        self.songPlay.canPlay = true
      }, false)
      this.audio.addEventListener('play', function (e) {
        self.onplay(e)
      }, false)
      this.audio.addEventListener('pause', function (e) {
        self.onpause(e)
      }, false)
      this.audio.addEventListener('timeupdate', function (e) {
        self.timeupdate(e)
      }, false)
      this.audio.addEventListener('ended', function (e) {
        self.onended(e)
      }, false)

      this.audio.addEventListener('error', function (e) {
        self.onerror(e)
      }, false)

      this.getCourseStash()
    },
    watch: {
      playlist(val) {
        console.log('playlist change: ' + val)
        this.checkSongChange()
      },
      songIndex(val) {
        console.log('songIndex change: ' + val)
        this.$emit('songIndexChange', val)
        this.checkSongChange()
      },
      songPlay(val) {
        console.log('songPlay change:', val)
      },
      isPlay(val) {
        if (val) {
          this.setCourseListen(this.songPlay)
        } else {
          this.clearCourseListen()
        }
        this.$emit('stateChange', val)
      },
      modeIndex(val) {
        this.$emit('modeChange', val)
      }
    },
    mounted() {
      console.log('audioPlayer mounted')
    },
    methods: {
      onplay(e) {
        if (checkRegister()) {
          return
        }
        console.log('audioPlayer onplay: ', e)
        CIData.push(['trackEvent', 'wyeth', 'audio_play', this.songPlay.id, this.audio.currentTime])
        CIData.push(['actionTimeStart', 'play', { cid: this.songPlay.id, wyeth_channel: window.wyeth_channel }])
        this.$emit('play', e)
        this.isPlay = true
        this.isFirst = false
      },
      onpause(e) {
        console.log('audioPlayer onpause: ', e)
        CIData.push(['trackEvent', 'wyeth', 'audio_pause', this.songPlay.id, this.audio.currentTime])
        CIData.push(['actionTimeEnd', 'play'])
        this.$emit('pause', e)
        this.isPlay = false
        this.songPlay.point = this.audio.currentTime
        this.setCourseStash()
      },
      onerror(e){
        this.isPlay = false
      },
      onended(e) {
        // 监听ended事件
        console.log('audioPlayer onended: ', e)
        this.$emit('ended', e)
        this.songPlay.point = 0
        this.currentTime = 0
        this.rmCourseStash()
        // 播放模式
        switch (this.modeIndex) {
          case 0: {
            // 顺序播放
            this.next()
            break
          }
          case 1: {
            // 随机播放
            this.songIndex = Math.floor(Math.random() * this.playlist.length)
            break
          }
          case 2: {
            // 单曲循环
            this.play()
            break
          }
          case 3: {
            // 单曲循环
            this.stop()
            break
          }
          default: {
          }
        }
      },
      setCourseStash: function () {
        let storeStr = JSON.stringify(this.songPlay)
        store.setItem('lastSongPlay', storeStr, function (state) {
          if (state) {
            console.log('存储最新歌曲 成功')
          } else {
            console.log('存储最新歌曲 失败')
          }
        })
      },
      getCourseStash: function () {
        var self = this
        store.getItem('lastSongPlay', function (res) {
          if (res.result === 'failed') {
            console.log('获取最新歌曲 失败')
          } else {
            console.log('获取最新歌曲 成功:', JSON.parse(res.data))
            self.songPlay = JSON.parse(res.data)
            self.audio.src = self.songPlay.src
          }
        })
      },
      rmCourseStash: function () {
        store.removeItem('lastSongPlay', function () {
          console.log('清除最新歌曲 成功')
        })
      },
      setCourseListen: function (song) {
        this.clearCourseListen()
        var self = this
        this.handleId = setInterval(function () {
          network.courseListenAdd(song.id, function (res) {
          })
          self.setCourseStash()
        }, 60000)
      },
      clearCourseListen: function () {
        if (this.handleId) {
          clearInterval(this.handleId)
          this.handleId = null
        }
      },
      checkSongEq: function (song) {
        if (!this.songPlay || !song) {
          return false
        }
        if (this.songPlay.src === song.src && this.songPlay.title === song.title) {
          return true
        } else {
          return false
        }
      },
      addToPlaylist: function (song) {
        let index = this.findSong(song)
        console.log('addToPlaylist:', index)
        if (index >= 0) {
          this.songIndex = index
          return index
        } else {
          this.playlist.unshift(song)
          this.songIndex = 0
          return 0
        }
      },
      findSong: function (song) {
        if (!song || !this.playlist || this.playlist.length === 0) {
          return -1
        }

        for (let i = 0; i < this.playlist.length; i++) {
          let tmp = this.playlist[i]
          if (song.src === tmp.src && song.title === tmp.title) {
            console.log('找到相同歌曲：', i)
            return i
          }
        }
      },
      checkSongChange: function () {
        if (this.playlist.length === 0 || this.songIndex < 0 || this.songIndex > this.playlist.length - 1) {
          return
        }
        console.log('checkSongChange ')
        let songTmp = this.playlist[this.songIndex]
        if (this.checkSongEq(songTmp)) {
          // 确保正在播放
          if (this.audio.paused) {
            this.play()
          }
        } else {
          this.songPlay = songTmp
          if (this.audio.src !== this.songPlay.src) {
            this.audio.src = this.songPlay.src
          }
          if (this.autoPlay) {
            this.play()
            // this.jumpTo(this.songPlay.start)
          }
        }
      },
      changeMode: function () {
        if (this.modeIndex >= this.mode.length - 1) {
          this.modeIndex = 0
        } else {
          this.modeIndex++
        }
      },
      onload: function (e) {
        // 监听 加载（元数据）完成
        console.log('audioPlayer onload: finish ', this.songPlay)
        e.duration = this.audio.duration
        this.$emit('onload', e)
        this.totalTime = this.audio.duration
        if (this.songPlay.point) {
          this.jumpTo(this.songPlay.point)
          // this.songPlay.point = 0
        }
        if (this.autoPlay) {
          this.play()
        }
      },
      start: function () {
        if (this.audio.paused) {
          this.play()
        } else {
          this.pause()
        }
      },
      play: function () {
        // this.autoPlay = true
        if (checkRegister()) {
          return
        }
        this.audio.play()
        if (this.songPlay.canPlay) {
          this.jumpTo(this.songPlay.point)
          // this.songPlay.point = 0
        }
        // let start_point = parseFloat(this.playlist[this.songIndex].start)
        // if (start_point && start_point > 0) {
        //     this.jumpTo(start_point)
        // }
      },
      pause: function () {
        this.audio.pause()
      },
      stop: function () {
        this.currentTime = 0
        this.isPlay = false
      },
      previous: function () {
        this.stop()
        if (this.songIndex === 0) {
          return
        }
        this.songIndex--
        // this.autoPlay = true
      },
      next: function () {
        this.stop()
        if (this.songIndex >= this.playlist.length - 1) {
          return
        }
        this.songIndex++
        // this.autoPlay = true
      },
      timeupdate: function (e) {
        var self = this
        this.$emit('timeupdate', {
          point: self.audio.currentTime,
          duration: self.audio.duration,
          rate: self.audio.currentTime / self.audio.duration
        })
      },
      jumpTo: function (point) {
        point = parseFloat(point)
        if (point && point > 0 && Math.abs(this.audio.currentTime - point) > 1) {
          console.log('跳转播放：', this.audio.currentTime, point)
          this.audio.currentTime = point
        }
      },
      forceJump: function (point) {
        this.audio.currentTime = parseFloat(point)
      },
      timeFormit: function (seconds) {
        if (!seconds) {
          return '00:00'
        }
        seconds = parseInt(seconds)
        function add0(m) {
          return m === 0 ? '00' : (m < 10 ? '0' + m : m)
        }
        return add0(parseInt(seconds / 60)) + ':' + add0(seconds % 60)
      }
    }
  })

module.exports = audioPlayer

window.audioPlayer = audioPlayer
