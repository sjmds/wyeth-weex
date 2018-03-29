<template>
  <div class = "loading">
    <div v-if = "!showloading" class = "loadingline"></div>
    <image v-if = "showloading" class = "img" :src = "require('assets/loading.gif')"/>
    <text class = "o-loading-text"
          :style = "{color:color,'background-color':backgroundcolor}">
      <slot></slot>
    </text>
  </div>
</template>
<script>
  export default {
    name: 'OLoadingMore',
    props: {
      color: {
        default: '#999999'
      },
      backgroundcolor: {
        default: ''
      },
      showloading: {
        type: Boolean,
        default: true
      }
    }
  }
</script>
<style lang = "sass" scoped>
  @import 'index'
</style>
