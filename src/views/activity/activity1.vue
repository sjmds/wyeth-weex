<template>
  <OHSFullPage class="avtivity">
    <image class="poster" :src="poster" />

    <text class="title">{{title}}</text>

    <div class="content" id="content"></div>
    
    <div class="footer">
      <text class="button" @click='clickBuy()'>立即购买（19.9元/课）</text>
    </div>
  </OHSFullPage>
</template>

<script>
import base from "../../mixins/base";
import { OHSFullPage } from "../../components-proj/comm/page";
import network from "../../modules/network/network";
import event from "../../modules/event/index";
import CIData from "../../modules/CIData";

export default {
  mixins: [base],
  components: {
    OHSFullPage: OHSFullPage.weexComponent
  },
  data() {
    return {
      id: "1",
      poster: require("assets/activity/poster.png"),
      title: "卵巢可以保养吗？",
      images: [
        {
          src: require("assets/activity/content_1.png"),
          height: 2167
        },
        {
          src: require("assets/activity/content_2.png"),
          height: 772
        },
        {
          src: require("assets/activity/content_3.png"),
          height: 921
        }
      ]
    };
  },
  created() {
    CIData.push(["trackEvent", "wyeth", "activity", "id", this.id]);
  },
  mounted() {
    let html = "";
    for (let i in this.images) {
      html +=
        "<image src='" +
        this.images[i].src +
        "' style='width:100%;height:auto;'/> ";
    }

    document.querySelector("#content").innerHTML = html;
  },
  methods: {
    clickBuy() {
      CIData.push(["trackEvent", "wyeth", "activity_buy", "id", this.id]);
      window.location.href =
        "http://e.cn.miaozhen.com/r/k=2074470&p=7Dpvy&dx=__IPDX__&rt=2&ns=__IP__&ni=__IESID__&v=__LOC__&xa=__ADPLATFORM__&tr=__REQUESTID__&mo=__OS__&m0=__OPENUDID__&m0a=__DUID__&m1=__ANDROIDID1__&m1a=__ANDROIDID__&m2=__IMEI__&m4=__AAID__&m5=__IDFA__&m6=__MAC1__&m6a=__MAC__&vo=3bd8732de&vr=2&o=https%3A%2F%2Fm.qlchat.com%2Fwechat%2Fpage%2Ftopic-intro%3FtopicId%3D2000000726484276%26from%3Dsinglemessage%26isappinstalled%3D0";
    }
  }
};
</script>


<style lang="sass" scoped>
  @import '../scss/activity1.scss'
</style>
