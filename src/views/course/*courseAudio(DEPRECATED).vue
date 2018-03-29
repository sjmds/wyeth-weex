<template>
  <OHSFullPage v-show="!graySkin">
    <scroller id="courseAudio" @appear="onappear" @disappear="ondisappear">
      <OBlock :width="750" :height="24" bgColor="RGBA(0,0,0,0)"></OBlock>
      <Introduction :userInfo="userInfo" :classInfo="classInfo" @clickConcern="clickConcern" @clickLike="clickLike" @clickCollect="clickCollect" @clickTag="clickTag"></Introduction>

      <OBlock v-show="otherClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <OtherClass v-show="otherClass.length > 0" :items="otherClass" title="相关课程"></OtherClass>

      <OBlock v-show="classlist.chapter && classlist.chapter.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <Classlist v-show="classlist.chapter &&  classlist.chapter.length > 0" :classlist="classlist" :songSelected="songSelected" @clickSectionCell="clickSectionCell"></Classlist>

      <OBlock v-show="classInfo.guide && classInfo.guide.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <CourseDetail v-show="classInfo.guide && classInfo.guide.length > 0" :details="classInfo.guide"></CourseDetail>

      <OBlock v-show="broadcast1.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <OSlider v-show="broadcast1.length > 0" :items="broadcast1" :width="750" :interval="3000" :autoPlay="true" :height="200" :showIndicator="false"></OSlider>

      <OBlock v-show="recomClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <CourseRecommend :recommendList="recomClass"></CourseRecommend>

      <OBlock v-show="broadcast2.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
      <OSlider v-show="broadcast2.length > 0" :items="broadcast2" :width="750" :interval="3000" :autoPlay="true" :height="360" :showIndicator="false"></OSlider>

      <OBlock v-show="broadcast2.length > 0" :width="750" :height="70" bgColor="#eeeeee"></OBlock>

      <InviteButton @clickInvitation="clickInvitation"></InviteButton>

      <OBlock :width="750" :height="115" bgColor="#eeeeee"></OBlock>

    </scroller>

    <button v-if="accessType" class='course-button' @click='clickBuy'>{{classInfo.price}}MQ 购买</button>
    <AudioBottom ref="audioBottom" v-else :classlist="classlist" @timeupdate="timeupdate"></AudioBottom>

    <FlashPic :flashData="flashData"></FlashPic>
  </OHSFullPage>
</template>

<script>
import Base from "../../mixins/base";

import network from "../../modules/network/network";
import { WxShare } from "../../modules/WxSDK";

import {
  AudioBottom,
  Introduction,
  Classlist,
  OtherClass,
  CourseDetail,
  CourseRecommend
} from "../../components-proj/course";
import { InviteButton } from "../../components-proj/other";

import config from "../../config.json";

import { OHSFullPage } from "../../components-proj/comm/page";
import OBlock from "../../components/OBlock";

import OSlider from "../../components/OSlider";
import event from "../../modules/event";
import CIData from "../../modules/CIData";

import FlashPic from "../../components-proj/app/flashPic.vue";

export default {
  mixins: [Base],
  preload($route) {
    return ["course." + $route.params.id];
  },
  components: {
    OtherClass: OtherClass.weexComponent,
    CourseRecommend: CourseRecommend.weexComponent,
    OSlider: OSlider.weexComponent,
    AudioBottom: AudioBottom.weexComponent,
    Introduction: Introduction.weexComponent,
    Classlist: Classlist.weexComponent,
    InviteButton: InviteButton.weexComponent,
    OBlock: OBlock.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent,
    CourseDetail: CourseDetail.weexComponent,
    FlashPic
  },
  data() {
    return {
      graySkin: true,
      classInfo: {},
      userInfo: {},
      classlist: {},
      otherClass: [],
      recomClass: [],
      broadcast1: [],
      broadcast2: [],
      flashData: {},
      songlist: [],
      songSelected: {},
      currentTime: 0,
      totalTime: 0,
      progressWidth: 581,
      index: 0,
      audoPlay: false
    };
  },
  created() {
    console.log("!!!!!!!!!courseAudio created");
  },
  updated() {},
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

      let tmp = data.classlist || {};
      tmp.img = this.classInfo.img;

      this.classlist = tmp;
      this.otherClass = this.$route.params.otherClass || [];
      this.recomClass = data.recomClass || [];
      this.broadcast1 = data.broadcast1 || [];
      this.broadcast2 = data.broadcast2 || [];
      this.flashData = data.flashPic[0] || {};

      if (document.querySelector("#courseAudio")) {
        document.querySelector("#courseAudio").scrollTop = 0;
      }

      if (data.mq) {
        event.sendEvent("toast", { type: "success", text: "完成任务" });
      }

      // 分享设置
      var self = this;
      var linkUrl =
        window.wyeth_host +
        "/mobile/index?defaultPath=/courseAudio/" +
        self.classInfo.id;
      let title = self.classInfo.title ? self.classInfo.title : "魔栗妈咪学院";
      let desc = self.classInfo.course_desc ? self.classInfo.course_desc : "";
      let img = self.classInfo.img ? self.classInfo.img : "";
      let link = linkUrl;
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
    clickSectionCell: function(e) {
      console.log("clickSectionCell:", e);

      CIData.push([
        "trackEvent",
        "wyeth",
        "section_click",
        this.classInfo.id,
        e.chapterIndex + "-" + e.section.index
      ]);

      this.songSelected = e.section;

      this.$refs.audioBottom.forceJump(e.section.start);
    },
    timeupdate: function(e) {
      this.checkTimeRange(e.point);
    },
    checkTimeRange: function(time) {
      var self = this;
      this.classlist.chapter.some(function(chapter) {
        chapter.section.some(function(section) {
          // 增加冗余度
          if (
            time > parseFloat(section.start) + 1 &&
            time < parseFloat(section.end) - 1
          ) {
            self.songSelected = section;
            return true;
          }
        });
      });
    },
    onappear: function() {
      console.log("!!!!!!!!!courseAudio appear");
    },
    ondisappear: function() {
      console.log("!!!!!!!!!courseAudio ondisappear");
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
          CIData.recActionCollect(this.classInfo)
          this.classInfo.saveNum = parseInt(this.classInfo.saveNum) + 1;
        } else {
          CIData.recActionUncollect(this.classInfo)
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
#courseAudio {
  background-color: #ffffff;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0px;
  top: 0px;
}

introduction {
  margin: 0 0 20px 0;
}

classlist {
  margin: 0 0 20px 0;
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
