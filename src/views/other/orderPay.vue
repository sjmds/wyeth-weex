<template>
  <OHSFullPage style="background-color: #F2F4F5;align-items: stretch">
    <OHSBillCard :courseName="classInfo.name || classInfo.title" :remark="classInfo.remark" :courseNum="payInfo.course_num" :total="payInfo.mq" :price="payInfo.mq" :balance="payInfo.mq_left"></OHSBillCard>

    <text class="pay-tip-title">说明提示:</text>
    <text class="pay-tip">1.课程购买不可退</text>
    <text class="pay-tip">2.如果中途停止更新内容将退还MQ</text>

    <div style="flex: 1"></div>

    <OShadow :startAlpha="0.04" :height="20" direction="to top"></OShadow>

    <div class="pay-container">
      <text class="pay-done" @click="onPay">{{payText}}</text>
    </div>
  </OHSFullPage>
</template>

<script>
import Base from '../../mixins/base'
import event from '../../modules/event'
import network from '../../modules/network/network'

import { OHSFullPage } from '../../components-proj/comm/page'
import OHSBillCard from '../../components-proj/pay/BillCard/ohs-bill-card.vue'
import OShadow from '../../components/OShadow/index'
module.exports = {
  mixins: [Base],
  preload ($route) {
    return ['getOrderDetail.' + $route.params.trade_id]
  },
  components: {
    OHSBillCard,
    OHSFullPage: OHSFullPage.weexComponent,
    OShadow: OShadow.weexComponent
  },
  data () {
    return {
      payInfo: {
        mq: 0,
        mq_left: 0,
        course_num: 0
      },
      classInfo: Object,
      hasPay: false
    }
  },
  created () {
    // this.payInfo = this.$route.params.payInfo
    // this.total = this.payInfo.coursePrice
  },
  computed: {
    enough () {
      return this.payInfo.mq <= this.payInfo.mq_left
    },
    payText () {
      if (this.hasPay) {
        return '已付款'
      }
      return this.enough ? '立即支付' : '余额不足,立即支付'
    }
  },
  methods: {
    depend () {
      return ['getOrderDetail.' + this.$route.params.trade_id]
    },
    resolve () {
      let data = this.store('getOrderDetail.' + this.$route.params.trade_id).data

      data.mq = Number(data.mq)

      data.mq_left = Number(data.mq_left)

      this.payInfo = data

      this.classInfo = this.payInfo.detail

      this.hasPay = (this.payInfo.trade_status === 1)
    },
    onPay () {
      if (this.hasPay) {
        this.$router.go(-1)
      } else if (this.enough) {
        var self = this
        network.payMQ(this.payInfo.trade_id, function (res) {
          if (res.ret === 1) {
            event.sendEvent('toast', { type: 'success', text: '购买成功' })
            if (parseInt(self.$route.params.from_recharge) === 1) {
              self.$router.replace('/courseSeries/' + self.payInfo.cid)
            } else {
              self.$router.go(-1)
            }

            setTimeout(function () {
              event.sendEvent('toast', { type: 'success', text: '购买成功' })
            }, 1000)
          }
        })
      } else {
        this.$router.push({ name: 'recharge', params: { id: 0, backPath: '/orderPay/' + this.payInfo.trade_id + '/1' } })
      }
    }
  }
}
</script>


<style scoped>
.pay-tip-title {
  color: #666666;
  font-size: 28px;
  margin-top: 43px;
  margin-bottom: 13px;
  margin-left: 38px;
}

.pay-tip {
  color: #999999;
  font-size: 26px;
  margin-left: 38px;
  margin-top: 14px;
}

.pay-done {
  width: 710px;
  height: 84px;
  line-height: 88px;
  color: #ffffff;
  font-size: 36px;
  border-radius: 10px;
  text-align: center;
  vertical-align: middle;
  background-image: linear-gradient(to right, #E7C25F, #D3A645, #C69735);
}

.pay-container {

  background-color: #ffffff;
  height: 126px;
  align-items: center;
  justify-content: center;
}
</style>
