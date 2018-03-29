<template>
  <OHSFullPage v-show="!graySkin">

    <!-- 预约课 -->
    <div class="course" v-if="courseType === 1">
      <image class='courseNew-poster' :src='classInfo.img'/>
      <ClassHeader :classInfo='classInfo' @clickLike='clickLike' @clickCollect='clickCollect' @clickTag='clickTag'></ClassHeader>

      <div class='courseNew-date'>
        <text class='courseNew-date-title'>开课时间</text>
        <text class='courseNew-date-startTime'>{{classInfo.start_day + ' ' + classInfo.start_time}}</text>
      </div>

      <Usercell :userInfo='userInfo' @clickConcern='clickConcern'></Usercell>

      <panel title='课程介绍' :paddingLeft='12' :paddingRight='34' :titlePaddingLeft='10' :extraPaddingRight='27' :titleSize='29' :extraSize='25' :imgLeftWitdh='8' titleColor='#af730c' extraColor='#666666' :imgLeftHeight='38' :imgRightWitdh='28' :imgRightHeight='28' :imgLeft="require('assets/line.png')" :noextra='true'></panel>
      <text class='courseNew-course-desc'>{{classInfo.course_desc}}</text>
      <OBlock :width='750' :height='24' bgColor='rgba(0,0,0,0)'></OBlock>

      <panel title='讲师介绍' :paddingLeft='12' :paddingRight='34' :titlePaddingLeft='10' :extraPaddingRight='27' :titleSize='29' :extraSize='25' :imgLeftWitdh='8' titleColor='#af730c' extraColor='#666666' :imgLeftHeight='38' :imgRightWitdh='28' :imgRightHeight='28' :imgLeft="require('assets/line.png')" :noextra='true'></panel>
      <text class='courseNew-teacher-desc'>{{userInfo.teacher_desc}}</text>

      <text class='courseNew-content-default'>{{defaultContent}}</text>

      <OBlock :width='750' :height='100' bgColor='rgba(0,0,0,0)'></OBlock>

      <div class='courseNew-footer' v-if='courseStatus < 2 && courseStatus >= 0'>
        <div class='courseNew-footer-text'>
          <text class='courseNew-footer-text-1'>已有</text>
          <text class='courseNew-footer-text-2'>{{(classInfo.regNum || 0)}}</text>
          <text class='courseNew-footer-text-1'>位妈妈订阅</text>
        </div>
        <button class='courseNew-footer-button-1' @click='clickSubscribe' :disabled='subscribeStyles[courseStatus].buttonEnable' :style='subscribeStyles[courseStatus].buttonImage'>{{subscribeStyles[courseStatus].buttonTitle}}</button>
      </div>

      <div class='courseNew-footer' v-if='courseStatus === 2'>
        <button class='courseNew-footer-button-2' :disabled='false'>正在准备回顾，敬请期待！</button>
      </div>

      <InviteButton @clickInvitation='clickInvitation'></InviteButton>
    </div>

    <!-- 视频/音频课 -->
    <div class="course" v-show="courseType > 1">
      <scroller id="courseScroll">

        <OSlider v-if="classInfo && classInfo.banners && classInfo.banners.length > 0" :items="classInfo.banners" :width="750" :interval="3000" :autoPlay="true" :height="750" :showIndicator="false"></OSlider>

        <div v-if="courseType === 2">
          <OBlock :width="750" :height="24" bgColor="RGBA(0,0,0,0)"></OBlock>
          <Introduction :userInfo="userInfo" :classInfo="classInfo" @clickConcern="clickConcern" @clickLike="clickLike" @clickCollect="clickCollect" @clickTag="clickTag"></Introduction>

          <OBlock v-if="otherClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
          <OtherClass v-if="otherClass.length > 0" :items="otherClass" title="相关课程"></OtherClass>

          <OBlock v-if="classlist.chapter && classlist.chapter.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
          <Classlist v-if="classlist.chapter &&  classlist.chapter.length > 0" :classlist="classlist" :songSelected="songSelected" @clickSectionCell="clickSectionCell"></Classlist>
        </div>

        <div v-if="courseType === 3">
          <VideoPlayer :access="!accessType" :videoInfo="classlist" :classInfo="classInfo" @stateChange="stateChange"></VideoPlayer>
          <ClassHeader :classInfo="classInfo" @clickLike="clickLike" @clickCollect="clickCollect" @clickTag="clickTag"></ClassHeader>

          <OBlock :width="750" :height="25" bgColor="#ffffff"></OBlock>
          <Usercell :userInfo="userInfo" @clickConcern="clickConcern"></Usercell>
          <OBlock :width="750" :height="25" bgColor="#ffffff"></OBlock>

          <OBlock :marginLeft="15" :marginRight="15" :width="720" :height="2" bgColor="#eeeeee"></OBlock>
          <text class="courseVideo-content-text">{{classInfo.course_desc}}</text>

          <OBlock v-if="otherClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
          <OtherClass v-if="otherClass.length > 0" :items="otherClass" title="相关课程"></OtherClass>
        </div>


        <OBlock v-if="classInfo.guide && classInfo.guide.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
        <CourseDetail v-show="classInfo.guide && classInfo.guide.length > 0" :details="classInfo.guide"></CourseDetail>

        <OBlock v-if="broadcast1.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
        <OSlider v-if="broadcast1.length > 0" :items="broadcast1" :width="750" :interval="3000" :autoPlay="true" :height="200" :showIndicator="false"></OSlider>

        <OBlock v-if="recomClass.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
        <CourseRecommend :recommendList="recomClass"></CourseRecommend>

        <OBlock v-if="broadcast2.length > 0" :width="750" :height="24" bgColor="#eeeeee"></OBlock>
        <OSlider v-if="broadcast2.length > 0" :items="broadcast2" :width="750" :interval="3000" :autoPlay="true" :height="360" :showIndicator="false"></OSlider>

        <OBlock v-if="broadcast2.length > 0" :width="750" :height="70" bgColor="#eeeeee"></OBlock>

        <OBlock v-if="accessType" :width="750" :height="115" bgColor="#eeeeee"></OBlock>
        <OBlock v-else-if="courseType === 2" :width="750" :height="100" bgColor="#eeeeee"></OBlock>

        <InviteButton @clickInvitation='clickInvitation'></InviteButton>
      </scroller>

      <button v-if="accessType" class='course-button' @click='clickBuy'>{{classInfo.price}}MQ 购买</button>

      <AudioBottom v-else-if="courseType === 2" ref="audioBottom" :classlist="classlist" @timeupdate="timeupdate"></AudioBottom>

      <audio :src="classlist.src" preload="auto"></audio>

    </div>

    <FlashPic :flashData="flashData"></FlashPic>

  </OHSFullPage>
</template>

<script>
// 服务
import Base from "../../mixins/base";
import config from "../../config.json";
import network from "../../modules/network/network";
import event from "../../modules/event/index";
import CIData from "../../modules/CIData";
import { WxShare } from "../../modules/WxSDK";

// 通用
import { OHSFullPage } from "../../components-proj/comm/page";
import OBlock from "../../components/OBlock";
import { InviteButton } from "../../components-proj/other";
import FlashPic from "../../components-proj/app/flashPic.vue";
import OSlider from "../../components/OSlider";
import {
  OtherClass,
  CourseRecommend,
  CourseDetail
} from "../../components-proj/course";

// 预约课+视频课
import { ClassHeader } from "../../components-proj/course";

import Usercell from "../../components/usercell";

// 预约课
import panel from "../../components/panel";

// 音频课
import {
  AudioBottom,
  Introduction,
  Classlist
} from "../../components-proj/course";

// 视频课
import { VideoPlayer } from "../../components-proj/course";

export default {
  mixins: [Base],
  preload($route) {
    return ["course." + $route.params.id];
  },
  components: {
    // 通用
    OHSFullPage: OHSFullPage.weexComponent,
    OBlock: OBlock.weexComponent,
    InviteButton: InviteButton.weexComponent,
    FlashPic,
    OtherClass: OtherClass.weexComponent,
    CourseRecommend: CourseRecommend.weexComponent,
    CourseDetail: CourseDetail.weexComponent,
    OSlider: OSlider.weexComponent,

    // 预约课+视频课
    Usercell: Usercell.weexComponent,
    ClassHeader: ClassHeader.weexComponent,

    // 预约课
    panel: panel.weexComponent,

    // 音频课
    Introduction: Introduction.weexComponent,
    Classlist: Classlist.weexComponent,
    AudioBottom: AudioBottom.weexComponent,

    // 视频课
    VideoPlayer: VideoPlayer.weexComponent
  },
  data() {
    return {
      // 通用
      graySkin: true,
      classInfo: {},
      userInfo: {},
      flashData: {},
      page: 2,
      pageSize: 10,

      // 音频课+视频课
      classlist: {},
      otherClass: [],
      recomClass: [],
      broadcast1: [],
      broadcast2: [],

      // 预约课
      subscribeStyles: [
        {
          buttonEnable: false,
          buttonTitle: "订阅",
          buttonImage:
            "backgroundImage: linear-gradient(to right, #e7c25f, #e4be5b,#cea03f,#c69735);"
        },
        {
          buttonEnable: true,
          buttonTitle: "已订阅",
          buttonImage:
            "backgroundImage: linear-gradient(to right,#dddddd,#dddddd);"
        }
      ],
      defaultContent:
        "·魔栗妈咪学院”版权归属育儿网所有，相关课程内容由育儿网提供。平台相关内容不作为医学诊断参考，如情况严重，建议及时就医。",

      // 音频课
      songlist: [],
      songSelected: {},
      currentTime: 0,
      totalTime: 0,
      progressWidth: 581,
      index: 0,
      audoPlay: false,

      // 视频课
      isPlay: false
    };
  },
  created() {},
  mounted() {},
  computed: {
    // 通用
    courseType: function() {
      /*
        default: 0
        courseNew: 1,
        courseAudio: 2,
        courseVideo: 3
      */
      if (!this.classInfo || !this.classInfo.id) {
        return 0;
      }

      switch (this.classInfo.status) {
        case 1:
          // 报名中
          return 1;
        case 3:
          // 已结束
          switch (this.classInfo.review_type) {
            case 0:
              // 未上传
              return 1;
            case 1:
              // 音频
              return 2;
            case 2:
              // 视频
              return 3;
            default:
              return 1;
          }
          break;
        case 4:
          // 已报名
          return 1;
        default:
          return 0;
      }
    },
    // 预约课
    courseStatus: function() {
      // return 2;
      switch (this.classInfo.status) {
        case 1:
          CIData.push(["trackEvent", "page", "page_reg"]);
          return 0;
        case 4:
          CIData.push(["trackEvent", "page", "page_reg"]);
          return 1;
        case 3:
          return 2;
        default:
          return 0;
      }
    },
    // 音频课+视频课
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
    // 通用
    depend() {
      return ["course." + this.$route.params.id];
    },
    resolve() {
      if (this.graySkin) {
        this.graySkin = false;
        event.sendEvent("graySkin", { show: false });
      }

      let data = this.store("course." + this.$route.params.id).data;
      this.classInfo = data.classInfo || {};
      CIData.recActionView(this.classInfo);
      this.userInfo = data.userInfo || {};

      let tmp = data.classlist || {};
      tmp.img = this.classInfo.img;
      this.classlist = tmp;

      this.otherClass = data.catCourses || [];
      this.recomClass = data.recomClass || [];
      this.flashData = data.flashPic[0] || {};

      // 预约课
      this.broadcast = data.broadcast || [];

      // 音频课+视频课
      this.broadcast1 = data.broadcast1 || [];
      this.broadcast2 = data.broadcast2 || [];

      if (data.mq) {
        event.sendEvent("toast", { type: "success", text: "完成任务" });
      }

      if (document.querySelector("#courseScroll")) {
        document.querySelector("#courseScroll").scrollTop = 0;
      }

      // 分享设置
      var self = this;
      let title = self.classInfo.title ? self.classInfo.title : "魔栗妈咪学院";
      let desc = self.classInfo.course_desc ? self.classInfo.course_desc : "";
      let img = self.classInfo.img ? self.classInfo.img : "";
      let link =
        window.wyeth_host + "/mobile/index?defaultPath=/course/" + self.classInfo.id;

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

      if (this.otherClass.length >= this.pageSize) {
        this.getOtherClass();
      }
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
    getOtherClass: function() {
      var self = this;

      console.log("page:", self.page);

      network.getDetailCatCourse(
        { course_id: this.classInfo.id, page: this.page },
        function(res) {
          if (res.ret === 1 && res.data) {
            self.page++;
            self.otherClass.push(...res.data);
            if (res.data.length >= self.pageSize) {
              // 可以加载更多
              self.getOtherClass();
            } else {
              // 没有更多了
            }
          }
        }
      );
    },
    // 音频课+视频课
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
    },
    // 预约课
    clickSubscribe: function() {
      var self = this;
      network.orderCourse(this.classInfo.id, function(res) {
        if (res.ret === 1) {
          event.sendEvent("toast", { type: "success", text: "订阅成功" });
          self.classInfo.status = 4;
        }
      });
    },
    // 音频课
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
    // 视频课
    stateChange: function(e) {
      this.isPlay = e;
    }
  }
};
</script>

<style scoped>
/* 通用 */
.course {
  background-color: #ffffff;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0px;
  top: 0px;
}

/* 音频课+视频课 */
#courseScroll {
  background-color: #ffffff;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0px;
  top: 0px;
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

/* 预约课 */
.course .courseNew-poster {
  width: 750px;
  height: 411px;
}

.course .courseNew-date {
  position: relative;
  background-color: #ffffff;
  width: inherit;
  height: 147px;
  flex-direction: column;
  justify-content: space-around;
}

.courseNew-date .courseNew-date-title {
  color: #474747;
  font-size: 26px;
  text-align: left;
  left: 36px;
  margin-bottom: -20px;
}

.courseNew-date .courseNew-date-startTime {
  color: #f63656;
  font-size: 30px;
  text-align: left;
  left: 36px;
  margin-top: -20px;
}

.course .courseNew-course-desc,
.course .courseNew-teacher-desc,
.course .courseNew-content-default {
  position: relative;
  width: inherit;
  background-color: #ffffff;
  padding: 20px 40px;
  font-size: 30px;
  text-align: left;
  color: #565656;
  border-top-width: 1px;
  border-top-color: #eeeeee;
  border-top-style: solid;
}

.course .courseNew-footer {
  position: fixed;
  bottom: 0px;
  width: 750px;
  height: 100px;
  background-color: #ffffff;
  flex-direction: row;
  justify-content: space-between;
  border-top-width: 2px;
  border-top-color: #eeeeee;
  border-top-style: solid;
}

.course .courseNew-footer-text {
  position: relative;
  width: 480px;
  height: 100px;
  flex-direction: row;
  justify-content: center;
}

.course .courseNew-footer-text-1,
.course .courseNew-footer-text-2 {
  position: relative;
  line-height: 100px;
  text-align: center;
  color: #333333;
  font-size: 32px;
}

.course .courseNew-footer-text-2 {
  color: #f63656;
}

.course .courseNew-footer-button-1 {
  position: relative;
  width: 270px;
  height: 100px;
  text-align: center;
  color: white;
  font-size: 34px;
}

.course .courseNew-footer-button-2 {
  position: relative;
  width: 750px;
  height: 100px;
  text-align: center;
  color: white;
  background-color: #dddddd;
  font-size: 34px;
}

/* 音频课 */
introduction {
  margin: 0 0 20px 0;
}

classlist {
  margin: 0 0 20px 0;
}

/* 视频课 */
.courseVideo-content-text {
  position: relative;
  width: inherit;
  background-color: #ffffff;
  margin-bottom: 20px;
  padding: 20px 40px;
  font-size: 30px;
  text-align: left;
  color: #565656;
}
</style>

</style>
