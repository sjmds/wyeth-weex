<template>
  <OHSFullPage>
    <div class = "cms-pageInfo">
      <iframe v-if = "ios" :src = "iframe_url" class = "webview" :width = "rpx(750)" scrolling = "no" v-on:load = "onload()" v-on:error = "onerror()"></iframe>
      <web v-else :src = "iframe_url" class = "webview" @pagefinish = "onload" @error = "onerror"></web>
    </div>

    <div class = "cms-footer">
      <div class = "cms-footer-shadow"></div>
      <div class = "cms-footer-buttons">
        <CollectButton :pageInfo='pageInfo' @clickCollect = "clickCollect"></CollectButton>
        <OBlock :margin-top = "22.5" :width = "2" :height = "45" bgColor = "#eeeeee"></OBlock>
        <LikeButton :pageInfo='pageInfo' @clickLike = "clickLike"></LikeButton>
      </div>
    </div>
  </OHSFullPage>
</template>

<script>
import Base from '../mixins/base'

import config from '../config.json'

import event from '../modules/event'
import network from '../modules/network/network'
import { WxShare } from '../modules/WxSDK'
import { OHSFullPage } from '../components-proj/comm/page'
import { LikeButton, CollectButton } from '../components-proj/cms/cmsControls'
import OBlock from '../components/OBlock'
// const TYPE = process.env.COMPILE_ENV
export default {
  mixins: [Base],
  preload ($route) {
    return ['getArticleDetail.' + $route.params.id]
  },
  components: {
    OBlock: OBlock.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent,
    LikeButton: LikeButton.weexComponent,
    CollectButton: CollectButton.weexComponent
  },
  data () {
    return {
      graySkin: true,
      id: 0,
      pageInfo: {},
      url: '',
      ios: false,
      cmsHost: '//oneitfarm.com/cms/'
    }
  },
  created () {
    this.ios = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    // ios终端

    let params = this.$route.params
    if (params && params.link) {
      let link = ''
      if (params.type) {
        link = 'main.php?' + params.link.split('?')[1]
      } else {
        link = params.link
      }
      this.url = link
      console.log('传递 link:', this.url)
    }
  },
  computed: {
    iframe_url: function () {
      if (this.url && this.url.length > 0) {
        console.log('计算 link:', this.cmsHost + this.url)

        return this.cmsHost + this.url
      } else {
        console.log('计算 link: 空')

        return ''
      }
    }
  },
  methods: {
    depend () {
      return ['getArticleDetail.' + this.$route.params.id]
    },
    resolve () {
      let date = new Date()
      console.log('resolve' + (date.getSeconds() * 1000 + date.getMilliseconds()))

      this.pageInfo = this.store('getArticleDetail.' + this.$route.params.id).data

      console.log('pageInfo:', this.pageInfo)

      let linkTmp = ''
      if (this.pageInfo.type) {
        linkTmp = 'main.php?' + this.pageInfo.link.split('?')[1]
      } else {
        linkTmp = this.pageInfo.link
      }

      this.url = linkTmp
      console.log('获取 link:', this.url)

      // 分享设置
      var self = this
      let title = self.pageInfo.title ? self.pageInfo.title : '魔栗妈咪学院'
      let desc = '魔栗妈咪学院 从此“发现”了自己的feeds freestyle  '
      let img = self.pageInfo.img ? self.pageInfo.img + '?imageView2/1/w/50/h/50' : ''
      let link = window.wyeth_host + '/mobile/index?defaultPath=/cmsPageInfo/' + self.pageInfo.id
      WxShare.share(title, desc, img, link, function () {
        console.log('分享成功')
        event.sendEvent('toast', { type: 'success', text: '分享成功' })
        network.getArticleShare(self.pageInfo.id, function () {

        })
        CIData.push(['trackEvent', 'wyeth', 'share', 'aid', self.pageInfo.id])
      }, function () {
        console.log('分享失败')
      })
    },
    onload () {
      console.log('webview:onload')
      event.sendEvent('graySkin', { show: false })
    },
    onerror () {
      console.log('webview:onerror')
      event.sendEvent('graySkin', { show: false })
      event.sendEvent('toast', { type: 'fail', text: '加载失败' })
    },
    clickLike: function (e) {
      console.log('点击喜欢')
      if (e.article_id === this.pageInfo.id) {
        this.pageInfo.isLike = e.isLike
      }
    },
    clickCollect: function (e) {
      console.log('点击收藏')
      if (e.article_id === this.pageInfo.id) {
        this.pageInfo.isSave = e.isSave
      }
    }
  }
}
</script>

<style scoped>
.cms-pageInfo {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 90px;
}

.cms-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 105px;
  flex-direction: column;
}

.cms-footer-shadow {
  background-image: linear-gradient(to top, RGBA(0, 0, 0, 0.08), RGBA(255, 255, 255, 0));
  width: 750px;
  height: 15px;
}

.cms-footer-buttons {
  justify-content: space-around;
  flex-direction: row;
  background-color: #ffffff;
  height: 90px;
}

.webview {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
