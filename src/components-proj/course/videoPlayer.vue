<template>
  <div id="videoPlayer">
    <video class="videoPlayer-video" controls :src='access?videoInfo.src:""' controls webkit-playsinline>
    </video>
    <div v-if="showPoster" class="videoPlayer-poster" @click="clickPoster">
      <image class="videoPlayer-poster-img" :src="classInfo.img"/>
      <div class="videoPlayer-poster-shade">
        <div class="videoPlayer-poster-play"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkRegister } from "../../modules/login";

import audioPlayer from "../../modules/audioPlayer";
import network from "../../modules/network/network";
import CIData from "../../modules/CIData";

import Progress from "../../components/progress";

export default {
  components: {
    Progress: Progress.weexComponent
  },
  props: {
    videoInfo: {
      type: Object,
      require: true
    },
    classInfo: {
      type: Object,
      require: true
    },
    access: {
      type: Boolean,
      require: false,
      default: true
    }
  },
  data() {
    return {
      isPlay: false,
      rate: 0,
      video: Object,
      duration: 0,
      stateImages: [require("assets/play.png"), require("assets/stop.png")],
      showPoster: true,
      handleId: null,
      from_time: 0,
      jumpHandleId: null
    };
  },
  created() {},
  mounted() {
    this.video = document.querySelector("video");

    var self = this;

    this.video.addEventListener(
      "loadeddata",
      function(e) {
        // console.log('yyy onloadeddata:', e)
        self.onload(e);
      },
      false
    );
    this.video.addEventListener(
      "loadedmetadata",
      function(e) {
        // console.log('yyy onloadedmetadata:', e)
        self.onload(e);
      },
      false
    );

    this.video.addEventListener(
      "canplay",
      function(e) {
        self.oncanplay(e);
      },
      false
    );

    this.video.addEventListener(
      "play",
      function(e) {
        self.onplay(e);
      },
      false
    );

    this.video.addEventListener(
      "pause",
      function(e) {
        self.onpause(e);
      },
      false
    );

    this.video.addEventListener(
      "ended",
      function(e) {
        self.onended(e);
      },
      false
    );
  },
  destroyed() {
    console.log("videoPlayer destroyed");
    this.clearCourseListen();
  },
  watch: {
    isPlay(val) {
      if (val) {
        audioPlayer.pause();
        this.setCourseListen(this.classInfo);
      } else {
        this.clearCourseListen();
      }

      this.$emit("stateChange", val);
    },
    classInfo(val) {
      this.clearCourseListen();
      this.showPoster = true;
    }
  },
  methods: {
    setCourseListen: function(classInfo) {
      this.clearCourseListen();
      this.handleId = setInterval(function() {
        network.courseListenAdd(classInfo.id, function(res) {});
      }, 60000);
    },
    clearCourseListen: function() {
      if (this.handleId) {
        clearInterval(this.handleId);
        this.handleId = null;
      }
    },
    clearPauseEvent: function() {
      if (this.jumpHandleId) {
        clearInterval(this.jumpHandleId);
        this.jumpHandleId = null;
      }
    },
    clickPoster: function() {
      if (checkRegister() || !this.access) {
        return;
      }

      this.showPoster = false;
      this.play();

      CIData.recActionTransact(this.classInfo);
    },
    onload: function(e) {
      console.log("onload");
    },
    start: function() {
      if (this.video.paused) {
        this.play();
      } else {
        this.pause();
      }
    },
    play: function() {
      this.video.play();
    },
    pause: function() {
      this.video.pause();
    },
    progressChange: function(rate) {
      this.rate = rate;

      let point = rate * this.video.duration;
      this.video.currentTime = point;
    },
    timeupdate: function(e) {
      window.e = e;
      this.rate = e.srcElement.currentTime / this.video.duration;

      var self = this;
      this.$emit("timeupdate", {
        point: self.video.currentTime,
        duration: self.video.duration,
        rate: self.video.currentTime / self.video.duration
      });
    },

    onplay(e) {
      console.log("onplay,", e);

      if (checkRegister()) {
        return;
      }

      this.isPlay = true;

      if (Math.abs(this.video.currentTime - this.from_time) > 2) {
        console.log("视频 跳转: " + this.video.currentTime + " " + this.from_time);
        CIData.push([
          "trackEvent",
          this.videoInfo.id,
          "video_jump",
          this.from_time,
          this.video.currentTime
        ]);

        this.from_time = this.video.currentTime;
      } else {
        CIData.push([
          "trackEvent",
          "wyeth",
          "video_play",
          this.videoInfo.id,
          this.video.currentTime
        ]);

        CIData.push([
          "actionTimeStart",
          "play",
          { cid: this.videoInfo.id, wyeth_channel: window.wyeth_channel }
        ]);
      }
    },
    onended(e) {
      this.isPlay = false;
    },
    onpause(e) {
      console.log("onpause", e);
      this.isPlay = false;

      let tmp = this.video.currentTime;

      this.clearPauseEvent();
      var self = this;
      this.jumpHandleId = setTimeout(function() {
        // 延时1s发送，若为进度条拖拽，会被canPlay取消掉
        CIData.push([
          "trackEvent",
          "wyeth",
          "video_pause",
          self.videoInfo.id,
          tmp
        ]);

        CIData.push(["actionTimeEnd", "play"]);
      }, 1000);

      this.from_time = this.video.currentTime;
    },
    oncanplay(e) {
      this.clearPauseEvent();
    },
    onfail(e) {
      console.log("onfail");
      this.isPlay = false;
    },
    clickVideo: function() {
      // this.showControls = !this.showControls
      // if (this.showControls) {
      //     var self = this
      //     setTimeout(function () {
      //         self.showControls = false
      //     }, 5000);
      // }
      // this.requestFullScreen()
    },
    stopEvent: function(e) {
      e.stopPropagation();
    },
    //进入全屏
    requestFullScreen() {
      var de = this.video;
      if (de.requestFullscreen) {
        de.requestFullscreen();
      } else if (de.mozRequestFullScreen) {
        de.mozRequestFullScreen();
      } else if (de.webkitRequestFullScreen) {
        de.webkitRequestFullScreen();
      }
    },
    //退出全屏
    exitFullscreen() {
      var de = this.video;
      if (de.exitFullscreen) {
        de.exitFullscreen();
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
      }
    }
  }
};
</script>

<style lang = "sass" scoped>
    @import './videoPlayer.scss'
</style>
