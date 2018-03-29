<template>
  <div class = "ohs-slide-panel_container">
    <slider :style = "sliderStyle"
            @change = "onChange"
            :interval = "interval"
            :auto-play = "autoPlay">
      <div class = "frameStyle"
           v-for = "(item,index) in items"
           :style = "sliderStyle"
           :aa = "index">
        <div class = "ohs-slide-panel_main_container">
          <image class = "ohs-slide-panel_main_icon" :src = "item.icon"/>
          <div>
            <div class = "ohs-slide-panel_txt_container">
              <text class = "ohs-slide-panel_main_txt">{{ item.title }}</text>
              <text class = "ohs-slide-panel_main_price">{{ item.mission }}</text>
            </div>
            <div class = "ohs-slide-panel_progress_container">
              <div class = "ohs-slide-panel_progress_done" :style = "progressWidth(item)"></div>
              <text class = "ohs-slide-panel_progress_text">{{ item.progress + item.left }}/{{ item.total }}</text>
            </div>
          </div>
          <text :class = "item.progress === item.total ? 'ohs-slide-panel_button_disable' : 'ohs-slide-panel_button'" @click = "missionClick(item)">{{ item.progress === item.total ? '已领取' : (item.left === 0 ? '做任务' : '领取') }}</text>
        </div>
      </div>
    </slider>
    <div v-show = "showIndicator" class = "ohs-slide-panel_indicator_wrap">
      <OIndicator
        :num = "items.length"
        :index = "index"
        :potWidth = "18"
        :potHeight = "20"
        :imgSelected = "require('assets/pot_selected.png')"
        :imgDefault = "require('assets/pot_default.png')"></OIndicator>
    </div>

  </div>
</template>

<script>
  import Base from '../../../mixins/base'
  import OIndicator from '../../../components/indicator'
  export default {
    mixins: [Base],
    components: {
      OIndicator: OIndicator.weexComponent
    },
    props: {
      hrefs: Array,
      items: {
        type: Array,
        required: true
      },
      showIndicator: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      width: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
        required: true
      },
      autoPlay: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      interval: {
        type: Number,
        default: function () {
          return 1500
        }
      }
    },
    computed: {
      sliderStyle () {
        return {
          width: this.rpx(this.width, true),
          height: this.rpx(this.height, true)
        }
      },
      frameStyle () {
        return {
          width: this.rpx(this.width, true),
          height: this.rpx(this.height, true)
        }
      },
      imageStyle () {
        return {
          width: this.rpx(this.width, true),
          height: this.rpx(this.height, true)
        }
      }
    },
    data () {
      return {
        index: 1
      }
    },
    methods: {
      onChange (event) {
        this.index = event.index + 1
      },
      progressWidth (item) {
        return {
          width: this.rpx(430 / item.total * (item.progress + item.left), true)
        }
      },
      missionClick (item) {
        this.$emit('missionClick', item)
      }

    }

  }
</script>

<style lang = "sass" scoped>
  @import "index.scss"
</style>
