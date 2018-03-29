<template>
  <div class = "container" :style = "{ backgroundColor: backgroundColor }" @click = "onclickitem">
    <CIcon v-if = "tabicon"
           size = "54"
           :color = "iconcolor"
           :iconID = "tabicon"></CIcon>
    <image
      v-if = "iconimage"
      class = "tab-icon"
      :src = "iconimage"/>
    <text class = "tab-text" :style = "{ color: titleColor }">{{label}}</text>
  </div>
</template>

<script>
  import CIcon from '../icon/C-Icon.vue'
  export default {
    components: {
      CIcon
    },
    name: 'OWTabbarItem',
    props: {
      index: {
        default: 0
      },
      label: {
        default: ''
      },
      titleColor: {
        default: ''
      },
      iconcolor: {
        default: ''
      },
      iconimage: {
        default: ''
      },
      backgroundColor: {
        default: '#ffffff'
      },
      tabicon: {
        default: '&#xe7d5'
      }
    },
    methods: {
      onclickitem (e) {
        this.$emit('tabItemOnClick', {
          index: this.index
        })
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import './ow-tabbaritem.scss'
</style>
