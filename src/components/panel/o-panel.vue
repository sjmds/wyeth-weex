<template>
  <div class = "o-cells-class-header"
       :style = "headerStyle" >
    <div class = "o-cells-div-header-title" >
      <image class = "o-cells-title-img"
             :src = "imgLeft"
             v-show = "imgLeft!== ''"
             :style = "imgLeftStyle"/>
      <text class = "o-cells-header-title"
            :style = "titleStyle"
            :lines="1" style="-webkit-line-clamp: 1;">{{title}}</text>
    </div>
    <div class = "o-cells-div-more" :id = "rightid" v-show = "!noextra" @click = "more">
      <text class = "o-cells-more-text"
            :style = "extraStyle">{{extra}}</text>
      <image class = "o-cells-more-img"
             :style = "imgRightStyle"
             :src = "imgRight"/>
    </div>
  </div>
</template>
<script>
  // 其它用法与vue相同
  import Base from '../../mixins/base'
  export default {
    mixins: [Base],
    props: {
      rightid: String,
      bgColor: {
        type: String,
        default: '#ffffff'
      },
      imgBg: {
        type: String,
        default: function () {
          return ''
        }
      },
      imgLeftWidth: {
        type: Number,
        default: function () {
          return 10
        }
      },
      imgLeftHeight: {
        type: Number,
        default: function () {
          return 38
        }
      },
      imgRightWidth: {
        type: Number,
        default: function () {
          return 28
        }
      },
      imgRightHeight: {
        type: Number,
        default: function () {
          return 28
        }
      },
      imgLeft: {
        type: String,
        default: function () {
          return ''
        }
      },
      imgRight: {
        type: String,
        default: function () {
          return require('assets/more.png')
        }
      },
      title: {
        type: String,
        required: function () {
          return true
        }
      },
      titleColor: {
        type: String,
        default: function () {
          return '#000000'
        }
      },
      extraColor: {
        type: String,
        default: function () {
          return '#000000'
        }
      },
      extra: {
        type: String,
        default: function () {
          return '更多'
        }
      },
      noextra: {
        type: Boolean,
        default: function () {
          return false
        }
      },
      height: {
        type: Number,
        default: function () {
          return 86
        }
      },
      extraSize: {
        type: Number,
        default: function () {
          return 25
        }
      },
      titleSize:{
        type: Number,
        default: function () {
          return 29
        }
      },
      paddingRight: {
        type: Number,
        default: function () {
          return 10
        }
      },
      paddingLeft: {
        type: Number,
        default: function () {
          return 10
        }
      },
      titlePaddingLeft: {
        type: Number,
        default: function () {
          return 10
        }
      },
      titlePaddingRight: {
        type: Number,
        default: function () {
          return 10
        }
      },
      extraPaddingLeft: {
        type: Number,
        default: function () {
          return 10
        }
      },
      extraPaddingRight: {
        type: Number,
        default: function () {
          return 10
        }
      }
    },
    data () {
      return {

      }
    },
    computed: {
      headerStyle () {
        return {
          height: this.rpx(this.height, true),
          backgroundImage: this.imgBg === '' ? 'none' : 'url(' + this.imgBg + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundColor: this.bgColor,
          paddingLeft: this.rpx(this.paddingLeft, true),
          paddingRight: this.rpx(this.paddingRight, true)
        }
      },
      titleStyle () {
        return {
          fontSize: this.rpx(this.titleSize, true),
          color: this.titleColor,
          paddingLeft: this.rpx(this.titlePaddingLeft, true),
          paddingRight: this.rpx(this.titlePaddingRight, true)
        }
      },
      extraStyle () {
        return {
          fontSize: this.rpx(this.extraSize, true),
          color: this.extraColor,
          paddingLeft: this.rpx(this.extraPaddingLeft, true),
          paddingRight: this.rpx(this.extraPaddingRight, true)
        }
      },
      imgLeftStyle () {
        return {
          width: this.rpx(this.imgLeftWidth, true),
          height: this.rpx(this.imgLeftHeight, true)
        }
      },
      imgRightStyle () {
        return {
          width: this.rpx(this.imgRightWidth, true),
          height: this.rpx(this.imgRightHeight, true)
        }
      }
    },
    created () {
      console.log('bg' + this.imgBg)
    },
    methods: {
      more: function () {
        this.$emit('more')
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
