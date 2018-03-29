<template>
  <OHSFullPage style="background-color: #f4f4f4">
    <OHSMQRuleCell :listData="listData"></OHSMQRuleCell>

    <OBlock :width="750" :height="20" bgColor="#f4f4f4"></OBlock>
    <OSlider v-show="broadcast.length > 0" :items="broadcast" :width="750" :interval="3000" :autoPlay="true" :height="340" :showIndicator="false"></OSlider>
    <OBlock :width="750" :height="30" bgColor="#f4f4f4"></OBlock>
  </OHSFullPage>
</template>

<script>
import OHSMQRuleCell from '../../components-proj/me/MQRuleCell'
import event from '../../modules/event'
import { OHSFullPage } from '../../components-proj/comm/page'
import base from '../../mixins/base'
import store from '../../modules/store'

import OBlock from '../../components/OBlock'
import OSlider from '../../components/OSlider'
module.exports = {
  mixins: [base],
  preload($route) {
    return ['getAd.7']
  },
  components: {
    'OHSMQRuleCell': OHSMQRuleCell.weexComponent,
    'OHSFullPage': OHSFullPage.weexComponent,
    OBlock: OBlock.weexComponent,
    OSlider: OSlider.weexComponent
  },
  created() {
    event.sendEvent('tabbar_g', true)

    let hasEnterMQRule = { hasEnterMQRule: true }
    store.setItem('hasEnterMQRule', JSON.stringify(hasEnterMQRule), function(state) {

    })
  },
  updated() {
    event.sendEvent('tabbar_g', true)
  },
  data() {
    return {
      broadcast:[],
      listData: [
        {
          icon: require('assets/icon-me-rule-1.png'),
          title: 'MQ是什么？',
          items: [
            {
              icon: require('assets/icon-rule-11.png'),
              title: 'MQ魔栗币',
              detail: '魔栗妈咪俱乐部积分货币'
            }
          ]
        },
        {
          icon: require('assets/icon-me-rule-2.png'),
          title: '如何赚取魔栗币MQ？',
          items: [
            {
              icon: require('assets/icon-rule-22.png'),
              title: '注册',
              detail: '首次完成验证',
              cost: '50MQ'
            },
            {
              icon: require('assets/icon-rule-23.png'),
              title: '每日签到',
              detail: '当天首次登录',
              cost: '20MQ'
            },
            {
              icon: require('assets/icon-rule-24.png'),
              title: '邀请新用户注册',
              detail: '暂无上限',
              cost: '50MQ'
            },
            {
              icon: require('assets/icon-rule-25.png'),
              title: '唤醒好友听课(老用户)',
              detail: '暂无上限',
              cost: '10MQ'
            },
            {
              icon: require('assets/icon-rule-26.png'),
              title: '进入课程页',
              detail: '每天最高获得15MQ',
              cost: '3MQ'
            },
            {
              icon: require('assets/icon-rule-27.png'),
              title: '听课时长-常规',
              detail: '无上限，每节课计算最长时长',
              cost: '1MQ/1min'
            },
            {
              icon: require('assets/icon-rule-213.png'),
              title: '单节课程持续听课超过7分钟额外获得',
              detail: '每周积分上限800MQ',
              cost: '50MQ'
            },
            // {
            //   icon: require('assets/icon-rule-28.png'),
            //   title: '提问',
            //   detail: '每天最高获得15MQ',
            //   cost: '3MQ'
            // },
            {
              icon: require('assets/icon-rule-29.png'),
              title: '转发课程页',
              detail: '每天最高获得25MQ',
              cost: '5MQ'
            },
            {
              icon: require('assets/icon-rule-211.png'),
              title: '收藏发现图文',
              detail: '每天最高获得15MQ',
              cost: '3MQ'
            },
            {
              icon: require('assets/icon-rule-212.png'),
              title: '转发发现图文',
              detail: '每天最高获得25MQ',
              cost: '5MQ'
            }
          ]
        },
        {
          icon: require('assets/icon-me-rule-3.png'),
          title: '如何消费魔栗币MQ？',
          items: [
            {
              icon: require('assets/icon-rule-31.png'),
              title: '高端抢奖品直接换',
              detail: '每周一次',
              cost: '-50000MQ'
            },
            {
              icon: require('assets/icon-rule-32.png'),
              title: '高端抢奖品积分折价换',
              detail: '每周一次',
              cost: '-25000MQ+500元现金'
            },
            {
              icon: require('assets/icon-rule-33.png'),
              title: '高端抢中奖码兑换',
              detail: '无上限',
              cost: '-50MQ'
            },
            {
              icon: require('assets/icon-rule-34.png'),
              title: '翻牌有惊喜-隐藏福利',
              detail: '无上限',
              cost: '-50MQ'
            },
            //              {
            //                icon: require('assets/icon-rule-35.png'),
            //                title: '翻牌机会多一次',
            //                detail: '无上限',
            //                cost: '-50MQ'
            //              },
            {
              icon: require('assets/icon-rule-38.png'),
              title: 'MQ专项魔栗转转乐',
              detail: '无上限',
              cost: '-50MQ'
            },
            {
              icon: require('assets/icon-rule-36.png'),
              title: '付费课程',
              detail: '无上限',
              cost: '-500MQ'
            },
            {
              icon: require('assets/icon-rule-37.png'),
              title: '付费专家问答',
              detail: '无上限',
              cost: '-400MQ'
            }
          ]
        }
      ]
    }
  },
  methods: {
    depend() {
      return ['getAd.7']
    },
    resolve() {
      let date = new Date()
      console.log('resolve' + (date.getSeconds() * 1000 + date.getMilliseconds()))

      let data = this.store('getAd.7').data

      this.broadcast = data
    }
  }
}
</script>

<style scoped>
body {
  background-color: #f4f4f4;
}
</style>
