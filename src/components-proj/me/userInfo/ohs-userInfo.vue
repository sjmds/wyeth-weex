<template>
  <div>
    <OUserPanel :info = "info" @userInfoClick = "userInfoClick"></OUserPanel>
    <div class = "ohs-userinfo-text-panel-container">
      <OTextPanel
        v-for = "(item, index) in textPanel"
        :key = "index"
        :content = "item.content"
        :title = "item.title"
        :redDot = "item.redDot"
        :last = "index === textPanel.length - 1"
        @textPanelClick = "textPanelClick(item.src, index)">
      </OTextPanel>
    </div>
  </div>
</template>

<script>
  import OUserPanel from '../../../components/userPanel/index'
  import OTextPanel from '../../../components/textPanel/index'

  export default {
    components: {
      'OUserPanel': OUserPanel.weexComponent,
      'OTextPanel': OTextPanel.weexComponent
    },
    props: {
      info: {
        type: Object
      },
      textPanel: {
        type: Array
      }
    },
    methods: {
      userInfoClick () {
        this.$emit('userInfoClick')
      },
      textPanelClick (src, index) {
        this.$emit('textPanelClick', src, index)
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
