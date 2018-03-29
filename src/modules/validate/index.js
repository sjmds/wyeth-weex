
import event from '../event'
import network from '../network/network'
import data from '../../data'
import { WxShare } from '../WxSDK/index'
import config from '../../config.json'

import store from '../store/index'

export function beforeLoad () {
  if (!data.store('userInfo')) {
    network.getLoginInfo(function (res) {
      if (res.ret !== 1) {
        return
      }

      let userInfo = res.data

      console.log('userInfo: ', userInfo)

      window.CIData.push(['setUserId', userInfo.id])
      window.CIData.push(['setChannel', userInfo.channel])
      window.CIData.push(['setUserProperties', userInfo.user_properties])

      data.store('userInfo', userInfo)

      let MqPot = { showRedPot: !userInfo.is_sign }

      store.getItem('MqPot', function (res) {
        if (res.result === 'success') {
          console.log('---- res ----', res)
          let data = JSON.parse(res.data)
          if (data.showRedPot) {
            MqPot.showRedPot = true
          }
        }
      })

      console.log('userInfo.is_sign', userInfo.is_sign)

      console.log('----- MqPot -----', MqPot)
      store.setItem('MqPot', JSON.stringify(MqPot), function () {

      })

      let title = '魔栗妈咪学院'
      let desc = '最权威专家为您答疑解惑，学育儿知识还能赚取积分MQ，兑换惠员好礼哦！当妈妈不仅要有EQ、IQ，还要有MQ哦！~~~'
      let img = window.location.protocol + '//wyeth-course.nibaguai.com/wyeth/image/logo.png'
      let link = window.wyeth_host + '/mobile/index?'
      WxShare.share(title, desc, img, link, function () {
        console.log('分享成功')
      }, function () {
        console.log('分享失败')
      })

      if (!userInfo.chooseTag) {
        window.stashPath = '/follow'
      }

      if (!userInfo.crm_status || parseInt(userInfo.crm_status) != 1) {
        window.needReg = true
      }

      if (!userInfo.is_sign) {
        event.sendEvent('signup')
      }
    })
  }
}
