<template>
  <div class = "tabbar-item" @click = "onClick">
    <slot v-if = "!actived" name = "normal"></slot>
    <slot v-else name = "active"></slot>
    <CIcon v-if = "!$slots.normal&&$parent&&$parent.imageType === 'iconfont'"
           size = "54"
           :color = "icon_actived"
           :iconID = "tabicon"></CIcon>
    <div v-if = "!$slots.normal&&$parent&&$parent.imageType === 'image'"
         class = "icon-image"
         :style = "imgStyle"
    ></div>
    <text class = "text"
          :style = "text_actived">{{label}}</text>
  </div>
</template>
<script>
  import CIcon from '../icon/C-Icon'
  import Base from '../../mixins/base'

  const modal = weex.requireModule('modal')
  export default {
    mixins: [Base],
    name: 'OTabbarItem',
    props: {
      label: {
        default: ''
      },
      index: String,
      // 图片模式的地址
      normalUrl: {
        default: ''
      },
      activeUrl: {
        default: ''
      },
      defaultColor: {
        default: '#999999'
      },
      activedColor: {
        default: '#09BB07'
      },
      tabicon: {
        default: '&#xe7d5'
      },
      imgSize: {
        type: Number,
        default: 44
      },
      fontSize: {
        type: Number,
        default: 20
      },
      space: {
        type: Number,
        default: 10
      }
    },
    components: {
      CIcon
    },
    data () {
      return {
        $parent: null
      }
    },
    computed: {
      actived () {
        let a = this.$parent && this.$parent.value === this.index
        let b = this.index === 'home' && this.$parent.value === 'index'
        return a || b
      },
      // text_actived () {
      //   return [this.actived ? 'text-active' : '']
      // },
      text_actived () {
        return {
          color: this.actived ? this.activedColor : this.defaultColor,
          fontSize: this.rpx(this.fontSize, true)
        }
      },
      img_actived () {
        return this.actived ? `${this.activeUrl}` : `${this.normalUrl}`
      },
      icon_actived () {
        return this.actived ? `${this.activedColor}` : `${this.defaultColor}`
      },
      imgStyle () {
        return {
          width: this.rpx(this.imgSize, true),
          height: this.rpx(this.imgSize, true),
          marginBottom: this.rpx(this.space, true),
          backgroundImage: 'url("' + this.img_actived + '")',
          backgroundSize: 'cover'
        }
      }
    },
    methods: {
      onClick () {
        if (this.$parent) {
          this.$parent.selectBar(this.index)
          if (this.$router && this.$parent.router) {
            this.$router.push({name: this.index})
          } else {
            this.$emit('click')
          }
        }
      }
    },
    created () {
      let parent = this.$parent
      while (parent.$parent && parent.$options._componentTag !== 'OTabbar') {
        parent = parent.$parent
      }
      if (parent.$options._componentTag !== 'OTabbar') {
        modal.toast({ message: 'u-tabbar-item不能单独使用', duration: 0.3 })
        return
      }
      this.$parent = parent
    },
    beforeDestroy () {
      this.$parent && this.$parent.removeBar(this)
    }
  }
</script>
<style lang = "sass" scoped>
  @import './o-tabbaritem.scss'
</style>
