<template>
  <OHSFullPage class="flashView" v-if="ready" @click="closeFlash">
    <div class="flashView-content" >
      <div class="flashView-content-button" @click="closeFlash"></div>
      <image class="flashView-content-image"  @load="onImgLoad" @click="onclick" :src="flashData.img" :style="imgStyle"/>
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

export default {
  mixins: [Base],
  preload($route) {
    return ["getFlash"];
  },
  components: {
    OBlock: OBlock.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent
  },
  data() {
    return {
      flashData: {
        img: "",
        link: ""
      },
      ready: false,
      img_width: 590,
      img_height: 846
    };
  },
  computed: {
    imgStyle() {
      return {
        width: this.rpx(this.img_width, true),
        height: this.rpx(this.img_height, true)
      };
    }
  },
  methods: {
    depend() {
      return ["getFlash"];
    },
    resolve() {
      this.ready = true;
      let data = this.store("getFlash").data;
      if (
        data &&
        data.img &&
        data.img.length > 0 &&
        parseInt(data.displaystatus) === 1
      ) {
        this.flashData = data;
      } else {
        this.$emit("closeFlash");
        return;
      }

      var self = this;
      setTimeout(function() {
        self.$emit("closeFlash");
      }, 5000);
    },
    closeFlash() {
      this.$emit("closeFlash");
    },
    onImgLoad(event) {
      if (event.success) {
        console.log("onImgLoad,event=", event);
        if (event.size.naturalHeight && event.size.naturalWidth) {
          let scale = event.size.naturalHeight / event.size.naturalWidth;
          this.img_height = this.img_width * scale;
        }
      }
    },
    onclick() {
      linkJump(this.flashData.link);
      this.closeFlash();
    }
  }
};
</script>

<style lang = "sass" scoped>
  @import './flashView.scss';
</style>
