<template>
  <div class="progress" :style="{ width: progressWidth_ + 'px', left: scheduleLeft_ + 'px' }">
    <div class="progress-total-bg">
    </div>
    <div class="progress-total">
      <div class="progress-current" :style="{ width:rate * progressWidth_ + 'px' }">
      </div>
      <div class="progress-dot" :style="{left: (dotlock?rate_:rate) * progressWidth_ + 'px',backgroundImage:'url('+ dotIcon +')'}" @touchmove="touchmove" @touchstart="touchstart" @touchend="touchend">
        <text class="progress-time">{{timeFormit(currentTime)}} / {{timeFormit(duration)}}</text>
      </div>
    </div>
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
      default: require('assets/play_bar.png')
    },
    rate: {
      type: Number,
      required: false,
      default: 0
    },
    currentTime: {
      type: Number,
      required: false,
      default: 0
    },
    duration: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      progressWidth_: this.rpx(this.progressWidth, false),
      scheduleLeft_: this.rpx(this.scheduleLeft, false),
      rate_: 0,
      dotlock: false
    }
  },
  created() {

  },
  watch: {
    dotlock(val) {
      !val && (this.rate_ = this.rate)
    }
  },
  methods: {
    touchmove: function(e) {
      let offsetX = e.changedTouches[0].clientX - this.scheduleLeft_

      if (offsetX >= 0 && offsetX <= this.progressWidth_) {
        this.rate_ = offsetX / this.progressWidth_

        this.$emit('progressChange', this.rate_)
      }
    },
    touchstart: function(e) {
      this.dotlock = true

      let offsetX = e.changedTouches[0].clientX - this.scheduleLeft_

      if (offsetX >= 0 && offsetX <= this.progressWidth_) {
        this.rate_ = offsetX / this.progressWidth_

        this.$emit('progressStart', this.rate_)
      }
    },
    touchend: function(e) {
      let offsetX = e.changedTouches[0].clientX - this.scheduleLeft_

      if (offsetX >= 0 && offsetX <= this.progressWidth_) {
        this.rate_ = offsetX / this.progressWidth_

        this.$emit('progressEnd', this.rate_)
      }

      this.dotlock = false
    },
    timeFormit: function(seconds) {
      seconds = parseFloat(seconds)
      if (!seconds || seconds <= 0) {
        return '00:00'
      }
      seconds = parseInt(seconds)

      function add0(m) {
        return m === 0 ? '00' : (m < 10 ? '0' + m : m)
      }
      return add0(parseInt(seconds / 60)) + ':' + add0(seconds % 60)
    }
  }
}
</script>

<style lang = "sass" scoped>
  @import './progress.scss'
</style>
