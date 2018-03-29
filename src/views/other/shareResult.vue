/**
* Created by admin on 17/8/17.
*/
<template>
  <OHSFullPage>
    <div class="share-content">
      <div class="share-content-tip">
        <text class="share-content-tip-text">* 据说坚持分享转发课程，MQ积分涨的更快哦，加油</text>
      </div>
      <image class="share-success-img" :src="require('assets/share_success.png')"/>
      <text :style="{fontSize:rpx(26, true),marginTop:rpx(52, true),color: '#999999'}">以下福利奉上~</text>
      <image class="share-gift-img" :src="require('assets/gift.png')"/>
      <OButton class="exchange-button" text="立即抽奖" :fontSize="32" :borderWidth="4" :radius="40" :width="292" :buttonWidth="284" @click="onGetTicket" ref="btnGet" :height='80' :highLight="true" :style="{marginTop:rpx(48, true)}" />
    </div>

    <OBlock :width="750" :height="26" bgColor="#eeeeee"></OBlock>

    <panel title="猜你喜欢" :paddingLeft="12" :paddingRight="34" :titlePaddingLeft="10" :extraPaddingRight="27" :titleSize="29" :extraSize="25" :imgBg="require('assets/header_bg.png')" :imgLeftWitdh="8" titleColor="#af730c" extraColor="#666666" :imgLeftHeight="38" :imgRightWitdh="28" :imgRightHeight="28" @more="moreClick" :imgLeft="require('assets/line.png')"></panel>

    <OSlider v-if="broadcast.length > 0" :items="broadcast" :width="750" :interval="3000" :autoPlay="true" :height="200" :showIndicator="false"></OSlider>

    <CourseRecommend :showPannel="false" :recommendList="recomClass"></CourseRecommend>

    <!-- <OHSTicket v-show="isTicketShow" @onClick="onClick" title="5元丝塔芙无门槛代金券" subtitle="有效期2017.01.01-2017.10.10"></OHSTicket> -->
  </OHSFullPage>
</template>

<script>
// 其它用法与vue相同

import base from '../../mixins/base'
import OButton from '../../components/OButton'
import OBlock from '../../components/OBlock'
import panel from '../../components/panel'
import OSlider from '../../components/OSlider'
import OPopupWindow from '../../components/OPopupWindow'
import OHSTicket from '../../components-proj/comm/ticket'
import { OHSFullPage } from '../../components-proj/comm/page'
import { CourseRecommend } from '../../components-proj/course'


export default {
  mixins: [base],
  preload($route) {
    return ['getAd.8.' + $route.params.classInfo.brand]
  },
  components: {
    OButton: OButton.weexComponent,
    OBlock: OBlock.weexComponent,
    panel: panel.weexComponent,
    OSlider: OSlider.weexComponent,
    OPopupWindow: OPopupWindow.weexComponent,
    OHSTicket: OHSTicket.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent,
    CourseRecommend:CourseRecommend.weexComponent
  },
  created() {
    if (this.$route) {
      if (this.$route.params.flashPics) {
        this.flashPics = this.$route.params.flashPics
      }
      if (this.$route.params.recomClass) {
        this.recomClass = this.$route.params.recomClass
      }
    }
  },
  data() {
    return {
      broadcast: [],
      recomClass: [],
      // isTicketShow: false,
      // canGetTicket: true
    }
  },
  methods: {
    depend() {
      return ['getAd.8.' + this.$route.params.classInfo.brand]
    },
    resolve() {
      let date = new Date()
      console.log('resolve' + (date.getSeconds() * 1000 + date.getMilliseconds()))

      let data = this.store('getAd.8.' + this.$route.params.classInfo.brand).data

      this.broadcast = data
    },
    onGetTicket: function() {
      this.$router.replace('/exchange')
      // if (this.canGetTicket) {
      // this.$refs.btnGet.disable()
      // this.canGetTicket = false
      // this.isTicketShow = true
      // }
    },
    moreClick: function() {
      this.$router.replace('/all')
    },
    onClick: function() {
      // this.isTicketShow = false
    }
  }
}
</script>

<style scoped>
.share-content {
  width: 750px;
  align-items: center;
  padding-bottom: 40px;
}

.share-content-tip {
  width: 750px;
  height: 106px;
  background-image: linear-gradient(to top, #e8c35f, #dab04e, #c79736);
}

.share-content-tip-text {
  padding-left: 23px;
  line-height: 106px;
  font-size: 26px;
  color: white;
  justify-content: left;
  vertical-align: middle;
  background-image: linear-gradient(to top, #e8c35f, #dab04e, #c79736);
}

.share-success-img {
  margin-top: 47px;
  width: 200px;
  height: 46px;
}

.share-gift-img {
  margin-top: 28px;
  height: 168px;
  width: 168px;
  border-radius: 84px;
}

.exchange-button{
  box-shadow:1px 1px 3px 4px #efefef;
}
</style>
