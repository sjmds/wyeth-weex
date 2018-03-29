<template>
  <OHSFullPage class="exchange" :style="{backgroundImage:'url(' + exchangeInfo.draw_bg + ')'}">
    <div class="exchange-bg">
      <div class="exchange-sheet">
        <div class="header">
          <image class="header-img" :src='require("assets/exchange_header.png")'/>
          <OBlock :width="700" :height="1" bgColor="#eeeeee" :marginLeft="24" :marginRight="21"></OBlock>
        </div>
        <div class="cell">
          <div class="cell-content">
            <text class="cell-1-title">剩余抽奖次数：</text>
            <text class="cell-1-subtitle">{{exchangeInfo.left_times}}</text>
          </div>
          <OBlock :width="700" :height="1" bgColor="#eeeeee" :marginLeft="24" :marginRight="21"></OBlock>
        </div>
        <div class="cell">
          <div class="cell-content">
            <text class="cell-1-title">您目前所剩MQ积分余额：</text>
            <text class="cell-1-subtitle">{{exchangeInfo.mq}}MQ</text>
          </div>
          <OBlock :width="700" :height="1" bgColor="#eeeeee" :marginLeft="24" :marginRight="21"></OBlock>
        </div>
        <div class="cell">
          <div class="cell-content">
            <text class="cell-1-title">兑换抽奖次数：</text>
            <div class="counter">
              <div class="counter-dec" @click="clickCounter(-1)"></div>
              <text class="cell-1-subtitle">{{exchange_count}}</text>
              <div class="counter-plus" @click="clickCounter(1)"></div>
            </div>
          </div>
          <OBlock :width="700" :height="1" bgColor="#eeeeee" :marginLeft="24" :marginRight="21"></OBlock>
        </div>
        <div class="cell">
          <div class="cell-content">
            <text class="cell-1-title">共计消耗MQ积分：</text>
            <text class="cell-1-subtitle">-{{total_fee}}MQ</text>
          </div>
          <OBlock :width="700" :height="1" bgColor="#eeeeee" :marginLeft="24" :marginRight="21"></OBlock>
        </div>
        <OBlock :width="700" :height="50" bgColor="#ffffff"></OBlock>

        <div class="button-shadow"></div>
        <div class="button-bg">
          <text class="button" @click="submit">立即抽奖</text>
        </div>
      </div>
    </div>

    <CommonAlert v-if="show_commonAlert" @onDoneClick="onDoneClick" content="请充值！"></CommonAlert>

  </OHSFullPage>
</template>

<script>
import { OHSFullPage } from '../../components-proj/comm/page'
import event from '../../modules/event'
import Base from '../../mixins/base'
import network from '../../modules/network/network'
import CIData from '../../modules/CIData'

import OBlock from '../../components/OBlock'
import { CommonAlert } from '../../components-proj/other'


module.exports = {
  mixins: [Base],
  preload($route) {
    return ['getChance']
  },
  components: {
    OHSFullPage: OHSFullPage.weexComponent,
    OBlock: OBlock.weexComponent,
    CommonAlert: CommonAlert.weexComponent
  },
  data() {
    return {
      ios: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      exchangeInfo: {
        left_times: 0,
        mq: 0,
        hd_url: "",
        draw_bg: ""//require('assets/exchange_bg.png')
      },
      price: 50, //50MQ兑换一次
      exchange_count: 0,
      show_commonAlert: false
    }
  },
  created() {
    CIData.push(['trackEvent','wyeth', 'page_exchange', 'wyeth_channel', window.wyeth_channel]);
  },
  updated() {
  },
  computed: {
    total_fee: function() {
      return this.exchange_count * this.price
    }
  },
  methods: {
    depend() {
      return ['getChance']
    },
    resolve() {
      let data = this.store('getChance').data
      this.exchangeInfo = data

      this.exchange_count = 1
    },
    clickCounter(num) {
      let sum = this.exchange_count + num
      if (sum <= 0) {
        this.exchange_count = 0
      } else if (sum * this.price > this.exchangeInfo.mq) {
        event.sendEvent('toast', { type: 'fail', text: '积分不足，请充值' })
      } else {
        this.exchange_count = sum
      }
    },
    submit() {
      CIData.push(['trackEvent','wyeth', 'exchange_click',this.exchange_count,window.wyeth_channel]);
      if (this.exchange_count > 0 && this.exchangeInfo.mq >= this.total_fee) {
        var self = this
        network.addChance(this.exchange_count, function(res) {
          if (res.ret === 1) {
            window.location.href = self.exchangeInfo.hd_url + "&_hw_c=" + window.wyeth_channel
          }
        })
      } else{
        window.location.href = this.exchangeInfo.hd_url + "&_hw_c=" + window.wyeth_channel
      }
      
      // else if (this.exchangeInfo.left_times > 0) {
      //   window.location.href = this.exchangeInfo.hd_url
      // } else if(this.exchangeInfo.mq > 50){
      //   event.sendEvent('toast', { type: 'fail', text: '请兑换抽奖次数' })
      // }else{
      //   this.show_commonAlert = true
      // }
    },
    onDoneClick() {
      this.show_commonAlert = false
      this.$router.push({ name: 'recharge', params: { id: 0, backPath: '/exchange' } })
    }
  }
}
</script>

<style scoped>
.exchange {
  background-size: 100%;
  background-repeat: no-repeat;
}

.exchange-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.exchange .exchange-sheet {
  position: absolute;
  width: 750px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  flex-direction: column;
  justify-content: flex-start;
}

.header {
  width: 750px;
}

.header .header-img {
  width: 526px;
  height: 42px;
  margin: 53px 45px;
}

.cell {
  width: 750px;
}

.cell-content {
  width: 750px;
  height: 100px;
  background-color: #ffffff;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 46px 0 41px;
}

.cell-1-title {
  font-size: 30px;
  color: rgba(51, 51, 51, 1);
  line-height: 100px;
  vertical-align: middle;
}

.cell-1-subtitle {
  font-size: 30px;
  color: rgba(219, 105, 41, 1);
  line-height: 100px;
  vertical-align: middle;
}

.counter {
  height: 100px;
  flex-direction: row;
  justify-content: space-between;
  margin-right: -10px;
}

.counter .counter-plus {
  width: 80px;
  height: 80px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("../../assets/exchange_plus.png");
  margin: 10px 0 10px 10px;
}

.counter .counter-dec {
  width: 80px;
  height: 80px;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url("../../assets/exchange_dec.png");
  margin: 10px 10px 10px 0;
}

.button-shadow {
  width: 750px;
  height: 15px;
  background-image: linear-gradient(to top, RGBA(0, 0, 0, 0.08), RGBA(255, 255, 255, 0));
}

.button-bg {
  width: 750px;
  height: 126px;
  background-color: #ffffff;
  justify-content: space-around;
}

.button-bg .button {
  width: 710px;
  height: 84px;
  line-height: 84px;
  background-image: linear-gradient(to right, #e7c25f, #e4be5b, #cea03f, #c69735);
  color: white;
  font-size: 32px;
  border-radius: 10px;
  align-self: center;
  text-align: center;
  vertical-align: middle;
}
</style>
