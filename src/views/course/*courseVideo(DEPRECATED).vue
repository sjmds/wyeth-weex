<template>
  <OHSFullPage>
    <scroller id="courseVideo" v-show="!graySkin">

      <VideoPlayer :access="!accessType" :videoInfo="classlist" :classInfo="classInfo" @stateChange="stateChange"></VideoPlayer>
      <ClassHeader :classInfo="classInfo" @clickLike="clickLike" @clickCollect="clickCollect" @clickTag="clickTag"></ClassHeader>

      <OBlock :width="750" :height="25" bgColor="#ffffff"></OBlock>
      <Usercell :userInfo="userInfo" @clickConcern="clickConcern"></Usercell>
      <OBlock :width="750" :height="25" bgColor="#ffffff"></OBlock>

      <OBlock :marginLeft="15" :marginRight="15" :width="720" :height="2" bgColor="#eeeeee"></OBlock>
      <text class="courseVideo-content-text">{{classInfo.course_desc}}</text>

      <OBlock v-if="otherClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <OtherClass v-if="otherClass.length > 0" :items="otherClass" title="相关课程"></OtherClass>

      <OBlock v-show="classInfo.guide && classInfo.guide.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <CourseDetail v-show="classInfo.guide && classInfo.guide.length > 0" :details="classInfo.guide"></CourseDetail>

      <OBlock v-if="broadcast1.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <OSlider v-if="broadcast1.length > 0" :items="broadcast1" :width="750" :interval="3000" :autoPlay="true" :height="200" :showIndicator="false"></OSlider>

      <OBlock v-if="recomClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <CourseRecommend :recommendList="recomClass"></CourseRecommend>

      <OBlock v-if="broadcast2.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <OSlider v-if="broadcast2.length > 0" :items="broadcast2" :width="750" :interval="3000" :autoPlay="true" :height="360" :showIndicator="false"></OSlider>

      <OBlock v-if="broadcast2.length > 0" :width="750" :height="70" bgColor="#eeeeee"></OBlock>

      <OBlock v-if="accessType" :width="750" :height="115" bgColor="#eeeeee"></OBlock>

      <InviteButton v-show="!isPlay" @clickInvitation="clickInvitation"></InviteButton>
    </scroller>

    <button v-if="accessType" class='course-button' @click='clickBuy'>{{classInfo.price}}MQ 购买</button>

    <FlashPic :flashData="flashData"></FlashPic>

  </OHSFullPage>
</template>

<script>
import Base from "../../mixins/base";

import network from "../../modules/network/network";
import { WxShare } from "../../modules/WxSDK";

import {
  VideoPlayer,
  ClassHeader,
  OtherClass,
  CourseRecommend,
  CourseDetail
} from "../../components-proj/course";

import config from "../../config.json";
import event from "../../modules/event/index";
import { InviteButton } from "../../components-proj/other";
import { OHSFullPage } from "../../components-proj/comm/page";
import OBlock from "../../components/OBlock";
import Usercell from "../../components/usercell";
import OSlider from "../../components/OSlider";

import CIData from "../../modules/CIData";

import FlashPic from "../../components-proj/app/flashPic.vue";

export default {
  mixins: [Base],
  preload($route) {
    return ["course." + $route.params.id];
  },
  components: {
    Usercell: Usercell.weexComponent,
    VideoPlayer: VideoPlayer.weexComponent,
    ClassHeader: ClassHeader.weexComponent,
    OtherClass: OtherClass.weexComponent,
    CourseRecommend: CourseRecommend.weexComponent,
    CourseDetail: CourseDetail.weexComponent,
    OSlider: OSlider.weexComponent,
    InviteButton: InviteButton.weexComponent,
    OBlock: OBlock.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent,
    FlashPic
  },
  data() {
    return {
      graySkin: true,
      isPlay: false,
      classInfo: {},
      userInfo: {},
      classlist: {},
      otherClass: [],
      recomClass: [],
      broadcast1: [],
      broadcast2: [],
      flashData: {}
    };
  },
  created() {},
  mounted() {},
  computed: {
    accessType: function() {
      if (parseInt(this.classInfo.purchased) === 1) {
        // 可阅读
        return 0;
      } else {
        // 待购买
        if (parseInt(this.classInfo.purchased) === 2) {
          // 购买套课
          return 2;
        } else if (parseInt(this.classInfo.purchased) === 3) {
          // 购买单课
          return 1;
        }
      }
    }
  },
  watch: {
    $route: ["reload"]
  },
  methods: {
    depend() {
      return ["course." + this.$route.params.id];
    },
    resolve() {
      if (this.graySkin) {
        this.graySkin = false;
        event.sendEvent("graySkin", { show: false });
      }

      let date = new Date();
      console.log(
        "resolve" + (date.getSeconds() * 1000 + date.getMilliseconds())
      );

      let data = this.store("course." + this.$route.params.id).data;

      this.classInfo = data.classInfo || {};

      CIData.recActionView(this.classInfo);

      this.userInfo = data.userInfo || {};
      this.classlist = data.classlist || {};
      this.otherClass = this.$route.params.otherClass || [];
      this.recomClass = data.recomClass || [];
      this.broadcast1 = data.broadcast1 || [];
      this.broadcast2 = data.broadcast2 || [];
      this.flashData = data.flashPic[0] || {};

      if (document.querySelector("#courseVideo")) {
        document.querySelector("#courseVideo").scrollTop = 0;
      }

      if (data.mq) {
        event.sendEvent("toast", { type: "success", text: "完成任务" });
      }

      // 分享设置
      var self = this;
      let title = self.classInfo.title ? self.classInfo.title : "魔栗妈咪学院";
      let desc = self.classInfo.course_desc ? self.classInfo.course_desc : "";
      let img = self.classInfo.img ? self.classInfo.img : "";
      let link =
        window.wyeth_host +
        "/mobile/index?defaultPath=/courseVideo/" +
        self.classInfo.id;

      WxShare.share(
        title,
        desc,
        img,
        link,
        function() {
          console.log("分享成功");
          network.shareCourse(self.classInfo.id, function() {
            self.$router.push({
              name: "shareResult",
              params: { recomClass: self.recomClass, classInfo: self.classInfo }
            });
          });
          CIData.push([
            "trackEvent",
            "wyeth",
            "share",
            "cid",
            self.classInfo.id
          ]);
        },
        function() {
          console.log("分享失败");
        },
        true
      );
    },
    stateChange: function(e) {
      this.isPlay = e;
    },
    clickConcern: function(e) {
      if (e.teacher_id === this.userInfo.teacher_id) {
        this.userInfo.concern = e.concern;
      }
    },
    clickLike: function(e) {
      console.log("点击喜欢");

      if (e.class_id === this.classInfo.id) {
        this.classInfo.isLike = e.isLike;
        if (e.isLike) {
          CIData.recActionLike(this.classInfo);
          this.classInfo.likeNum = parseInt(this.classInfo.likeNum) + 1;
        } else {
          CIData.recActionDislike(this.classInfo);
          this.classInfo.likeNum = parseInt(this.classInfo.likeNum) - 1;
        }
      }
    },
    clickCollect: function(e) {
      console.log("点击收藏");

      if (e.class_id === this.classInfo.id) {
        this.classInfo.isSave = e.isSave;
        if (e.isSave) {
          CIData.recActionCollect(this.classInfo);
          this.classInfo.saveNum = parseInt(this.classInfo.saveNum) + 1;
        } else {
          CIData.recActionUncollect(this.classInfo);
          this.classInfo.saveNum = parseInt(this.classInfo.saveNum) - 1;
        }
      }
    },
    clickInvitation: function() {
      console.log("点击邀请");
      this.$router.push({
        name: "invitation",
        params: { classInfo: this.classInfo, teacherInfo: this.userInfo }
      });
    },
    clickTag(tag) {
      this.$router.push({
        name: "all",
        params: { tag: { id: tag.id, name: tag.name }, nokeep: true }
      });
    },
    clickBuy: function() {
      // 点击购买
      console.log("clickBuy");
      if (this.accessType === 1) {
        // 购买单课
        var self = this;
        network.createOrderMQ(this.classInfo.id, 2, function(res) {
          if (res.ret === 1 && res.data && res.data.trade_id) {
            self.$router.push("/orderPay/" + res.data.trade_id + "/0");
          } else {
            event.sendEvent("toast", {
              type: "fail",
              text: res.msg || "生成订单失败"
            });
          }
        });
      } else {
        // 购买套课
        if (this.classInfo.cid) {
          this.$router.push("/courseSeries/" + this.classInfo.cid);
        } else {
          event.sendEvent("toast", { type: "fail", text: "套课不存在" });
        }
      }
    }
  }
};
</script>

<style scoped>
#courseVideo {
  background-color: #ffffff;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -100px;
  top: 0px;
}

#courseVideo .courseVideo-content-text {
  position: relative;
  width: inherit;
  background-color: #ffffff;
  margin-bottom: 20px;
  padding: 20px 40px;
  font-size: 30px;
  text-align: left;
  color: #565656;
}

.course-button {
  position: fixed;
  bottom: 0px;
  width: 750px;
  height: 100px;
  font-size: 32px;
  text-align: center;
  color: white;
  background-image: linear-gradient(
    to right,
    #e7c25f,
    #e4be5b,
    #cea03f,
    #c69735
  );
}
</style>
