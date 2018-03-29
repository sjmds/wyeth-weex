<template>
  <!--<div class = "o-cells-title-bg-cell" v-on:click = "click(articleaddress)">-->

  <OCellSTitleBGCell
    :imgaddress = "obj.img"
    :readcounter = " Number(obj['scan_num']) || 0"
    :title = "obj.title"
    :articletime = "makeDate(obj['showed'])"
    articleaddress = "null"
    categoryname = "魔栗妈咪学院"
    @onClick = "itemClick(obj)"
    v-on:message = "msg">
  </OCellSTitleBGCell>

</template>

<script>

  import OCellSTitleBGCell from './O-CellS-Title-BG-Cell.vue'

  export default {
    props: {
      obj: {
        type: Object,
        required: true
      }
    },
    components: {
      OCellSTitleBGCell
    },
    data () {
      return {

      }
    },
    methods: {
      makeDate (time) {
        let timeArr = []
        timeArr = time.split(' ')
        return timeArr[0]
      },
      msg: function (counter) {
        this.$emit('count', counter)
      },
      itemClick (item) {
//        this.$emit('itemClick', item)
        this.$router.push('/cmsPageInfo/' + item.id)
      }
    },

    created: function () {

    }
  }
</script>

<style lang = "sass" scoped>
  @import './O-CellS-Title-BG-Cell'
</style>
