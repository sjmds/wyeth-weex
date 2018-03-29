<template>
  <div class = "o-expand-list-container" :style = "listStyle">
    <div @click = "toggle" :style = "itemStyle">
      <slot name = "header"></slot>
    </div>
    <list v-if = "show" :style = "itemStyle">
      <slot name = "expand"></slot>
    </list>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        show: false
      }
    },
    props: {
      listStyle: {
        type: Object
      },
      itemStyle: {
        type: Object
      },
      index: {
        type: Number
      }
    },
    methods: {
      toggle () {
        this.show = !this.show
        this.$emit('clickHeader', this.index, this.show)
      }
    }
  }
</script>

<style>
  @import "./index.scss";
</style>
