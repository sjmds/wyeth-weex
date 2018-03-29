<template>
  <OHSFullPage class="courseSeries">
    <div v-if="showType === 0 || showType === 1">
      <image class="courseSeries-poster" :src="courseCat.img" @click="clickPoster"/>
      <OBlock :width="750" :height="15" bgColor="rgba(0,0,0,0)"></OBlock>

      <div v-if="showType === 0">
        <ClassHeaderPrice :classInfo="classInfo" @clickLike="clickLike" @clickCollect="clickCollect"></ClassHeaderPrice>
      </div>

      <div v-if="showType === 1">
        <Usercell :userInfo='teacherInfo' @clickConcern='clickConcern'></Usercell>
        <text class='courseSerise-teacher-desc'>{{teacherInfo.teacher_desc}}</text>
      </div>

      <OBlock :width="750" :height="24" bgColor="#EFEFF4"></OBlock>

      <panel title="主要课程" :paddingLeft="12" :paddingRight="34" :titlePaddingLeft="10" :extraPaddingRight="27" :titleSize="29" :extraSize="25" :imgBg="require('assets/header_bg.png')" :imgLeftWitdh="8" titleColor="#af730c" extraColor="#666666" :imgLeftHeight="38" :imgRightWitdh="28" :imgRightHeight="28" :imgLeft="require('assets/line.png')" :noextra="true"></panel>
      <list class="classlist">
        <OHSClasscell v-for="(item,i) in classList" :key="i" @click="onItemClick(item)" :obj="item"></OHSClasscell>
      </list>

      <InviteButton @clickInvitation="clickInvitation"></InviteButton>
          <!-- <OBlock :width="750" :height="100" bgColor="#ECECEC"></OBlock> -->
    </div>

    <list class="waterfall-list" v-if="showType === 2" style="background-color:#ECECEC" loadmoreoffset = "10" @loadmore = "loadmore">
      <div class="courseSeries-waterfall-poster" :style="{backgroundImage:'url(' + courseCat.img + ')'}" @click="clickPoster">
        <text class="courseSeries-waterfall-num">已有{{courseCat.number || 0}}人参加</text>
      </div>
      <!-- <div class="testxxx" style="padding:10px;"> -->
      <waterfall class="courseSeries-waterfall" style="padding:13px;" test-id="waterfall" :column-count="columnCount" :column-gap="columnGap" :show-scrollbar="showScrollbar" :scrollable="scrollable">
        <cell class="courseSeries-waterfall-cell" v-for="(item,i) in classList" :key="i" @click="onItemClick(item)">
          <div>
            <CourseCardCell :item="item"></CourseCardCell>
          </div>
        </cell>
      </waterfall>
      <!-- </div> -->
      <div class="waterfall-footer">
        <text class="waterfall-footer-text" @click = "loadmore">{{loading_txt}}</text>
      </div>

      <text class="courseSeries-waterfall-text">“魔栗妈咪学院”版权归属育儿网所有，相关课程内容由育儿网提供。平台相关内容不作为医学诊断参考，如情况严重，建议及时就医。</text>

    </list>

    <div class="courseSeries-button" v-if="false" @click='submit' :style='buttonStyles[accessType].buttonImage'>
      <text class="courseSeries-button-text">{{buttonStyles[accessType].buttonTitle}}</text>
    </div>
  </OHSFullPage>
</template>

<script>
import Base from "../../mixins/base";
import config from "../../config.json";

import event from "../../modules/event";
import network from "../../modules/network/network";
import { courseRoute } from "../../modules/tools";
import { WxShare } from "../../modules/WxSDK";

import OBlock from "../../components/OBlock";
import OSlider from "../../components/OSlider";
import panel from "../../components/panel";
import Usercell from "../../components/usercell";

import {
  ClassHeaderPrice,
  LikeButton,
  CollectButton,
  CourseDetail
} from "../../components-proj/course";
import { InviteButton } from "../../components-proj/other";
import OHSClasscell from "../../components-proj/all/classCell";
import CourseCardCell from "../../components-proj/course/courseCardCell";
import { OHSFullPage } from "../../components-proj/comm/page";

export default {
  mixins: [Base],
  preload($route) {
    return ["getCourseSeries." + $route.params.id + ".1.10"];
  },
  components: {
    OSlider: OSlider.weexComponent,
    OBlock: OBlock.weexComponent,
    InviteButton: InviteButton.weexComponent,
    OHSClasscell: OHSClasscell.weexComponent,
    LikeButton: LikeButton.weexComponent,
    CollectButton: CollectButton.weexComponent,
    CourseDetail: CourseDetail.weexComponent,
    ClassHeaderPrice: ClassHeaderPrice.weexComponent,
    panel: panel.weexComponent,
    Usercell: Usercell.weexComponent,
    CourseCardCell: CourseCardCell,
    OHSFullPage: OHSFullPage.weexComponent
  },
  data() {
    return {
      // graySkin: true,
      courseCat: {},
      teacherInfo: {},
      classInfo: {},
      classList: [],
      userInfo: {},
      buttonStyles: [
        {
          buttonDisable: false,
          buttonTitle: "0MQ 购买",
          buttonImage:
            "backgroundImage: linear-gradient(to right, #e7c25f, #e4be5b,#cea03f,#c69735);"
        },
        {
          buttonDisable: false,
          buttonTitle: "一键订阅",
          buttonImage:
            "backgroundImage: linear-gradient(to right, #e7c25f, #e4be5b,#cea03f,#c69735);"
        },
        {
          buttonDisable: true,
          buttonTitle: "已订阅",
          buttonImage:
            "backgroundImage: linear-gradient(to right,#dddddd,#dddddd);"
        },
        {
          buttonDisable: true,
          buttonTitle: "报名更多课程",
          buttonImage:
            "backgroundImage: linear-gradient(to right, #e7c25f, #e4be5b,#cea03f,#c69735);"
        }
      ],
      padding: this.rpx(24),
      refreshing: false,
      columnCount: 2,
      columnGap: this.rpx(20),
      columnWidth: "auto",
      contentOffset: "0",
      showHeader: true,
      showScrollbar: false,
      scrollable: true,
      loading_txt: "正在努力加载...",
      page: 1,
      page_size: 10,
      isLoading: false
    };
  },
  created() {
    console.log("courseSeries created");
  },
  computed: {
    accessType: function() {
      if (parseInt(this.courseCat.purchased) === 1) {
        // 可阅读
        if (parseFloat(this.courseCat.price) > 0) {
          // 已购买
          return 3;
        } else {
          // 免费课
          return this.userInfo.is_subscribed ? 2 : 1;
        }
      } else {
        // 待购买
        return 0;
      }
    },
    showType: function() {
      /* show_type
        0:系列型   1:专家型   2:多图型   3:介绍型
      */
      let tmp = parseInt(this.courseCat.show_type);
      if (tmp === 3) {
        window.location.href =
          window.location.origin + "/mobile/cat?id=" + this.courseCat.id;
      }

      return tmp;
    }
  },
  watch: {
    $route: ["reload"]
  },
  methods: {
    depend() {
      return ["getCourseSeries." + this.$route.params.id + ".1.10"];
    },
    resolve() {
      let data = this.store(
        "getCourseSeries." + this.$route.params.id + ".1.10"
      ).data;

      this.courseCat = data.courseCat || {};

      this.teacherInfo = data.teacher_info || {};
      this.classList = data.courses || [];
      this.userInfo = data.userInfo;
      this.buttonStyles[0].buttonTitle = this.courseCat.price + "MQ 购买";

      this.classInfo =
        parseInt(this.courseCat.show_type) === 0
          ? this.courseCat
          : this.classList[0];
      this.classInfo.type = 2;

      this.page++;

      //  分享设置
      let share = data.share;
      if (share) {
        let title = share.title ? share.title : "魔栗妈咪学院";
        let desc = share.desc ? share.desc : "";
        let img = share.imgUrl ? share.imgUrl : "";
        let link = window.wyeth_host + "/mobile/index?defaultPath=/courseSeries/" + this.courseCat.id;

        var self = this;
        WxShare.share(
          title,
          desc,
          img,
          link,
          function() {
            console.log("分享成功");
            network.shareCourse(self.courseCat.id, function() {});
            CIData.push([
              "trackEvent",
              "wyeth",
              "share",
              "cid",
              self.courseCat.id
            ]);
          },
          function() {
            console.log("分享失败");
          }
        );
      }
    },
    loadmore: function(e) {
      console.log("======= loadmore");
      let self = this;
      if (self.isLoading === false) {
        console.log("onloading");
        self.isLoading = true;

        network.getCourseSeries(
          {
            cid: self.$route.params.id,
            page: self.page,
            page_size: self.page_size
          },
          function(res) {
            if (res.ret === 1) {
              let data = res.data.courses;
              if (data.length < self.page_size) {
                self.loading_txt = "暂无更多数据";
              } else {
                self.loading_txt = "";
              }

              self.classList.push(...data);

              self.page = self.page + 1;
            } else {
              self.loading_txt = "加载失败，请重试";
            }

            self.isLoading = false;
          },
          true
        );
      }
    },
    clickPoster: function(e) {
      if (this.courseCat.link && this.courseCat.link.length > 0) {
        window.location.href = this.courseCat.link;
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
    onItemClick: function(item) {
      courseRoute(item, { otherClass: this.classList });
    },
    submit: function() {
      if (this.buttonStyles[this.accessType].buttonDisable) {
        return;
      }
      if (this.accessType) {
        // 订阅
        this.clickSubscribe();
      } else {
        // 购买
        this.clickBuy();
      }
    },
    clickBuy: function() {
      var self = this;
      network.createOrderMQ(this.courseCat.id, 1, function(res) {
        if (res.ret === 1 && res.data && res.data.trade_id) {
          self.$router.push("/orderPay/" + res.data.trade_id + "/0");
        } else {
          event.sendEvent("toast", {
            type: "fail",
            text: res.msg || "生成订单失败"
          });
        }
      });
    },
    clickSubscribe: function() {
      var self = this;
      network.signCat(this.courseCat.id, function(res) {
        if (res.ret === 1) {
          event.sendEvent("toast", { type: "success", text: "订阅成功" });
          self.userInfo.is_subscribed = 1;
        }
      });
    },
    clickConcern: function(e) {
      if (e.teacher_id === this.teacherInfo.teacher_id) {
        this.teacherInfo.concern = e.concern;
      }
    },
    clickInvitation: function() {
      console.log("点击邀请");

      let tmp = {
        id: this.courseCat.id || this.classInfo.id,
        title: this.courseCat.name || this.classInfo.title,
        status: 5
      };

      this.$router.push({
        name: "invitation",
        params: { classInfo: tmp, teacherInfo: this.teacherInfo }
      });
    }
  }
};
</script>

<style scoped>
.courseSeries {
  background-color: #ffffff;
}

.courseSeries .courseSeries-poster {
  width: 750px;
  height: 335px;
}

.courseSeries .courseSerise-teacher-desc {
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

.courseSeries .courseSeries-button {
  position: fixed;
  bottom: 0px;
  width: 750px;
  height: 100px;
}
.courseSeries-button-text {
  position: relative;
  line-height: 100px;
  text-align: center;
  color: white;
  font-size: 32px;
}

.courseSeries-waterfall-num {
  position: absolute;
  left: 0px;
  bottom: 0px;
  margin: 20px 27px;
  font-size: 25px;
  color: rgba(188, 133, 65, 1);
  line-height: 30px;
}

.waterfall-list {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.courseSeries-waterfall {
  width: 750px;
  /* padding:10px; */
  /* margin: 0 -24px 0 0; */
  /* top: 0;
  left: 0;
  right: 0;
  height: 1000px; */
}

.courseSeries-waterfall-cell {
  width: 340px;
  padding-bottom: 23px;
}

.waterfall-footer {
  position: relative;
  width: 750rpx;
  height: 80rpx;
  justify-content: center;
  align-items: center;
}

.waterfall-footer-text {
  text-align: center;
  color: #888888;
  font-size: 24px;
}

.courseSeries-waterfall-poster {
  width: 750px;
  height: 470px;
  background-size: 100% auto;
  background-repeat: no-repeat;
}

.courseSeries-waterfall-text {
  margin: 70px 40px;
  font-size: 24px;
  color: #666666;
}
</style>
