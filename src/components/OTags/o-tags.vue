<template>
  <div class = "o-tag-container">
    <div  class = "o-tagitem" v-for = "(item,index) in tags"
          :id = "ids&&ids[index]"
          @click = "onTagClick(index)">
      <image class = "o-tag-img" :style = "imgStyle"  :src = "item.img"/>
      <text class = "o-tag-text" :style = "txtStyle">{{item.title}}</text>
    </div>
  </div>
</template>

<script>
import Base from '../../mixins/base'
// 其它用法与vue相同
export default {
  mixins: [Base],
  props: {
    ids: Array,
    tags: {
      type: Array,
      required: true
    },
    cloumns: {
      type: Number,
      required: true
    },
    imgSize: {
      type: Number,
      required: true
    },
    txtSize: {
      type: Number,
      required: true
    },
    space: {
      type: Number,
      default () {
        return 15
      }
    }
  },
  created () {

  },
  data () {
    return {
      imgStyle: {
        width: this.rpx(this.imgSize, true),
        height: this.rpx(this.imgSize, true)
      },
      txtStyle: {
        marginTop: this.rpx(this.space, true),
        fontSize: this.rpx(this.txtSize, true)
      }
    }
  },
  methods: {
    onTagClick: function (index) {
      this.$emit('onTagClick', index)
    }
  }
}
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
