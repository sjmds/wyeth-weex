/**
 * Created by admin on 17/7/31.
 */
<template>
  <div class = "wyeth-tabber-container">
    <div class = "wyeth-tabber-item"
         v-for = "tag,index in tags"
         @click = "onClick(index)">
      <image class = "wyeth-tabber-item-img"
             :src = "current === index?tag.src_pressed:tag.src_default"/>
      <text class = "wyeth-tabber-item-txt"
            :style = "current === index?lightStyle:textStyle">{{tag.text}}</text>
    </div>

  </div>
</template>

<script>
// 其它用法与vue相同
import config from '../../config.json'
export default {
  props: {},
  data () {
    return {
      tags: [
        {
          text: '首页',
          src_pressed: require('assets/home.png'),
          src_default: require('assets/home2.png')
        },
        {
          text: '全部',
          src_pressed: require('assets/all.png'),
          src_default: require('assets/all2.png')
        },
        {
          text: '我的',
          src_pressed: require('assets/mine.png'),
          src_default: require('assets/mine2.png')
        }
      ],
      current: 0
    }
  },
  computed: {
    textStyle () {
      return {
        color: '#666666'
      }
    },
    lightStyle () {
      return {
        color: '#cd9e29'
      }
    }
  },
  methods: {
    onClick (index) {
      if (this.current !== index) {
        var oldid = this.current
//        this.current = index

        this.$emit('onSelect', {'index1': oldid, 'index2': index})
        if (index === 0) {

        } else if (index === 1) {
          window.location.href = window.wyeth_host + '/mobile/all'
        } else if (index === 2) {
          window.location.href = window.wyeth_host + '/mobile/mine'
        }
      }
    }
  }
}
</script>

<style lang = "sass" scope>
  @import './wyethTabbar.scss'
</style>
