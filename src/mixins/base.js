import data from '../data'
import { fetchAll } from '../modules/network'
import event from '../modules/event'

export default {

  async created() {
    this.hasCreated = true
    if (this.graySkin) {
      event.sendEvent('graySkin', { show: true })
    }

    if (this.depend && typeof this.depend === 'function') {
      let date = new Date()
      console.log('fetchAll in created' + (date.getSeconds() * 1000 + date.getMilliseconds()))

      try {
        let dataKeys = this.depend()
        await fetchAll(dataKeys)
        if (this.resolve && typeof this.resolve === 'function') {
          this.resolve()
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  async updated() {
    if (this.graySkin) {
      this.graySkin = false
      event.sendEvent('graySkin', { show: false })
    }
  },
  activated() {
    if (this.$route.params.nokeep && !this.hasCreated) {
      console.log('xxx', this.$options._componentTag)
      let d = this.$options.data()
      let self = this
      Object.keys(d).map(function (s) {
        if (self.$data[s] !== null) {
          self.$data[s] = d[s]
        }
      })
      if (this.$options.created) {
        for (let created of this.$options.created) {
          if (typeof created === 'function') {
            created.call(self)
          }
        }
      }
    }
    this.hasCreated = false
  },
  deactivated() {
    if (this.$parent.$el.id === 'app') {
      console.log('info---keepAlive', this.keepAlive)
      if (!this.keepAlive) {
        console.log('info---$destroy')
        // this.$destroy()
      }
      console.log('info---keepAlive', this.$data)
    }
  },
  methods: {
    /**
     * 取或设置store里面的data
     * @param key
     * @param val
     * @returns {*}
       */
    store(key, val) {
      return data.store(key, val)
    },

    /**
     * 设计稿像素值转实际的像素
     * @param num
     * @param needPx
     * @returns {string}
     */
    rpx(num, needPx) {
      let len = num

      if (process.env.COMPILE_ENV === 'vue') {
        len = num / 750 * window.innerWidth
      }

      if (num !== 0 && len < 1) {
        len = 1
      }

      return needPx ? `${len}px` : len
    },

    /**
     * route.params改变，重新加载数据
     */
    async reload() {
      console.log('mixins reload')
      if (this.depend && typeof this.depend === 'function') {
        let date = new Date()
        console.log('fetchAll in created' + (date.getSeconds() * 1000 + date.getMilliseconds()))

        try {
          let dataKeys = this.depend()
          await fetchAll(dataKeys)
          if (this.resolve && typeof this.resolve === 'function') {
            this.resolve()
          }
        } catch (e) {
          console.error(e)
        }
      }
    },
    createAnimation: function (params, bindKey) {
      // 小程序和weex都支持的函数
      params.timingFunction = ['linear', 'ease-in', 'ease-out', 'ease-in-out', 'ease'].indexOf(params.timingFunction) >= 0
        ? params.timingFunction : 'liner'

      if (params.styles && params.styles.transformOrigin) {
        var origins = params.styles.transformOrigin.split(' ')
        var x, y
        x = y = '50%'

        if (origins[0] === 'left') x = '0%'
        if (origins[0] === 'right') x = '100%'
        if (origins[1] === 'top') y = '0%'
        if (origins[1] === 'bottom') y = '100%'
        params.transformOrigin = x + ' ' + y + ' 0'
      }

      if (process.env.COMPILE_ENV === 'wechat') {
        var animation = wx.createAnimation({
          duration: params.duration,
          timingFunction: params.timingFunction,
          delay: params.delay,
          transformOrigin: params.transformOrigin
        })

        if (params.styles) {
          var commonKeys = ['width', 'height', 'backgroundColor', 'opacity']
          var singleKeys = ['translateX', 'translateY', 'scale', 'scaleX', 'scaleY', 'rotate', 'rotateX', 'rotateY']
          var doubleKeys = ['translate']

          for (var key in params.styles) {
            if (commonKeys.indexOf(key) >= 0) {
              animation[key](params.styles[key])
            }
          }

          if (params.styles.transform) {
            params.styles.transform.split(' ').map(function (str) {
              var fun = str.replace(/\s/g, '').match(/([a-zA-Z]+)\([0-9px,]+\)/)[1]

              function getParam(str) {
                return str.replace(/\s/g, '').match(/[a-zA-Z]+\(([0-9px,]+)\)/)[1]
              }

              function getParams(str) {
                return [
                  str.replace(/\s/g, '').match(/[a-zA-Z]+\(([0-9px]+),[0-9px]+\)/)[1],
                  str.replace(/\s/g, '').match(/[a-zA-Z]+\([0-9px]+,([0-9px]+)\)/)[1]
                ]
              }

              if (singleKeys.indexOf(fun) >= 0) {
                animation[key](getParam(fun))
              }

              if (doubleKeys.indexOf(fun) >= 0) {
                animation[key](...getParams(fun))
              }
            })
          }
        }

        this.setData({
          bindKey: animation.step().export()
        })
      } else {
        this[bindKey] = params
      }
    }
  }
}
