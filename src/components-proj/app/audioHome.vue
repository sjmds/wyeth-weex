<template>
  <div style="z-index:1;">
    <div class="tabbar-center" @click="clickAudioCenter">
      <div class="img-wrap">
        <image ref="audioCover" :class='isPlay?"Rotation":""' class="img-cover" :src="poster"/>
        <image class="img-state" :src="require('assets/tab_play.png')" v-if="!isPlay"/>
      </div>
    </div>

    <div id="sheet" v-if="!hidden" @click="hideSheet">
      <div id="audioPlayer">
        <div class="playheader">
          <div class="control" @click="start">
            <div class="icon" :style="{backgroundImage: 'url(' + (isPlay ?require('assets/list_stop.png'):require('assets/list_play.png')) + ')'}"></div>
            <!-- <image class="icon" :src="isPlay ?require('assets/list_stop.png'):require('assets/list_play.png')"/> -->
            <text class="title">{{isPlay?'暂停播放':'播放全部'}}</text>
          </div>

          <div class="refresh" @click="refresh">
            <image ref="refreshIcon" class="icon" :src="require('assets/list_refresh.png')"/>
            <text class="title">智能推荐</text>
          </div>
        </div>

        <list ref="playlist" class="playlist">
          <cell v-for="(song, i) in audioPlayer.playlist" :key="i" ref="songcell">
            <songcell :isPlay="isPlay" :index="i" :key="i" :song="song" :selected="audioPlayer.songIndex" @clickSong="clickSong"></songcell>
          </cell>
        </list>

        <div class="playfooter" @click="hideSheet">
          <text class="title">关闭</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const animation = weex.requireModule("animation");
const dom = weex.requireModule("dom");

import network from "../../modules/network/network";
import event from "../../modules/event";
import audioPlayer from "../../modules/audioPlayer";
import CIData from "../../modules/CIData";

import songcell from "../../components/songcell/songcell";

export default {
  components: {
    songcell
  },
  data() {
    return {
      audioPlayer: audioPlayer,
      hidden: true,
      default_tabcenter: require("assets/default_tabcenter.png"),
      isLoading: false
    };
  },
  created() {
    var self = this;
    // audioPlayer.$on('ended', function(e) {
    //   console.log('audioHome ended', e)
    // })
    console.log("audioHome created");

    // audioPlayer.$on('stateChange', function(e) {
    //   console.log("stateChange:", e)
    //   self.isPlay = e
    //   self.stateChange(e)
    // })
  },
  updated() {
    console.log("audioHome updated");
    if (this.$refs.songcell && this.$refs.songcell.length > 0) {
      const el = this.$refs.songcell[audioPlayer.songIndex];
      if (el) {
        dom.scrollToElement(el, { offset: 0 });
      }
    }

    let sheet = document.getElementById("sheet");
    if (!sheet) {
      return;
    }
    if (audioPlayer.playlist.length <= 6) {
      sheet.addEventListener("touchmove", this.forbidScroll, false);
    } else {
      sheet.removeEventListener("touchmove", this.forbidScroll, false);
    }
  },
  mounted() {
    console.log("!!!!!!!!! audioHome mounted");
    // this.checkPlayState()
  },
  destroyed() {
    console.log("!!!!!!!!! audioHome destroyed");
  },
  computed: {
    poster: function() {
      let img = audioPlayer.songPlay.img;

      if (img && img.length > 0) {
        return img;
      } else {
        return this.default_tabcenter;
      }
    },
    isPlay: function() {
      return audioPlayer.isPlay;
    }
  },
  methods: {
    forbidScroll(e) {
      e.preventDefault();
    },
    request: function() {
      let id_array = [];
      for (let song in audioPlayer.playlist) {
        id_array.push(audioPlayer.playlist[song].id);
      }

      let refreshIcon = this.$refs.refreshIcon;
      if (refreshIcon) {
        var self = this;
        this.rotation(refreshIcon, 360, 350, 1, function() {
          self.rotation(refreshIcon, 0, 0, 1, function() {});
        });
      }

      var self = this;
      this.isLoading = true;
      network.getPlayList(JSON.stringify(id_array), function(res) {
        self.isLoading = false;
        if (res.ret === 1 && res.data) {
          if (
            audioPlayer.songPlay &&
            audioPlayer.songPlay.src &&
            audioPlayer.songPlay.src.length > 0
          ) {
            for (let idx in res.data) {
              if (res.data[idx].id === audioPlayer.songPlay.id) {
                res.data.splice(idx,1)
                break
              }
            }
            res.data.unshift(audioPlayer.songPlay);
          }
          audioPlayer.playlist = res.data;
          audioPlayer.songIndex = 0;
        }
      });
    },
    clickAudioCenter(e) {
      CIData.push([
        "trackEvent",
        "wyeth",
        "tabbar_click",
        this.$router.currentRoute.name,
        "audio"
      ]);

      this.hidden = !this.hidden;
      if (!this.hidden && !audioPlayer.isFirst && !this.isPlay) {
        audioPlayer.play();
      }

      if (!audioPlayer.playlist || audioPlayer.playlist.length === 0) {
        this.request();
      }
    },
    hideSheet: function(event) {
      this.hidden = true;
    },
    refresh: function() {
      console.log("点击刷新");
      this.request();
      CIData.push(["trackEvent", "wyeth", "smart_refresh", "", ""]);
    },
    clickBg: function(event) {
      // event.stopPropagation()
    },
    clickSong: function(event) {
      CIData.push([
        "trackEvent",
        "wyeth",
        "smart_click",
        "cid",
        audioPlayer.songPlay.id
      ]);

      this.$emit("songChange", event.index);
      console.log("clickSong:", event);
      if (audioPlayer.songIndex === parseInt(event.index) && this.isPlay) {
        this.hidden = true;
        this.$router.push("/courseAudio/" + audioPlayer.songPlay.id);
      } else {
        audioPlayer.autoPlay = true;
        audioPlayer.songIndex = parseInt(event.index);
        audioPlayer.play();
      }
    },
    start: function() {
      let state = audioPlayer.isPlay ? "pause" : "play";
      CIData.push(["trackEvent", "wyeth", "smart_control", "state", state]);
      audioPlayer.start();
    },
    rotation: function(obj, deg, duration, count, callback) {
      var self = this;
      animation.transition(
        obj,
        {
          styles: {
            transform: "rotate(" + deg + "deg)",
            transformOrigin: "center center"
          },
          duration: duration,
          timingFunction: "linear"
        },
        function() {
          callback && callback();
        }
      );
    }
  }
};
</script>

<style lang = "sass" scope>
  @import './audioHome.scss'
</style>
