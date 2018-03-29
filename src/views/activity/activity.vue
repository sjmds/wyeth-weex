<template>
  <OHSFullPage class="activity-bg" :style="{backgroundImage: 'url('+bg_url+ ')'}">
    <div class="pop_num">
      <text style="color:#B37419;font-size: 13px;">{{per_num}}</text>
    </div>
    <div class="cell-div">
      <div v-for="(acvit, key) in acvits" :key="key">
        <div class="cell" :style="{backgroundImage: 'url('+ acvit.image+ ')'}" @click="clickItem(key)">
        </div>
      </div>
    </div>

    <div class="button" @click="clickMore()"></div>
  </OHSFullPage>
</template>

<script>
  import base from '../../mixins/base'
  import {OHSFullPage} from '../../components-proj/comm/page'
  import network from '../../modules/network/network'
  import event from "../../modules/event/index";

  export default {
    mixins: [base],
    components: {
      OHSFullPage: OHSFullPage.weexComponent
    },
    data() {
      return {
        per_num: '',
//        bg_url: require('assets/bg1.jpg'),
        bg_url: '',
        acvits: []
      }
    },
    created() {
      var self = this;
      network.getActivity(function(res) {
        if (res.ret === 1) {
          let data = res.data;
          self.bg_url = data.background;
          self.acvits = data.activities;
          self.per_num = '已有'+data.user_num+'人参加';
        }
      })
    },
    methods: {
      clickItem(key) {
        if(this.acvits[key].status === 0)
          window.location.href = window.location.protocol + '//mama-weiketang-wyeth.woaap.com/mobile/hd?aid='+ this.acvits[key].id;
        else {
          event.sendEvent("toast", { type: "fail", text: "敬请期待" });
        }
      },
      clickMore() {
        this.$router.push('./all')
      }
    }
  }
</script>

<style scoped>
  .activity-bg {
    background-size: 100% auto;
    background-repeat: no-repeat;
  }

  .pop_num {
    margin-top: 388px;
    margin-left: 59px;
  }

  .cell-div {
    padding: 0 52px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
  }

  .cell {
    width: 306px;
    height: 306px;
    margin: 8px;
    justify-content: space-around;
    background-size: 306px 306px;
    box-shadow: #ececec 6px 8px;
  }

  .button {
    width: 300px;
    height: 85px;
    border-radius: 20px;
    background-image: url('../../assets/active_button.png');
    background-size: 300px 85px;
    margin-left: 220px;
    margin-top: 20px;
  }
</style>
