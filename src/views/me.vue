<template>
  <OHSPage>
    <scroller class="me-scroller">
      <div class="bg">
        <OHSUserPanel :info="userInfo" :textPanel="textPanel" @userInfoClick="userInfoClick" @textPanelClick="textPanelClick">
        </OHSUserPanel>

        <div class="mq-header-btn-group">
          <text class="mqdetail-btn" @click="exchange">MQ兑换</text>
          <text class="mqdetail-btn" @click="recharge">充值MQ</text>
        </div>

        <OLinearCell class="cell" :linearCell="missionCell" @iconClick="missionQuestionClick">
        </OLinearCell>
        <OHSSlidePanel :items="missionList" :width="750" :interval="5000" :hrefs="href2" :autoPlay="true" @missionClick="missionClick" :height="156"></OHSSlidePanel>
        <!-- <OLinearCell class="cell" :linearCell="dynamicCell" @linearCellClick="dynamicClick">
        </OLinearCell> -->
        <OLinearCell class="cell" :linearCell="historyCell" @linearCellClick="historyClick">
        </OLinearCell>
        <OLinearCell :linearCell="settingCell" @linearCellClick="settingClick">
        </OLinearCell>
        <OLinearCell :linearCell="paidCell" @linearCellClick="paidClick">
        </OLinearCell>

        <OBlock :width="750" :height="20" bgColor="#eeeeee"></OBlock>
        <OSlider v-show="broadcast.length > 0" :items="broadcast" :width="750" :interval="3000" :autoPlay="true" :height="340" :showIndicator="false"></OSlider>
        <OBlock :width="750" :height="30" bgColor="#eeeeee"></OBlock>
      </div>

    </scroller>
  </OHSPage>
</template>

<script>
import OHSUserPanel from '../components-proj/me/userInfo'
import OLinearCell from '../components/iconLinearCell'
import OHSIconTextPanels from '../components-proj/me/iconTextPanels'
import OHSSlidePanel from '../components-proj/me/slidePanel'
import { OHSPage } from '../components-proj/comm/page'

import { jumper } from '../modules/jumper'
import event from '../modules/event'
import network from '../modules/network/network'
import Base from '../mixins/base'
import store from '../modules/store/index'

import OBlock from '../components/OBlock'
import OSlider from '../components/OSlider'

module.exports = {
  mixins: [Base],
  components: {
    OHSUserPanel: OHSUserPanel.weexComponent,
    OLinearCell: OLinearCell.weexComponent,
    OHSPage: OHSPage.weexComponent,
    OHSIconTextPanels: OHSIconTextPanels.weexComponent,
    OHSSlidePanel: OHSSlidePanel.weexComponent,
    OBlock: OBlock.weexComponent,
    OSlider: OSlider.weexComponent
  },
  created() {
    this.fetch({})
    event.sendEvent('tabbar_g', false)

    let self = this
    store.getItem('userInfo', function(res) {
      if (res.result === 'success') {
        console.log('userinfo', res.data)
        let user = JSON.parse(res.data)
        if (user) {
          self.userInfo = user
        }
      }
    })

    store.getItem('MqPot', function(res) {
      if (res.result === 'success') {
        let data = JSON.parse(res.data)
        if (data.showRedPot) {
          self.textPanel[1].redDot = true
        } else {
          self.textPanel[1].redDot = false
        }
      } else {
        self.textPanel[1].redDot = true
      }
    })

    store.getItem('hasEnterMQRule', function(res) {
      if (res.result === 'success') {
        let data = JSON.parse(res.data)
        if (data.hasEnterMQRule) {
          self.missionCell.redDot = false
        } else {
          self.missionCell.redDot = true
        }
      } else {
        self.missionCell.redDot = true
      }
    })

    let res = this.store('mineData')
    if (res && res.ret === 1) {
      let result = res.data
      this.userInfo.nickname = result.nickname
      this.userInfo.img = result.avatar
      this.userInfo.preDate = result.baby_birth
      this.saveUserInfo(result.nickname, result.avatar, result.baby_birth)
      this.textPanel[0].content = self.getListenLength(result.listen)
      this.textPanel[1].content = result.mq + ''
      this.textPanel[2].content = result.sign_days + '天'

      var task = result.task
      //      for (var i = 0; i < task.length; i++) {
      //        this.missionList[i].progress = task[i].get_num
      //        this.missionList[i].left = task[i].not_get_num
      //        this.missionList[i].type = task[i].type
      //      }
      self.missionList[0].progress = task[1].get_num
      self.missionList[0].left = task[1].not_get_num
      self.missionList[0].type = task[1].type
      self.missionList[1].progress = task[2].get_num
      self.missionList[1].left = task[2].not_get_num
      self.missionList[1].type = task[2].type
      self.missionList[2].progress = task[3].get_num
      self.missionList[2].left = task[3].not_get_num
      self.missionList[2].type = task[3].type
      self.missionList[3].progress = task[0].get_num
      self.missionList[3].left = task[0].not_get_num
      self.missionList[3].type = task[0].type
    }
  },
  updated() {
    event.sendEvent('tabbar_g', false)
  },
  data() {
    return {
      broadcast: [],
      userInfo: {
        img: '',
        nickname: '',
        preDate: ''
      },
      textPanel: [
        {
          title: '学习时长',
          content: '0分',
          redDot: false,
          src: 'lesson'
        },
        {
          title: 'MQ',
          content: '',
          redDot: false,
          src: 'MQDetail'
        },
        {
          title: '连续签到',
          content: '',
          redDot: false,
          src: 'constant'
        }
      ],
      missionCell: {
        iconLeft: require('assets/icon-me-mission.png'),
        title: '每日任务',
        iconRight: require('assets/icon-me-rules.png'),
        style: {
          width: this.rpx(62, true),
          height: this.rpx(62, true)
        },
        redDot: true
      },
      imgTextPanels: [
        {
          iconSrc: require('assets/icon-me-listen.png'),
          title: '听课',
          imgStyle: {
            width: this.rpx(58, true),
            height: this.rpx(58, true)
          },
          content: '1分钟自动兑换1MQ'
        },
        {
          iconSrc: require('assets/icon-me-share.png'),
          title: '分享转发',
          imgStyle: {
            width: this.rpx(58, true),
            height: this.rpx(52, true)
          },
          content: 'MQ+1（每日上限5次）'
        }
      ],
      dynamicCell: {
        iconLeft: require('assets/icon-me-dynamic.png'),
        title: '动态',
        iconRight: require('assets/icon-me-more.png'),
        style: {
          width: this.rpx(11, true),
          height: this.rpx(21, true)
        },
        redDot: false,
        src: 'dynamic'
      },
      historyCell: {
        iconLeft: require('assets/icon-me-history.png'),
        title: '我的足迹',
        iconRight: require('assets/icon-me-more.png'),
        style: {
          width: this.rpx(11, true),
          height: this.rpx(21, true)
        },
        redDot: false,
        src: 'history'
      },
      settingCell: {
        iconLeft: require('assets/icon-me-setting.png'),
        title: '关注设置',
        iconRight: require('assets/icon-me-more.png'),
        style: {
          width: this.rpx(11, true),
          height: this.rpx(21, true)
        },
        redDot: false,
        src: 'myFollow'
      },
      paidCell: {
        iconLeft: require('assets/pay-tag.png'),
        title: '购买记录',
        iconRight: require('assets/icon-me-more.png'),
        style: {
          width: this.rpx(11, true),
          height: this.rpx(21, true)
        },
        redDot: false,
        src: 'myFollow'
      },
      missionList: [
        {
          icon: require('assets/icon-rule-26.png'),
          title: '进入课程页，奖励：',
          mission: 'MQ+3(上限5次)',
          progress: 0,
          total: 5,
          left: 0,
          type: 'scan'
        },
        {
          icon: require('assets/icon-rule-29.png'),
          title: '转发课程页，奖励：',
          mission: '5MQ(上限5次)',
          progress: 1,
          total: 5,
          left: 0,
          type: 'share'
        },
        {
          icon: require('assets/icon-rule-212.png'),
          title: '转发发现图文，奖励：',
          mission: '5MQ(上限5次)',
          progress: 1,
          total: 5,
          left: 0,
          type: 'share_cms'
        },
        {
          icon: require('assets/icon-rule-23.png'),
          title: '每日签到，奖励：',
          mission: 'MQ+20(上限1次)',
          progress: 1,
          total: 1,
          left: 0,
          type: 'sign'
        }
      ],
      href2: []
    }
  },
  methods: {
    saveUserInfo(nickname, avatar, babyBirth) {
      let user = {
        nickname: nickname,
        img: avatar,
        preDate: babyBirth
      }
      store.setItem('userInfo', JSON.stringify(user), function(state) {
        if (state) {
          console.log('保存个人信息成功')
        }
      })
    },
    fetch(params, callback) {
      var self = this
      network.getMine(params, function(data) {
        console.log('mineData', data)
        self.store('mineData', data)

        if (data.ret === 1) {
          var result = data.data
          self.userInfo.nickname = result.nickname
          self.userInfo.img = result.avatar
          self.userInfo.preDate = result.baby_birth
          self.saveUserInfo(result.nickname, result.avatar, result.baby_birth)
          self.textPanel[0].content = self.getListenLength(result.listen)
          self.textPanel[1].content = result.mq + ''
          self.textPanel[2].content = result.sign_days + '天'

          var task = result.task
          //          for (var i = 0; i < task.length; i++) {
          //            self.missionList[i].progress = task[i].get_num
          //            self.missionList[i].left = task[i].not_get_num
          //            self.missionList[i].type = task[i].type
          //          }
          self.missionList[0].progress = task[1].get_num
          self.missionList[0].left = task[1].not_get_num
          self.missionList[0].type = task[1].type
          self.missionList[1].progress = task[2].get_num
          self.missionList[1].left = task[2].not_get_num
          self.missionList[1].type = task[2].type
          self.missionList[2].progress = task[3].get_num
          self.missionList[2].left = task[3].not_get_num
          self.missionList[2].type = task[3].type
          self.missionList[3].progress = task[0].get_num
          self.missionList[3].left = task[0].not_get_num
          self.missionList[3].type = task[0].type

          self.broadcast = result.advertise

          console.log('advertise:', result.advertise)
        }
      })
    },
    userInfoClick() {
      window.location.href = 'http://wyethmember.nplusgroup.com/phone/member/index.htm'
    },
    getListenLength(length) {
      let h = Math.floor(length / 60)
      let m = length % 60
      if (h > 0) {
        return h + '小时' + m + '分'
      } else {
        return m + '分'
      }
    },
    textPanelClick(src, index) {
      if (index === 1) {
        jumper.push(this, src)
        let MqPot = { showRedPot: false }
        store.setItem('MqPot', JSON.stringify(MqPot), function() {

        })
      } else {
        //          modal.toast({
        //            message: src,
        //            duration: 0.3
        //          })
      }
      this.textPanel[index].redDot = false
    },
    iconTextCellClick(index) {
      //        modal.toast({
      //          message: index,
      //          duration: 0.3
      //        })
    },
    exchange() {
      // event.sendEvent('toast', { type: 'fail', text: '敬请期待' })
      this.$router.push('./exchange')
    },
    recharge() {
      this.$router.push({ name: 'recharge', params: { id: 0, backPath: '/me' } })
    },
    dynamicClick(src) {
      //      this.$router.push({name:'dynamic',params: {nokeep:true}})
      this.$router.push({ name: 'myDynamic', params: { nokeep: true } })
    },
    historyClick(src) {
      //      this.$router.push({name:'history',params: {nokeep:true}})
      this.$router.push({ name: 'myHistory', params: { nokeep: true } })
    },
    settingClick(src) {
      jumper.push(this, src)
    },
    paidClick(src) {
      this.$router.push({ name: 'paidCourse', params: { nokeep: true } })
    },
    missionQuestionClick() {
      jumper.push(this, 'MQRule')
    },
    missionClick(item) {
      let self = this
      console.log(item)
      if (item.progress !== item.total) {
        if (item.left === 0) {
          if (item.type === 'share_cms') {
            jumper.push(this, 'discover')
          } else {
            jumper.push(this, 'all')
          }
        } else {
          network.getMq({ type: item.type }, function(res) {
            console.log('getMqData', res)

            // 修改我的页面mq值
            if (res.ret === 1) {
              for (let i = 0; i < self.missionList.length; i++) {
                if (self.missionList[i].type === item.type) {
                  self.missionList[i].progress = self.missionList[i].progress + self.missionList[i].left
                  self.missionList[i].left = 0
                }
              }
              let mq = res.data.mq

              let num = Number.parseInt(self.textPanel[1].content)
              self.textPanel[1].content = mq + num + ''
              self.textPanel[1].redDot = true

              event.sendEvent('toast', {
                type: 'MQ',
                text: 'MQ+' + mq
              })

              let MqPot = { showRedPot: true }
              store.setItem('MqPot', JSON.stringify(MqPot), function() {

              })
            }
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.me-scroller {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0px;
  top: 0px;
  background-color: #eeeeee;
}

.mq-header-btn-group {
  flex-direction: row;
  background-color: white;
  align-self: stretch;
  justify-content: center;
  padding-bottom: 30px;
}

.mqdetail-btn {
  width: 254px;
  height: 73px;
  background-color: #fff;
  color: #b37624;
  border-radius: 36px;
  border-color: #d0a341;
  border-style: solid;
  border-width: 2px;
  text-align: center;
  padding-top: 10px;
  margin-left: 33px;
  margin-right: 33px;
}

.bg {
  background-color: #f6f5fa;
  /*margin-bottom: 100px;*/
}

.cell {
  margin-top: 25px;
}

.ad {
  width: 750px;
  height: 360px;
  margin-bottom: 50px;
}
</style>
