
<template>
  <OHSFullPage class="flashPic" v-if="isShow" @click="closeFlash">
    <div class="flashPic-content">
      <div class="flashPic-content-button" @click="closeFlash"></div>
      <image class="flashPic-content-image" @load="onImgLoad" :src="flashData.img" @click="clickFlash" :style="imgStyle"/>
    </div>
  </OHSFullPage>
</template>

<script>
import Base from "../../mixins/base";

import network from "../../modules/network/network";

import config from "../../config.json";

import { OHSFullPage } from "../../components-proj/comm/page";
import OBlock from "../../components/OBlock";

import event from "../../modules/event";
import CIData from "../../modules/CIData";
import { linkJump } from "../../modules/tools";

import store from "../../modules/store/index";

export default {
  mixins: [Base],
  components: {
    OBlock: OBlock.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent
  },
  props: {
    flashData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      isShow: false,
      img_width: 590,
      img_height: 846,
    }
  },
  computed: {
    imgStyle() {
      return {
        width: this.rpx(this.img_width, true),
        height: this.rpx(this.img_height, true)
      }
    }
  },
  watch: {
    flashData(val) {

      if (
        !this.flashData ||
        !this.flashData.img ||
        this.flashData.img.length === 0
      ) {
        return;
      }

      var self = this

      store.getItem("courseflash", function(res) {
        console.log("flashPic:", res);
        if (res.result === "failed" || !res.data) {
          self.showFlash();
        } else {
          let data = JSON.parse(res.data);
          if (
            data.month !== new Date().getMonth() ||
            data.day !== new Date().getDate()
          ) {
            self.showFlash();
          }
        }
      })
    }
  },
  methods: {
    showFlash() {
      let str = JSON.stringify({
        month: new Date().getMonth(),
        day: new Date().getDate()
      });

      store.setItem("courseflash", str, function(data) {
        console.log("保存闪屏记录,", data);
      });

      this.isShow = true;

      // var self = this;
      // setTimeout(function() {
      //   self.closeFlash();
      // }, 5000);
    },
    closeFlash() {
      this.isShow = false;
    },
    clickFlash() {
      linkJump(this.flashData.link)
      this.closeFlash()
    },
    onImgLoad(event) {
      if (event.success) {
        console.log('onImgLoad,event=', event)
        if (event.size.naturalHeight && event.size.naturalWidth) {
          let scale = event.size.naturalHeight/event.size.naturalWidth
          this.img_height = this.img_width * scale
        }
      }
    }
  }
};
</script>

<style lang = "sass" scoped>
  @import './flashPic.scss';
</style>
