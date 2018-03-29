<template>
  <OHSFullPage>
    <list class = "mq-detail-list" style = "padding-bottom: 40px" loadmoreoffset = "10" @loadmore = "onloading">
      <div class = "mqdetail-header-container">
        <div class = "mq-header-top">
          <image class = "mq-header-top-img-rule" :src = "require('assets/icon-me-mq-rule.png')"/>
          <text class = "mqdetail-mqrule" @click = "checkRule">MQ规则</text>
          <div class = "mqdetail-share-card">
            <image class = "mq-share-img" :src = "require('assets/icon-me-share-small.png')"/>
            <text class = "mq-share-text">积分邀请卡</text>
          </div>
        </div>
        <div class = "mqdetail-mq-container">
          <text class = "mqdetail-balance">{{ balance }}</text>
          <text class = "mqdetail-mq">MQ</text>
        </div>

        <div class = "mq-header-btn-group">
          <text class = "mqdetail-btn" @click = "exchange">MQ兑换</text>
          <text class = "mqdetail-btn" @click = "recharge">充值MQ</text>
        </div>
      </div>
      <OBlock :width = "750" :height = "30" bgColor = "#f3f3f7"></OBlock>
      <cell v-for = "item in MQData" loadmoreoffset = "10" @loadmore = "onloading">
        <MQCell :MQInfo = "item"></MQCell>
      </cell>
      <div :style = "loadStyle">
        <text :style = "loadTextStyle">{{loading_txt}}</text>
      </div>
    </list>
  </OHSFullPage>
</template>

<script>
  import MQCell from '../../components-proj/me/MQCell'
  import { OHSFullPage } from '../../components-proj/comm/page'
  import OBlock from '../../components/OBlock'

  import { jumper } from '../../modules/jumper'
  import event from '../../modules/event'
  import network from '../../modules/network/network'
  import Base from '../../mixins/base'
  module.exports = {
    mixins: [Base],
    components: {
      MQCell: MQCell.weexComponent,
      OHSFullPage: OHSFullPage.weexComponent,
      OBlock: OBlock.weexComponent
    },
    created () {
      event.sendEvent('tabbar_g', true)
      this.fetch(this.params)
    },
    updated () {
      event.sendEvent('tabbar_g', true)
    },
    data () {
      return {
        page: 1,
        page_size: 10,
        showLoading: 'hide',
        isLoading: false,
        refreshing: false,
        loading_txt: '正在努力加载...',
        MQData: [],
        balance: 0
      }
    },
    computed: {
      params () {
        return {
          page: this.page,
          page_size: this.page_size
        }
      },
      loadStyle: function () {
        return {
          width: this.rpx(750, true),
          height: this.rpx(80, true),
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: this.rpx(30, true)
        }
      },
      loadTextStyle () {
        return {
          color: '#888888',
          fontSize: this.rpx(24, true)
        }
      }
    },
    methods: {
      checkRule () {
        jumper.push(this, 'MQRule')
      },
      exchange () {
        // event.sendEvent('toast', { type: 'fail', text: '敬请期待' })
        this.$router.push('./exchange')
      },
      recharge () {
        this.$router.push({name: 'recharge', params: { id: 0, backPath: '/MQDetail' }})
      },
      onloading (event) {
        var self = this
        if (self.isLoading === false) {
          console.log('onloading')
          self.isLoading = true
          this.fetch(this.params, function () {
            self.isLoading = false
          })
        }
      },
      fetch (params, callback) {
        var self = this
        network.getMQDetail(params, function (data) {
          console.log('MQDetail', data)
          if (data.ret === 1) {
            var list = data.data.list
            if (list) {
              self.MQData.push(...list)
              self.balance = data.data.mq
              self.params.page++
              if (callback) {
                callback()
              }
            } else {
              self.loading_txt = '暂无更多数据'
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .mqdetail-header-container {
    align-items: center;
    height: 432px;
    background: url('../../assets/mq_header_bg.png');
    background-size: 100%;
  }
  .mq-header-top {
    flex-direction: row;
    width: 750px;
    align-items: center;
    padding-left: 19px;
    margin-top: 17px;
  }
  .mq-header-top-img-rule {
    width: 33px;
    height: 33px;
  }
  .mqdetail-mqrule {
    color: #fff;
    font-size: 28px;
    flex: 1;
    margin-left: 11px;
  }
  .mqdetail-share-card {
    display: none;
    width: 207px;
    height: 50px;
    color: #fff;
    font-size: 28px;
    border-bottom-left-radius: 25px;
    border-top-left-radius: 25px;
    background-image: linear-gradient(to top, #e8c35f, #dab04e, #c79736);
    flex-direction: row;
    align-items: center;
  }
  .mq-share-img {
    width: 28px;
    height:25px;
    margin-left: 19px;
  }
  .mq-share-text {
    font-size: 26px;
    color: #fff;
    margin-left: 9px;
  }
  .mqdetail-mq-container {
    flex-direction: row;
    align-items: flex-end;
    margin-top: 102px;
  }
  .mqdetail-balance {
    font-size: 80px;
    color: #fff;
    line-height: 70px;
  }
  .mqdetail-mq {
    font-size: 31px;
    color: #fff;
    line-height: 31px;
    margin-left: 8px;
  }
  .mq-header-btn-group {
    flex-direction: row;
    margin-top: 80px;
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
  .mqdetail-check-rule-container {
    background-color: #F5F5F9;
    flex-direction: row;
    justify-content: flex-end;
    height: 87px;
    align-items: center;
    padding-right: 30px;
  }
  .mqdetail-check-rule-text {
    color: #999;
    font-size: 28px;
    margin-right: 10px;
  }
  .mq-detail-list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0px;
  }
</style>
