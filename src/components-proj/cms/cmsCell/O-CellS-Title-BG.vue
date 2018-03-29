<template>
  <div class = "o-cells-title-bg">
    <div class = "cell" v-for = "item in listItems">
      <OCellSTitleBGCell
              :avatar = "item.author_avatar"
              :imgaddress = "item.img"
              :readcounter = "item.readcounter"
              :title = "item.title"
              :articletime = "item.date"
              :articleaddress = "item.link"
              :categoryname = "item.categoryname"
              @onClick = "itemClick(item)"
              v-on:message = "msg">
      </OCellSTitleBGCell>
    </div>
  </div>
</template>

<style>
    .o-cells-title-bg{
        background-color: #F0EFEE;
    }
</style>

<script>
  import OCellSTitleBGCell from './O-CellS-Title-BG-Cell.vue'
  /**
   * 将信息传递给子组件
   */
  export default {
    name: 'OCellSTitleBG',

    components: {
      OCellSTitleBGCell
    },

    props: {
      /**
       * 接收外来的数据，并以数组的形式传递数据
       */
      listItems: {
        type: Array,
        required: true
      }
    },

    /**
     * 接收子组件传来的阅读量，可以将其传给服务端
     */
    methods: {
      msg: function (counter) {
        this.$emit('count', counter)
      },
      itemClick (item) {
        this.$emit('itemClick', item)
      }
    }
  }
</script>
