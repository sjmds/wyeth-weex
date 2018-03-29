<template>
  <div class = "o-text-panel-container" :style = "widthStyle" @click = "textPanelClick">
    <div class = "o-text-panel-container-main">
      <div class = "o-text-panel-text-dot-con">
        <text class = "o-text-panel-text-content">{{ content }}</text>
        <div v-if = "redDot" class = "o-text-panel-red-dot"></div>
      </div>
      <text class = "o-text-panel-text-title">{{ title }}</text>
    </div>
    <div v-if = "!last" class = "o-text-panel-text-divider"></div>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        required: true,
        default: '默认'
      },
      content: {
        type: String,
        required: true,
        default: '默认'
      },
      redDot: {
        type: Boolean,
        default: false
      },
      last: {
        type: Boolean,
        default: false
      },
      widthStyle: {
        type: String,
        default: 'width: 250px'
      }
    },
    methods: {
      textPanelClick () {
        this.$emit('textPanelClick')
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
