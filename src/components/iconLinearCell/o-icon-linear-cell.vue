<template>
  <div class = "o-icon-linear-cell-container" @click = "linearCellClick(linearCell.src)">
    <image class = "o-icon-linear-cell-icon" :src = "linearCell.iconLeft"/>
    <text class = "o-icon-linear-cell-text">{{ linearCell.title }}</text>
    <image @click = "iconClick" class = "o-icon-linear-cell-right-icon" :src = "linearCell.iconRight" :style = "linearCell.style"/>
    <div v-if = "linearCell.redDot" class = "o-icon-linear-cell-redDot"></div>
  </div>
</template>

<script>
  export default {
    props: {
      linearCell: {
        type: Object
      }
    },
    methods: {
      linearCellClick (src) {
        this.$emit('linearCellClick', src)
//        modal.toast({
//          message: src,
//          duration: 0.3
//        })
      },
      iconClick () {
        this.$emit('iconClick')
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
