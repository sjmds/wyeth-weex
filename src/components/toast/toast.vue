<template>
  <div class = "OHSToast-container" v-show = "isShow">
    <transition name = "fade">
      <div id = "OHSToast">
        <div class = "OHSToast-image" :style = "{backgroundImage:'url(' + icon + ')',width:width + 'px',height:height + 'px'}"></div>
        <text class = "OHSToast-text">{{ text }}</text>
      </div>
    </transition>
  </div>
</template>

<script>

  import event from '../../modules/event'
  import Base from '../../mixins/base'

  export default {
    mixins: [Base],
    data () {
      return {
        types: {
          'success': {
            duration: 1500,
            icon: require('assets/toast_success.png'),
            text: '成功',
            width: this.rpx(99),
            height: this.rpx(71)
          },
          'fail': {
            duration: 2000,
            icon: require('assets/toast_fail.png'),
            text: '失败',
            width: this.rpx(103),
            height: this.rpx(103)
          },
          'loading': {
            duration: 10000,
            icon: require('assets/toast_loading.gif'),
            text: '数据加载中',
            width: this.rpx(52),
            height: this.rpx(52)
          },
          'MQ': {
            duration: 1500,
            icon: require('assets/toast_MQ.png'),
            text: 'MQ积分+',
            width: this.rpx(79),
            height: this.rpx(68)
          }
        },
        width: this.rpx(99),
        height: this.rpx(71),
        icon: '',
        text: '',
        isShow: false,
        duration: 1500,
        type: 'success'
      }
    },
    created () {
      var self = this
      event.addEventListener('toast', function (data) {
        if (data.type && self.types[data.type]) {
          let params = self.types[data.type]
          self.duration = params.duration
          self.icon = params.icon
          self.text = params.text
          self.width = params.width
          self.height = params.height

          self.type = data.type
        }

        if (data.icon) self.icon = data.icon
        if (data.text) self.text = data.text
        if (data.duration) self.duration = data.duration

        self.show()
      })

      event.addEventListener('toast_loading_start', function () {
        self.type = 'loading'

        let params = self.types[self.type]
        self.duration = params.duration
        self.icon = params.icon
        self.text = params.text
        self.width = params.width
        self.height = params.height

        self.show()
      })

      event.addEventListener('toast_loading_end', function () {
        if (self.type === 'loading' && self.isShow) {
          self.hide()
        }
      })
    },
    methods: {
      show: function () {
        this.isShow = true
        var self = this
        setTimeout(function () {
          self.isShow = false
        }, this.duration)
      },
      hide: function () {
        this.isShow = false
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import './toast.scss'
</style>
