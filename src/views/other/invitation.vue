<template>
  <div id="invitation">
    <!--<OBlock :width="750" :height="1" bgColor="rgba(0,0,0,0)"></OBlock>-->
    <div class="invitation-card" ref="invitationCard">
      <canvas v-show="showCanvas" id="myCanvas" ref="myCanvas" :width="canvas_width" :height="canvas_height" :style="{width:canvas_width + 'px',height:canvas_height + 'px'}"></canvas>
      <image v-show="false" class="invitationCard-content-qrcode"/>
    </div>
    <div class="invitation-bottom">
      <text class="invitation-bottom-text">长按上图保存邀请卡发送给好友</text>
      <scroller scroll-direction="horizontal" class="invitation-gallery" show-scrollbar="false">
        <div class="invitation-gallery-item" v-for="(item, index) in iconList" :key="index" @click="chooseItem(index)" ref="galleryItem">
          <image :src="item" class="invitation-gallery-img"/>
          <div v-show="chosenIndex == index" class="invitation-gallery-item-shadow" ref="gallery">
            <image v-if="chosenIndex == index" class="invitation-gallery-item-chosen" :src="require('assets/invitation_icon_chosen.png')"/>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>

<script>
import OBlock from "../../components/OBlock";
import Base from "../../mixins/base";
import { WxShare } from "../../modules/WxSDK";
import network from "../../modules/network/network";
import CIData from "../../modules/CIData";

import jquery from "../../modules/thirdlib/jquery.min";
import qrcode from "../../modules/thirdlib/jquery.qrcode.min";
const dom = weex.requireModule("dom");

export default {
  mixins: [Base],
  components: {
    OBlock: OBlock.weexComponent
  },
  preload($route) {
    return ["getAd.9." + $route.params.classInfo.brand];
  },
  data() {
    return {
      showCanvas: true,
      broadcast: [],
      resolution: 2,
      userInfo: this.store("userInfo"),
      classInfo: this.$route.params.classInfo,
      teacherInfo: this.$route.params.teacherInfo,
      shareContent: {
        desc: "向你推荐一个很棒的课程",
        channel: "魔栗妈咪学院",
        guide: "长按识别二维码，立即进入课程",
        link: window.location.origin + "/mobile/index"
      },
      canvas_width: this.rpx(554),
      canvas_height: this.rpx(966),
      isAvatarReady: false,
      isQrcodeReady: false,
      isTeacherAvatarReady: false,
      isBroadcast: false,
      default_card: this.convertImageHost(
        "http://wyeth-uploadsites.nibaguai.com/weex/images/share/invitation_card_0919.png"
      ),
      default_avatar: this.convertImageHost(
        "http://wyeth-uploadsites.nibaguai.com/weex/images/default/avatar.png"
      ),
      isSetBg: false,
      iconList: [
        require("assets/invitation_icon_1.png"),
        require("assets/invitation_icon_2.png"),
        require("assets/invitation_icon_3.png"),
        require("assets/invitation_icon_4.png"),
        require("assets/invitation_icon_5.png"),
        require("assets/invitation_icon_6.png"),
        require("assets/invitation_icon_7.png")
      ],
      images: [
        "http://wyeth-uploadsites.nibaguai.com/weex/images/share/invitation_theme_01.png",
        "http://wyeth-uploadsites.nibaguai.com/weex/images/share/invitation_theme_02.png",
        "http://wyeth-uploadsites.nibaguai.com/weex/images/share/invitation_theme_03.png",
        "http://wyeth-uploadsites.nibaguai.com/weex/images/share/invitation_theme_04.png",
        "http://wyeth-uploadsites.nibaguai.com/weex/images/share/invitation_theme_05.png",
        "http://wyeth-uploadsites.nibaguai.com/weex/images/share/invitation_theme_06.png",
        "http://wyeth-uploadsites.nibaguai.com/weex/images/share/invitation_theme_07.png"
      ],
      chosenTheme: {
        nickname: "black",
        shareContentDesc: "#666666",
        classTitle: "#333333",
        teacherName: "#333333",
        teacherHospital: "#999999",
        teacherPosition: "#999999",
        startDay: "#ff3600",
        guide: "#054d73"
      },
      fontColor: [
        {
          nickname: "black",
          shareContentDesc: "#666666",
          classTitle: "#333333",
          teacherName: "#333333",
          teacherHospital: "#999999",
          teacherPosition: "#999999",
          startDay: "#ff3600",
          guide: "#054d73"
        },
        {
          nickname: "black",
          shareContentDesc: "#666666",
          classTitle: "#333333",
          teacherName: "#333333",
          teacherHospital: "#999999",
          teacherPosition: "#999999",
          startDay: "#ff3600",
          guide: "#054d73"
        },
        {
          nickname: "black",
          shareContentDesc: "#666666",
          classTitle: "#333333",
          teacherName: "#333333",
          teacherHospital: "#999999",
          teacherPosition: "#999999",
          startDay: "#ff3600",
          guide: "#054d73"
        },
        {
          nickname: "black",
          shareContentDesc: "#666666",
          classTitle: "#333333",
          teacherName: "#333333",
          teacherHospital: "#999999",
          teacherPosition: "#999999",
          startDay: "#ff3600",
          guide: "#054d73"
        },
        {
          nickname: "white",
          shareContentDesc: "#ffffff",
          classTitle: "#ffffff",
          teacherName: "#ffffff",
          teacherHospital: "#ffffff",
          teacherPosition: "#ffffff",
          startDay: "#ffffff",
          guide: "#ffffff"
        },
        {
          nickname: "#F5D29C",
          shareContentDesc: "#F5D29C",
          classTitle: "#F5D29C",
          teacherName: "#F5D29C",
          teacherHospital: "#F5D29C",
          teacherPosition: "#F5D29C",
          startDay: "#F5D29C",
          guide: "#F5D29C"
        },
        {
          nickname: "#ffffff",
          shareContentDesc: "#2CEFFB",
          classTitle: "#ffffff",
          teacherName: "#ffffff",
          teacherHospital: "#ffffff",
          teacherPosition: "#ffffff",
          startDay: "#ffffff",
          guide: "#ffffff"
        }
      ],
      chosenIndex: 0
    };
  },
  created() {
    // 分享设置
    CIData.push([
      "trackEvent",
      "wyeth",
      "course_invitation",
      "cid",
      this.classInfo.id
    ]);
  },
  mounted() {
    const el = this.$refs.gallery[0];
    console.log("ttt", el, el.$el.className);
    el.$el.className = "weex-div weex-ct invitation-gallery-item-shadow";
    this.chosenTheme = this.fontColor[0];
  },
  watch: {
    isAvatarReady(val) {
      if (
        val &&
        this.isQrcodeReady &&
        this.isTeacherAvatarReady &&
        this.isBroadcast
      ) {
        this.convertShareImage();
      }
    },
    isQrcodeReady(val) {
      if (
        val &&
        this.isAvatarReady &&
        this.isTeacherAvatarReady &&
        this.isBroadcast
      ) {
        this.convertShareImage();
      }
    },
    isTeacherAvatarReady(val) {
      if (val && this.isAvatarReady && this.isQrcodeReady && this.isBroadcast) {
        this.convertShareImage();
      }
    },
    isBroadcast(val) {
      if (
        val &&
        this.isAvatarReady &&
        this.isQrcodeReady &&
        this.isTeacherAvatarReady
      ) {
        this.convertShareImage();
      }
    }
  },
  methods: {
    depend() {
      return ["getAd.9." + this.$route.params.classInfo.brand];
    },
    resolve() {
      let date = new Date();
      console.log(
        "resolve" + (date.getSeconds() * 1000 + date.getMilliseconds())
      );

      let data = this.store("getAd.9." + this.$route.params.classInfo.brand)
        .data;

      this.broadcast = data;

      this.getShareLink();

      console.log("broadcast:", this.broadcast);
    },
    createCard() {
      let imageAfter = document.getElementById("imageAfter");
      if (imageAfter) {
        this.$refs.invitationCard.$el.removeChild(imageAfter);
      }

      this.showCanvas = true;

      this.isAvatarReady = false;
      this.isQrcodeReady = false;
      this.isTeacherAvatarReady = false;
      this.isBroadcast = false;

      this.classInfo.titleArray = this.substrToArray(
        this.classInfo.title || this.classInfo.name,
        11
      );
      let avatar = this.convertImageHost(this.userInfo.avatar);
      let avatarTeacher = this.convertImageHost(
        this.teacherInfo.teacher_avatar
      );

      let broadcast;
      if (
        this.broadcast &&
        this.broadcast.length > 0 &&
        this.broadcast[0].img
      ) {
        broadcast = this.convertImageHost(this.broadcast[0].img);
      }

      let teacherHospitalLength = this.teacherInfo.teacher_hospital.length;
      let teacherPositionLength = this.teacherInfo.teacher_position.length;

      let textLength =
        teacherHospitalLength > teacherPositionLength
          ? teacherHospitalLength
          : teacherPositionLength;
      textLength = textLength > 14 ? 14 : textLength;

      let canvas = document.getElementById("myCanvas");
      if (!this.isSetBg) {
        canvas.width = canvas.width * this.resolution;
        canvas.height = canvas.height * this.resolution;
      }

      let ctx = canvas.getContext("2d");

      let w = this.canvas_width;
      let h = this.canvas_height;
      let avatarW = this.rpx(101);
      let qrcodeW = this.rpx(176) * 0.8;

      let broadcast_w = this.rpx(554);
      let broadcast_h = this.rpx(83);

      let self = this;
      this.drawImage(
        ctx,
        this.default_card,
        this.default_card,
        0,
        0,
        w,
        h,
        function() {
          self.drawImage(
            ctx,
            avatar,
            self.default_avatar,
            w / 2 - avatarW / 2,
            h * 0.12,
            avatarW,
            avatarW,
            function() {
              self.isAvatarReady = true;
            }
          );

          self.drawText(
            ctx,
            self.userInfo.nickname,
            w / 2,
            h * 0.121 + avatarW,
            { font: self.rpx(26), fillStyle: self.chosenTheme.nickname }
          );

          self.drawText(
            ctx,
            self.shareContent.desc,
            w / 2,
            h * 0.121 + avatarW + self.rpx(26 + 15),
            {
              font: self.rpx(18),
              fillStyle: self.chosenTheme.shareContentDesc
            }
          );

          self.drawText(ctx, self.classInfo.titleArray[0], w / 2, h * 0.35, {
            font: self.rpx(32),
            fillStyle: self.chosenTheme.classTitle
          });

          if (self.classInfo.titleArray.length > 1) {
            if (self.classInfo.titleArray.length > 2) {
              self.classInfo.titleArray[1] =
                self.classInfo.titleArray[1] + "...";
            }
            self.drawText(
              ctx,
              self.classInfo.titleArray[1],
              w / 2,
              h * 0.35 + self.rpx(36 + 5),
              {
                font: self.rpx(32),
                fillStyle: self.chosenTheme.classTitle
              }
            );
          }

          if (self.teacherInfo) {
            let x =
              (w - avatarW - self.rpx(20 + textLength * 20)) / 2 + self.rpx(7);

            self.drawImage(
              ctx,
              avatarTeacher,
              self.default_avatar,
              x,
              h * 0.45,
              avatarW,
              avatarW,
              function() {
                self.isTeacherAvatarReady = true;
              }
            );

            self.drawText(
              ctx,
              self.subStringWithDot(self.teacherInfo.teacher_name, 10),
              x + avatarW + 20,
              h * 0.45,
              {
                textAlign: "left",
                font: self.rpx(26),
                fillStyle: self.chosenTheme.teacherName
              }
            );
            self.drawText(
              ctx,
              self.subStringWithDot(self.teacherInfo.teacher_hospital, 13),
              x + avatarW + 20,
              h * 0.45 + self.rpx(28 + 15),
              {
                textAlign: "left",
                font: self.rpx(18),
                fillStyle: self.chosenTheme.teacherHospital
              }
            );
            self.drawText(
              ctx,
              self.subStringWithDot(self.teacherInfo.teacher_position, 13),
              x + avatarW + 20,
              h * 0.45 + self.rpx(28 + 15) + self.rpx(20 + 15),
              {
                textAlign: "left",
                font: self.rpx(18),
                fillStyle: self.chosenTheme.teacherPosition
              }
            );
          } else {
            self.isTeacherAvatarReady = true;
          }

          if (
            self.classInfo.status === 1 &&
            (self.classInfo.start_day || self.classInfo.start_time)
          ) {
            self.drawText(
              ctx,
              self.classInfo.start_day + " " + self.classInfo.start_time,
              w / 2,
              h * 0.56,
              { font: self.rpx(20), fillStyle: "#ff3600" }
            );
          }

          // self.drawText(ctx, self.shareContent.channel, w / 2, h * 0.6 + 1.5, { font: self.rpx(32), fillStyle: '#00075d' })

          self.drawText(
            ctx,
            self.shareContent.guide,
            w / 2,
            h * 0.65 + qrcodeW + 10,
            { font: self.rpx(18), fillStyle: self.chosenTheme.guide }
          );

          self.drawImage(
            ctx,
            $(".invitationCard-content-qrcode")
              .children()[0]
              .toDataURL(1),
            null,
            w / 2 - qrcodeW / 2,
            h * 0.65,
            qrcodeW,
            qrcodeW,
            function() {
              self.isQrcodeReady = true;
            }
          );

          if (broadcast && broadcast.length > 0) {
            self.drawImage(
              ctx,
              broadcast,
              null,
              0,
              h - broadcast_h,
              broadcast_w,
              broadcast_h,
              function() {
                self.isBroadcast = true;
              }
            );
          } else {
            self.isBroadcast = true;
          }
        }
      );
    },
    drawImage(ctx, src, defaultSrc, x, y, width, height, callback) {
      let resolution = this.resolution;
      let image = new Image();
      // image.crossOrigin = "anonymous"

      image.onload = function() {
        ctx.drawImage(
          image,
          x * resolution,
          y * resolution,
          width * resolution,
          height * resolution
        );
        if (callback) {
          callback();
        }
      };
      image.onerror = function() {
        if (defaultSrc && defaultSrc.length > 0) {
          image.src = defaultSrc;
          defaultSrc = "";
        }
      };
      image.src = src;
    },
    drawText(ctx, text, x, y, params) {
      let resolution = this.resolution;
      ctx.textAlign = params.textAlign || "center";
      ctx.font =
        params.font * resolution + "px Courier New" || "22px Courier New";
      ctx.fillStyle = params.fillStyle || "#000000";
      ctx.textBaseline = params.textBaseline || "top";

      ctx.fillText(text, x * this.resolution, y * this.resolution);
    },
    convertShareImage() {
      let canvas = document.getElementById("myCanvas");

      let imageAfter = document.createElement("img");

      imageAfter.id = "imageAfter";
      imageAfter.style.width = canvas.width;
      imageAfter.style.height = canvas.height;

      var imageData = canvas.toDataURL(1);
      imageAfter.src = imageData;
      imageAfter.style.width = this.rpx(554, true);
      imageAfter.style.height = this.rpx(966, true);
      imageAfter.style.alignSelf = "center";

      this.showCanvas = false;

      this.$refs.invitationCard.$el.appendChild(imageAfter);
    },
    substrToArray(text, maxLength) {
      if (!text || text.length === 0) {
        return [];
      }
      let array = [];
      if (text.length > maxLength) {
        let wordReg = new RegExp("[a-z]+[-']?[a-z]*|[^*]", "g");
        let wordArray = text.match(wordReg);

        let textTmp = "";
        for (let i = 0; i < wordArray.length; i++) {
          if (wordArray[i].length > 0) {
            if (textTmp.length >= maxLength) {
              array.push(textTmp);
              textTmp = wordArray[i];
            } else {
              textTmp = textTmp + wordArray[i];
            }
          }
        }
        if (textTmp.length > 0) {
          if (textTmp.length < 2) {
            array[array.length - 1] = array[array.length - 1] + textTmp;
          } else {
            array.push(textTmp);
          }
        }
      } else {
        array.push(text);
      }
      return array;
    },
    subStringWithDot(str, maxLength, start, noDot) {
      let _start = start || 0;
      if (str.length > maxLength) {
        if (noDot) {
          str.substring(_start, maxLength);
        } else {
          return str.substring(_start, maxLength - 1) + "...";
        }
      } else {
        return str;
      }
    },
    getShareLink() {
      this.shareContent.link =
        window.location.origin +
        "/mobile/index?defaultPath=/course/" +
        this.classInfo.id +
        "&from_openid=" +
        this.userInfo.openid +
        "&from=invitation";

      let title = this.classInfo.title ? this.classInfo.title : "魔栗妈咪学院";
      let desc = this.classInfo.course_desc ? this.classInfo.course_desc : "";
      let img = this.classInfo.img ? this.classInfo.img : "";
      let link = this.shareContent.link;

      console.log("设置分享参数：", this.shareContent.link);

      var self = this;
      WxShare.share(
        title,
        desc,
        img,
        link,
        function() {
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

      network.getShortLink(link, function(ret) {
        if (ret.ret == 1) {
          let qrcodeW = self.rpx(176) * 0.8;

          $(".invitationCard-content-qrcode").html("");
          jQuery(".invitationCard-content-qrcode").qrcode({
            width: qrcodeW,
            height: qrcodeW,
            correctLevel: 0,
            text: ret.data
          });
        }
        self.createCard();
      });
    },
    convertImageHost(url) {
      let originReal = window.location.origin;

      let hostReg = new RegExp("^http(s)?://(.*?)/");

      let origin, host;
      let tmp = hostReg.exec(url);
      if (tmp && tmp.length > 1) {
        origin = hostReg.exec(url)[0];
        host = hostReg.exec(url)[2];
      }

      if (host === "wx.qlogo.cn") {
        url = url.replace(origin, originReal + "/wxqlogo/");
      } else if (host === "thirdwx.qlogo.cn") {
        url = url.replace(origin, originReal + "/thirdwx/");
      } else {
        if (url.indexOf("https") > -1) {
          url = url.replace(origin, originReal + "/proxy_https_" + host + "/");
        } else {
          url = url.replace(origin, originReal + "/proxy_http_" + host + "/");
        }
      }

      // if (host === "wx.qlogo.cn" || host === "thirdwx.qlogo.cn") {
      //   url = url.replace(host, originReal + "/wxqlogo");
      // } else if (host === "wyeth-uploadsites.nibaguai.com") {
      //   url = url.replace(host, originReal + "/qiniu");
      // } else {
      //   url = url.replace(host, originReal + "/qiniu");
      // }

      console.log("转换后：", url);

      return url;
    },
    chooseItem(index) {
      console.log(index);
      this.chosenTheme = this.fontColor[index];
      if (index >= 2) {
        dom.scrollToElement(this.$refs.galleryItem[index - 2]);
      } else {
        dom.scrollToElement(this.$refs.galleryItem[0]);
      }

      this.default_card = this.convertImageHost(this.images[index]);
      this.chosenIndex = index;
      this.isSetBg = true;
      var c = document.getElementById("myCanvas");
      var cxt = c.getContext("2d");
      cxt.clearRect(0, 0, c.width, c.height);
      this.createCard();
    }
  }
};
</script>

<style scoped>
#myCanvas {
  /* width: 650px;
      height: 800px; */
  background-color: #ffffff;
  align-self: center;
}

#invitation {
  position: fixed;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 10px;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #353535;
}

#invitation .invitation-card {
  width: 554px;
  height: 966px;
  align-self: center;
  /*justify-content: space-between;*/
}

#invitation .invitation-bottom {
  /*position: relative;*/
  width: 750px;
  height: 196px;
  /* bottom:0px; */
  background-color: #ffffff;
}

#invitation .invitation-bottom-text {
  color: #666666;
  font-size: 26px;
  width: 750px;
  margin-top: 16px;
  margin-bottom: 20px;
  text-align: center;
}

#invitation .invitation-gallery {
  background-color: white;
  height: 108px;
}

#invitation .invitation-gallery-item {
  width: 108px;
  height: 108px;
  margin: 0 15px 22px 15px;
  border-radius: 12px;
  position: relative;
}

#invitation .invitation-gallery-img {
  width: 108px;
  height: 108px;
  border-radius: 12px;
}

#invitation .invitation-gallery-item-shadow {
  position: absolute;
  top: 0;
  width: 108px;
  height: 108px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

#invitation .hide {
  display: none;
}

#invitation .invitation-gallery-item-chosen {
  width: 46px;
  height: 46px;
  opacity: 1;
}
</style>
