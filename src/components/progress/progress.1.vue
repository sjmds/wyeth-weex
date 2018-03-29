<template>
  <div class = "progress" :style = "{ width: progressWidth_ + 'px', left: scheduleLeft_ + 'px' }">
    <div class = "progress-total">
      <div class = "progress-current" :style = "{ width:rate * progressWidth_ + 'px' }">
      </div>
      <div class = "progress-dot" :style = "{left: (dotlock?rate_:rate) * progressWidth_ + 'px',backgroundImage:'url('+ dotIcon +')'}" @touchmove = "touchmove" @touchstart = "touchstart" @touchend = "touchend"></div>
    </div>

    <!--<text class = "currentTime">-->
    <!--{{ timeFormit(currentTime) }}-->
    <!--</text>-->

    <!--<text class = "duration">-->
    <!--{{ timeFormit(duration) }}-->
    <!--</text>-->
    <!-- ontouchmove = "console.log(event)" -->
  </div>
</template>


<script>
  import Base from '../../mixins/base'

  export default {
    mixins: [Base],
    props: {
      progressWidth: {
        type: Number,
        required: false,
        default: 750
      },
      scheduleLeft: {
        type: Number,
        required: false,
        default: 0
      },
      dotIcon: {
        type: String,
        required: false,
        default: require('assets/play_dot.png')
      },
      rate: {
        type: Number,
        required: false,
        default: 0
      }
    },
    data () {
      return {
        progressWidth_: this.rpx(this.progressWidth, false),
        scheduleLeft_: this.rpx(this.scheduleLeft, false),
        rate_: 0,
        dotlock: false
      }
    },
    created () {

    },
    watch: {
      dotlock (val) {
        !val && (this.rate_ = this.rate)
      }
    },
    methods: {
      touchmove: function (e) {
        let offsetX = e.changedTouches[0].clientX - this.scheduleLeft_

        if (offsetX >= 0 && offsetX <= this.progressWidth_) {
          this.rate_ = offsetX / this.progressWidth_

          this.$emit('progressChange', this.rate_)
        }
      },
      touchstart: function (e) {
        this.dotlock = true

        let offsetX = e.changedTouches[0].clientX - this.scheduleLeft_

        if (offsetX >= 0 && offsetX <= this.progressWidth_) {
          this.rate_ = offsetX / this.progressWidth_

          this.$emit('progressStart', this.rate_)
        }
      },
      touchend: function (e) {
        let offsetX = e.changedTouches[0].clientX - this.scheduleLeft_

        if (offsetX >= 0 && offsetX <= this.progressWidth_) {
          this.rate_ = offsetX / this.progressWidth_

          this.$emit('progressEnd', this.rate_)
        }

        this.dotlock = false
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import './progress.scss'
</style>
