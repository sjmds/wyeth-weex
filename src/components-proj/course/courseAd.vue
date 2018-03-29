<template>
  <div id = "courseAd" @click = "clickAd">
    <image class = "courseAd-image" :src = "ad.src"/>
  </div>
</template>

<script>
import { linkJump } from "../../modules/tools";

export default {
  props: {
    ad: {
      type: Object,
      required: true
    }
  },
  methods: {
    clickAd: function() {
      linkJump(this.ad.url);
    }
  }
};
</script>

<style lang = "sass" scoped>
    @import './courseAd.scss'
</style>
