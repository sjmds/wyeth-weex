<template>
  <OHSFullPage class="live">
    <!-- <div id="slot-video" :style="{backgroundImage: 'url('+liveInfo.poster+ ')'}"></div> -->
    <div id="slot-video"></div>
    
    <div id="cover" class="cover cover-guide" @click="defaultControl()">    
      <div class="top-header" :class="!platform && isStart ? 'header-android': ''">
        <div v-show="showType" class="info">
          <div class="teacher">
            <image class="avatar" :src="teacherInfo.teacher_avatar" />
            <div class="text">
              <text class="title">{{teacherInfo.teacher_name}}</text>
              <text class="subtitle">{{teacherInfo.teacher_desc}}</text>
            </div>

            <text class="concern" @click="concern()">+关注</text>
          </div>

          <text class="total">{{liveInfo.num}} 观看</text>
        </div>

        <div class="close" @click="close()">
          <image class="icon" :src="require('../../assets/live_close.png')" />
        </div>
      </div>
    
      <div class="footer">
        <text v-show="showType && showControl.reward" class="reward">{{liveInfo.reward}}</text>

        <div v-if="showType && showControl.notice" class="notice">
          <image class="icon" :src="require('assets/live_notice.png')" />
          <text class="text">{{liveInfo.notice}}</text>
        </div>

        <list v-show="showType" id="msgTable">
          <cell class="cell" v-for="(item,i) in msglist" :key="i">
            <p class="barrage"> 
              <span class="question" v-if="item.type === 1">提问</span>
              <span class="name">{{item.name}}:</span>
              <span class="content">{{item.msg}}</span>
            </p>
          </cell>
        </list>

        <div class="control">

          <div class="goods" @click="goods()">
            <text class="num">{{goodslist.length}}</text>
          </div>

          <div class="topGoods" v-if="showControl.goods" @click="clickGoods(goodslist[0])">
            <image class="cover" :src="goodslist[0].cover" />
            <div class="content">
              <text class="info name">{{goodslist[0].name}}</text>
              <text class="info price">¥{{goodslist[0].price}}</text>
            </div>
          </div>

          <image class="button" :src="require('../../assets/live_message.png')" @click="message()"/>
          <image class="button" :src="require('../../assets/live_question.png')" @click="question()"/>
          <image class="button" :src="require('../../assets/live_share.png')" @click="share()"/>
          <image class="button" :src="require('../../assets/live_reward.png')" @click="reward()"/>

          <div class="like" @click="like()">
            <div id="slot-like"></div>

            <text class="num">{{liveInfo.like}}</text>
            <image class="button" :src="require('../../assets/live_like.png')" />
          </div>

        </div>

      </div>

      <input  v-if="showType === showTypes.MessageInput || showType === showTypes.QuestionInput" id="input" class="input" :class="inputClass" autofocus="autofocus" :placeholder="showType === showTypes.QuestionInput ? '输入提问内容' : '聊点什么吧'"   @blur="onblur()"/>

      <button v-if="!isStart" class="play" @click="play()"></button>

      <div v-if="showType === showTypes.GoodsSheet" class="sheet-goods">
        <div class="header">
          <div class="content">
            <text class="title">全部商品</text>
            <text class="num">{{goodslist.length}}</text>
          </div>

          <div class="hide" @click="closeGoodsSheet()">
            <image class="icon" :src="require('../../assets/sheet_close.png')" />
          </div>
        </div>

        <list class="goodsList">
          <cell class="goods" v-for="(goods,i) in goodslist" :key="i">
            <image class="cover" :src="goods.cover" />

            <div class="content">
              <text class="name">{{goods.name}}</text>
              <text class="price">￥{{goods.price}}</text>
            </div>

            <text class="button" @click="clickGoods(goods)">去看看</text>
          </cell>
        </list>
      </div>

      <div v-if="showType === showTypes.RewardSheet || showType === showTypes.RechargeSheet" class="sheet-reward">
        <div class="header">
          <div class="content">
            <text class="title">打赏主播</text>
          </div>

          <div class="hide" @click="closeRewardSheet()">
            <image class="icon" :src="require('../../assets/sheet_close.png')" />
          </div>
        </div>

        <div v-if="showType === showTypes.RewardSheet">
          <div  class="body">
            <p class="mqInfo"> 
              <span class="title">我的MQ：</span>
              <span class="mqcount">865</span>
            </p>
            <div class="rewardInfo">
              <text class="title">打赏MQ</text>
              <input id="rechargeCount" class="count" type="number" autofocus="autofocus" placeholder="输入打赏MQ数量"/>
              <text class="unit">MQ</text>
            </div>
          </div>

          <div class="footer">
            <text class="button rechargeButton" @click="recharge()">充值</text>
            <text class="button rewardButton" @click="sendReward()">打赏</text>
          </div>
        </div>

        <div v-if="showType === showTypes.RechargeSheet" class="rechargelist">
          <div class="rechargeItem" v-for="item in rechargelist" :key="item.id" :class="rechargeSelected === item.id ? 'recharge-selected' : ''" @click="clickRechargeItem(item)">
            <text class="price">{{item.price}}元</text>
            <text class="mq">{{item.mq}}MQ</text>
          </div>
        </div>
      </div>


      <div class="share" v-if="showType === showTypes.Guide" @click="closeShare()">
        <image class="share-image" :src="require('assets/live_guide.png')"/>
      </div>

    </div>


  </OHSFullPage>
</template>

<script>
import base from "../../mixins/base";
import { OHSFullPage } from "../../components-proj/comm/page";
import { WxShare } from "../../modules/WxSDK";

import hearts from "../../modules/animation/hearts";

// 弹幕最大存储数量
const maxMessage = 50;

// 公告,打赏,置顶商品展示时长(ms)
const showTime = 5000;

// 商品最大存储数量
const maxGoods = 30;

// DOM对象
var videoPlayer = null;
var msgTable = null;

// 窗口显示控制
const showTypes = {
  HideDefault: 0,
  ShowDefault: 1,
  GoodsSheet: 2,
  MessageInput: 3,
  QuestionInput: 4,
  RewardSheet: 5,
  RechargeSheet: 6,
  Guide: 7
};

// 充值选项列表
const rechargelist = [
  {
    id: 1,
    price: 1,
    mq: 50
  },
  {
    id: 2,
    price: 6,
    mq: 300
  },
  {
    id: 3,
    price: 10,
    mq: 500
  },
  {
    id: 4,
    price: 20,
    mq: 1000
  },
  {
    id: 5,
    price: 50,
    mq: 2500
  },
  {
    id: 6,
    price: 100,
    mq: 5000
  }
];

export default {
  name: "Live",
  mixins: [base],
  components: {
    OHSFullPage: OHSFullPage.weexComponent
  },
  data() {
    return {
      platform: window.PLATFORM,
      rechargelist: rechargelist,
      showControl: {
        goods: false,
        reward: false,
        notice: false
      },
      showTypes: showTypes,
      showType: 1,
      isStart: false,
      isPlay: false,
      rechargeSelected: 0,
      liveInfo: {
        poster: require("../../assets/live_poster.png"),
        src: "http://wssource.hls.inke.cn/live/1521617564783368/playlist.m3u8",
        num: 17340,
        like: 162,
        notice: "主播现场提问结束后发起抽奖，送优惠券哦！",
        reward: "宝宝小沐沐 打赏主播100MQ"
      },
      teacherInfo: {
        concern: 1,
        teacher_avatar:
          "http://wyeth-uploadsites.nibaguai.com/wyethcourse/course/teacher/d2003902c65725b81491e517e4193c4d.jpg",
        teacher_desc:
          "擅长产科咨询，如产前咨询、流产、早产相关问题的咨询等。新晋奶爸，1岁女儿",
        teacher_hospital: "中山大学孙逸仙纪念医院围产专科",
        teacher_id: 115,
        teacher_name: "小鑫鑫",
        teacher_position: "主治医师"
      },
      shareInfo:{
        title:'我正在魔栗妈咪学院直播间',
        desc:'魔栗妈咪学院直播间，妈妈与专家面对面。育儿如此简单～',
        img:'https://wyeth-uploadsites.nibaguai.com/weex/live_share_cover.png',
        link:window.window.origin + "/mobile/index?defaultPath=/live&test=1"
      },
      msglist: [],
      goodslist: []
    };
  },
  created() {
    // 分享设置
    var self = this;

    WxShare.share(
      this.shareInfo.title,
      this.shareInfo.desc,
      this.shareInfo.img,
      this.shareInfo.link,
      function() {
        console.log("分享成功");
        self.closeShare()
        // network.shareCourse(self.classInfo.id, function() {
        //   self.$router.push({
        //     name: "shareResult",
        //     params: { recomClass: self.recomClass, classInfo: self.classInfo }
        //   });
        // });
        // CIData.push([
        //   "trackEvent",
        //   "wyeth",
        //   "share",
        //   "cid",
        //   self.classInfo.id
        // ]);
      },
      function() {
        event.sendEvent("toast", { type: "fail", text: "分享失败" });
        console.log("分享失败");
      },
      true
    );
  },
  mounted() {
    msgTable = document.querySelector("#msgTable");

    document.getElementById("slot-video").innerHTML = this.videoHTML;

    hearts.init(
      document.querySelector("#slot-like"),
      "position:absolute;bottom:0;right:0px;width:100%;height:100%;"
    );

    videoPlayer = document.querySelector("#video");

    var self = this;

    videoPlayer.addEventListener(
      "loadeddata",
      function(e) {
        self.onload(e);
      },
      false
    );
    videoPlayer.addEventListener(
      "loadedmetadata",
      function(e) {
        self.onload(e);
      },
      false
    );

    videoPlayer.addEventListener(
      "canplay",
      function(e) {
        self.oncanplay(e);
      },
      false
    );

    videoPlayer.addEventListener(
      "play",
      function(e) {
        self.onplay(e);
      },
      false
    );

    videoPlayer.addEventListener(
      "pause",
      function(e) {
        self.onpause(e);
      },
      false
    );

    videoPlayer.addEventListener(
      "ended",
      function(e) {
        self.onended(e);
      },
      false
    );

    videoPlayer.addEventListener("timeupdate", function(e) {
      // self.timeupdate(e)
    });

    //一般情况下，这样就可以自动播放了，但是一些奇葩iPhone机不可以
    // videoPlayer.play();
    // //必须在微信Weixin JSAPI的WeixinJSBridgeReady才能生效
    // document.addEventListener(
    //   "WeixinJSBridgeReady",
    //   function() {
    //     self.video.play();
    //   },
    //   false
    // );
    this.test();
  },
  computed: {
    videoHTML() {
      return (
        "<video id='video' poster='" +
        this.liveInfo.poster +
        "' preload='auto' auto-play autoplay='autoplay' play-status='play'  playsinline webkit-playsinline x5-playsinline x-webkit-airplay='allow' airplay='allow' x5-video-player-type='h5' x5-video-player-fullscreen='true' width='100%' height='100%' style='object-fit:fill'><source id='videosrc' src='" +
        this.liveInfo.src +
        "' type='application/vnd.apple.mpegurl' /><p class='warning'>浏览器不支持 HTML5 video.</p></video>"
      );
    },
    inputClass() {
      switch (this.platform) {
        case 1:
          return "input-iphone";
        case 2:
          return "input-iphoneX";
        default:
          return "";
      }
    }
  },
  methods: {
    onload: function(e) {
      console.log("onload");
    },
    start: function() {
      if (videoPlayer.paused) {
        this.play();
      } else {
        this.pause();
      }
    },
    play: function() {
      videoPlayer.play();
    },
    pause: function() {
      videoPlayer.pause();
    },
    timeupdate: function(e) {
      console.log("timeupdate:", e.srcElement);
    },
    onplay(e) {
      console.log("onplay,", e);
      this.isStart = true;
    },
    onended(e) {
      console.log("onended,", e);
      this.isStart = false;
    },
    onpause(e) {
      console.log("onpause", e);
      this.isStart = false;
    },
    oncanplay(e) {
      console.log("oncanplay", e);
    },
    onfail(e) {
      console.log("onfail", e);
    },
    defaultControl() {
      console.log("defaultControl");
      if (this.showType === showTypes.ShowDefault) {
        this.showType = showTypes.HideDefault;
      } else if (this.showType === showTypes.HideDefault) {
        this.showType = showTypes.ShowDefault;
      }
    },
    concern() {
      console.log("点击关注");
    },
    close() {
      console.log("关闭直播");
      this.$router.go(-1);
    },
    goods() {
      this.showControl.goods = false;
      this.showType = showTypes.GoodsSheet;
    },
    // 点击商品
    clickGoods(goods) {
      window.location.href = goods.link;
    },
    closeGoodsSheet() {
      this.showType === showTypes.GoodsSheet &&
        (this.showType = showTypes.ShowDefault);
    },
    message() {
      this.showType = showTypes.MessageInput;
    },
    question() {
      this.showType = showTypes.QuestionInput;
    },
    share() {
      this.showType = showTypes.Guide;
    },
    closeShare() {
      this.showType = showTypes.ShowDefault;
    },
    reward() {
      this.showType = showTypes.RewardSheet;
    },
    sendReward() {
      let count = document.querySelector("#rechargeCount").value;
      if (parseInt(count) > 0) {
        this.addReward("【本人】打赏主播" + count + "MQ");
        this.closeRewardSheet();
      } else {
        event.sendEvent("toast", { type: "fail", text: "请输入打赏金额" });
      }
    },
    recharge() {
      this.showType = showTypes.RechargeSheet;
    },
    clickRechargeItem(item) {
      this.rechargeSelected = item.id;
      this.closeRewardSheet();
    },
    closeRewardSheet() {
      (this.showType === showTypes.RewardSheet ||
        this.showType === showTypes.RechargeSheet) &&
        (this.showType = showTypes.ShowDefault);
    },
    like() {
      hearts.click();
      this.liveInfo.like++;
    },
    onblur() {
      let val = document.querySelector("#input").value;
      let type = this.showType === showTypes.MessageInput ? 0 : 1;
      if (val || val.length > 0) {
        this.addMessage(
          {
            id: 5,
            name: "【本人】",
            msg: val,
            self: true,
            type: type
          },
          true
        );
      }

      (this.showType === showTypes.MessageInput ||
        this.showType === showTypes.QuestionInput) &&
        (this.showType = showTypes.ShowDefault);
    },
    // 添加一条弹幕
    addMessage(msg, forceScroll) {
      var self = this;

      let flag = false;

      if (forceScroll || this.reachBottom(msgTable)) {
        flag = true;
      }

      if (this.msglist.length >= maxMessage) {
        this.msglist.shift();
      }

      this.msglist.push(msg);

      // 滚动到弹幕底部
      this.$nextTick(function() {
        if (flag && msgTable) {
          self.scrollToBottom(msgTable);
        }
      });
    },
    // 添加打赏信息
    addReward(msg, send) {
      this.liveInfo.reward = msg;

      this.showControl.reward = true;
      var self = this;
      setTimeout(function() {
        self.showControl.reward = false;
      }, showTime);

      if (send) {
        // 发送
      }
    },
    addNotice(msg, send) {
      this.liveInfo.notice = msg;

      this.showControl.notice = true;
      var self = this;
      setTimeout(function() {
        self.showControl.notice = false;
      }, showTime);

      if (send) {
        // 发送
      }
    },
    reachBottom(list) {
      // 10冗余度
      return list.scrollTop + list.clientHeight >= list.scrollHeight - 20;
    },
    scrollToBottom(list) {
      if (!this.reachBottom(list)) {
        list.scrollTop = list.scrollHeight - list.clientHeight;
      }
    },
    // 添加一个商品
    addGoods(goods) {
      if (this.goodslist.length >= maxGoods) {
        this.goodslist.shift();
      }

      this.goodslist.unshift(goods);

      this.showControl.goods = true;

      let self = this;
      setTimeout(function() {
        self.showControl.goods = false;
      }, showTime);
    },
    // 测试
    test() {
      this.goodslist = [
        {
          id: 1,
          cover:
            "http://m.360buyimg.com/babel/s456x456_jfs/t5596/323/4832638910/73507/bf57f27b/59561ffcN2ec5dcd2.jpg",
          name: "惠氏S-26艾智萌进口儿童成长配方牛奶（200ml*15盒装）",
          price: "279.00",
          link:
            "https://pro.m.jd.com/mall/active/2Lemzb4ucUmNWUMrfgbsRgyDfkvd/index.html"
        },
        {
          id: 2,
          cover:
            "http://m.360buyimg.com/babel/s456x456_jfs/t5596/323/4832638910/73507/bf57f27b/59561ffcN2ec5dcd2.jpg",
          name: "京东双十一惠氏S-26孕妇妈妈奶粉",
          price: "279.00",
          link:
            "https://pro.m.jd.com/mall/active/2Lemzb4ucUmNWUMrfgbsRgyDfkvd/index.html"
        },
        {
          id: 3,
          cover:
            "http://m.360buyimg.com/babel/s456x456_jfs/t5596/323/4832638910/73507/bf57f27b/59561ffcN2ec5dcd2.jpg",
          name: "京东双十一惠氏S-26限定版3段新品上市优惠大放送",
          price: "279.00",
          link:
            "https://pro.m.jd.com/mall/active/2Lemzb4ucUmNWUMrfgbsRgyDfkvd/index.html"
        }
      ];

      this.addMessage(
        {
          id: 2,
          name: "流浪法师-圆号",
          msg: "欢迎来到召唤师峡谷",
          self: false,
          type: i % 2
        },
        false
      );

      var self = this;
      let i = 1;
      setInterval(function() {
        self.addMessage(
          {
            id: 2,
            name: "圆号" + i,
            msg:
              "这是一个弹幕哦哦哦~~~这是一个弹幕哦哦哦这是一个弹幕哦哦哦这是一个弹幕哦哦哦",
            self: false,
            type: i % 2
          },
          false
        );

        if (i % 3 === 0) {
          self.addGoods({
            id: i,
            cover:
              "http://m.360buyimg.com/babel/s456x456_jfs/t5596/323/4832638910/73507/bf57f27b/59561ffcN2ec5dcd2.jpg",
            name: i + "京东双十一惠氏S-26限定版3段新品上市优惠大放送",
            price: "279.00",
            link:
              "https://pro.m.jd.com/mall/active/2Lemzb4ucUmNWUMrfgbsRgyDfkvd/index.html"
          });
        }

        if (i % 5 === 0) {
          self.addNotice("主播现场提问结束后发起抽奖，送优惠券哦！", false);
        }

        i++;
      }, 4000);
    }
  }
};
</script>

<style lang="sass" scoped>
  @import "../scss/live.scss";
</style>
