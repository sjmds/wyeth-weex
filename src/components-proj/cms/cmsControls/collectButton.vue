<template>
  <div class="collectButton" @click="clickLike">
    <div class="collectButton-icon" :style="{backgroundImage:(isSave?likeStyle[1].buttonImage:likeStyle[0].buttonImage)}"></div>
    <text class="collectButton-text" :lines="1">{{isSave?likeStyle[1].buttonTitle:likeStyle[0].buttonTitle}}</text>
  </div>
</template>

<script>

import network from '../../../modules/network/network'
import event from '../../../modules/event'
import CIData from '../../../modules/CIData'

export default {
  name: 'collectButton',
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
          buttonTitle: '收藏',
          buttonImage: 'url(' + require('assets/collect_normal.png') + ')'
        },
        {
          buttonTitle: '取消收藏',
          buttonImage: 'url(' + require('assets/collect_selected.png') + ')'
        }
      ]
    }
  },
  computed: {
    isSave: function () {
      console.log('设置 collectButton: ', this.pageInfo)
      return this.pageInfo.isSave || false
    }
  },
  methods: {
    clickLike: function () {

      if(!this.isSave){
        CIData.push(['trackEvent','wyeth', 'cms_collect', 'pid',this.pageInfo.id]);
      }

      var self = this
      network.getCMSCollect({ article_id: this.pageInfo.id, is_cancel: self.isSave ? 1 : 0 }, res => {
        if (res.ret === 1) {
          event.sendEvent('toast', { type: 'success', text: self.isSave ? '取消收藏成功' : '收藏成功' })

          self.$emit('clickCollect', {
            article_id: self.pageInfo.id,
            isSave: self.isSave ? 0 : 1
          })
        }
      })
    }
  }
}
</script>

<style lang = "sass" scope>
    @import './collectButton.scss'
</style>
