<template>
  <div class = "o-user-panel-container" @click = "userInfoClick">
    <image class = "o-user-panel-avatar" :src = "info.img"/>
    <div class = "o-user-panel-text-info">
      <text class = "o-user-panel-text-nickname">{{ info.nickname }}</text>
      <text class = "o-user-panel-text-pre-date">{{ info.preDate }}</text>
    </div>
    <image class = "o-user-panel-more-img" :src = "require('assets/icon-me-more.png')"/>
  </div>
</template>

<script>
  export default {
    props: {
      info: {
        type: Object,
        required: true
      }
    },
    methods: {
      userInfoClick () {
        this.$emit('userInfoClick')
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
