<template>
  <div id='courseNew' v-show='!graySkin'>
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
    <FlashPic :flashData="flashData"></FlashPic>

  </div>
</template>

<script>
import Base from "../../mixins/base";

import event from "../../modules/event";
import network from "../../modules/network/network";

import OSlider from "../../components/OSlider";
import Usercell from "../../components/usercell";
import { WxShare } from "../../modules/WxSDK";
import CIData from "../../modules/CIData/index";

import { ClassHeader } from "../../components-proj/course";
import { InviteButton } from "../../components-proj/other";
import OBlock from "../../components/OBlock";
import config from "../../config.json";
import panel from "../../components/panel";
import FlashPic from "../../components-proj/app/flashPic.vue";

export default {
  mixins: [Base],
  preload($route) {
    return ["course." + $route.params.id];
  },
  components: {
    OSlider: OSlider.weexComponent,
    Usercell: Usercell.weexComponent,
    ClassHeader: ClassHeader.weexComponent,
    OBlock: OBlock.weexComponent,
    InviteButton: InviteButton.weexComponent,
    panel: panel.weexComponent,
    FlashPic
  },
  data() {
    return {
      graySkin: true,
      classInfo: {},
      userInfo: {},
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
      flashData:{}
    }
  },
  computed: {
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
    }
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
      this.userInfo = data.userInfo || {};
      this.classlist = data.classlist || {};
      this.otherClass = data.otherClass || [];
      this.recomClass = data.recomClass || [];
      this.broadcast = data.broadcast || [];
      this.flashData = data.flashPic[0] || {}

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
        "/mobile/index?defaultPath=/courseNew/" +
        self.classInfo.id;
      WxShare.share(
        title,
        desc,
        img,
        link,
        function() {
          console.log("分享成功");
          event.sendEvent("toast", { type: "success", text: "分享成功" });
          network.shareCourse(self.classInfo.id, function() {});
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
        }
      );
    },
    clickSubscribe: function() {
      var self = this;
      network.orderCourse(this.classInfo.id, function(res) {
        if (res.ret === 1) {
          event.sendEvent("toast", { type: "success", text: "订阅成功" });
          self.classInfo.status = 4;
        }
      });
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
          this.classInfo.likeNum = parseInt(this.classInfo.likeNum) + 1;
        } else {
          this.classInfo.likeNum = parseInt(this.classInfo.likeNum) - 1;
        }
      }
    },
    clickCollect: function(e) {
      console.log("点击收藏");

      if (e.class_id === this.classInfo.id) {
        this.classInfo.isSave = e.isSave;
        if (e.isSave) {
          this.classInfo.saveNum = parseInt(this.classInfo.saveNum) + 1;
        } else {
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
    }
  }
};
</script>

<style scoped>
#courseNew {
  background-color: #ffffff;
}

#courseNew .courseNew-poster {
  width: 750px;
  height: 411px;
}

#courseNew .courseNew-date {
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

#courseNew .courseNew-course-desc,
#courseNew .courseNew-teacher-desc,
#courseNew .courseNew-content-default {
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

#courseNew .courseNew-footer {
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

#courseNew .courseNew-footer-text {
  position: relative;
  width: 480px;
  height: 100px;
  flex-direction: row;
  justify-content: center;
}

#courseNew .courseNew-footer-text-1,
#courseNew .courseNew-footer-text-2 {
  position: relative;
  line-height: 100px;
  text-align: center;
  color: #333333;
  font-size: 32px;
}

#courseNew .courseNew-footer-text-2 {
  color: #f63656;
}

#courseNew .courseNew-footer-button-1 {
  position: relative;
  width: 270px;
  height: 100px;
  text-align: center;
  color: white;
  font-size: 34px;
}

#courseNew .courseNew-footer-button-2 {
  position: relative;
  width: 750px;
  height: 100px;
  text-align: center;
  color: white;
  background-color: #dddddd;
  font-size: 34px;
}
</style>
