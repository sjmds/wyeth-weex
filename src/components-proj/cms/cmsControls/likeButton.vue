<template>
  <div class="likeButton" @click="clickLike">
    <div class="likeButton-icon" :style="{backgroundImage:(isLike?likeStyle[1].buttonImage:likeStyle[0].buttonImage)}"></div>
    <text class="likeButton-text" :lines="1">赞</text>
  </div>
</template>

<script>

import network from '../../../modules/network/network'
import event from '../../../modules/event'
import CIData from '../../../modules/CIData'

export default {
  name: 'likeButton',
  props: {
    pageInfo: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      likeStyle: [
        {
          buttonImage: 'url(' + require('assets/like_normal.png') + ')'
        },
        {
          buttonImage: 'url(' + require('assets/like_selected.png') + ')'
        }
      ]
    }
  },
  computed: {
    isLike: function () {
      console.log('设置 likeButton: ', this.pageInfo)
      return this.pageInfo.isLike || false
    }
  },
  methods: {
    clickLike: function () {
      var self = this

      if (!this.isLike) {
        CIData.push(['trackEvent', 'wyeth', 'cms_like', 'pid', this.pageInfo.id])
      }

      network.getCMSLike({article_id: this.pageInfo.id, is_cancel: self.isLike ? 1 : 0}, res => {
        if (res.ret === 1) {
          event.sendEvent('toast', {type: 'success', text: self.isLike ? '取消点赞成功' : '点赞成功'})
          self.$emit('clickLike', {
            article_id: self.pageInfo.id,
            isLike: self.isLike ? 0 : 1
          })
        }
      })
    }
  }
}
</script>

<style lang = "sass" scope>
  @import './likeButton.scss'
</style>
