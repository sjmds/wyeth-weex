<template>
  <div class="ohs-icon-text-panels-container">
    <OImgTextPanel
      v-for="item, index in imgTextPanels"
      :key="index"
      :panelInfo="item"
      :style="'width: ' + 750 / imgTextPanels.length + 'px'"
      @itemClick="iconTextCellClick(index)">
    </OImgTextPanel>
  </div>
</template>

<script>
  import OImgTextPanel from '../../../components/imgTextPanel'

  export default {
    components: {
      'OImgTextPanel': OImgTextPanel.weexComponent
    },
    props: {
      imgTextPanels: {
        type: Array
      }
    },
    methods: {
      iconTextCellClick (index) {
        this.$emit('iconTextCellClick', index)
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "./index.scss"
</style>
