<template>
  <div class="miniPlayer-bg">
    <div class="miniPlayer-shadow"></div>
    <div id="miniPlayer">
      <!--封面-->
      <div class="miniPlayer-state-bg" @click="start">
        <image class="miniPlayer-state" :src="(isStart && audioPlayer.isPlay)? require('assets/stop.png'): require('assets/play.png')"/>
      </div>

      <!-- 进度条 -->
      <Progress class="miniPlayer-progress" :currentTime="currentTime" :duration="duration" :rate="rate" :progressWidth="500" :scheduleLeft="170" @progressChange="progressChange" @progressStart="progressStart" @progressEnd="progressEnd"></Progress>
      <text class="miniPlayer-songname" :lines="1">{{ (classlist.title || '无音频') }}</text>
    </div>
  </div>
</template>

<script>
import Base from "../../mixins/base";

import CIData from "../../modules/CIData";

import audioPlayer from "../../modules/audioPlayer";

import Progress from "../../components/progress";

export default {
  mixins: [Base],
  components: {
    Progress: Progress.weexComponent
  },
  props: {
    classlist: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      audioPlayer: audioPlayer,
      currentTime: 0,
      duration: this.classlist.audio_duration || 0,
      rate: 0,
      autoPlay: false,
      isStart: false,
      from_time: 0
    };
  },
  created() {
    console.log("!!!!!!!!! audioBottom created");

    var self = this;

    audioPlayer.$on("onload", function(e) {
      if (self.isStart) {
        self.duration = e.duration;
      }
    });

    audioPlayer.$on("timeupdate", function(e) {
      if (self.isStart) {
        self.currentTime = e.point;
        self.duration = e.duration;
        self.rate = e.rate;
        self.$emit("timeupdate", e);
      }
    });

    audioPlayer.$on("ended", function(e) {
      console.log("audioBottom ended", e);
      self.isStart = false;
    });

    this.checkSongEq(this.classlist)

  },
  computed: {},
  watch: {
    songSelected(section) {
      this.forcePlay(section.index);
    },
    classlist(val) {
      this.checkSongEq(val)
    }
  },
  methods: {
    checkSongEq: function (val) {
      console.log("是否是同一首歌：", audioPlayer.checkSongEq(val));
      this.isStart = audioPlayer.checkSongEq(val);
      if (
        this.isStart &&
        audioPlayer.songPlay.point &&
        audioPlayer.songPlay.audio_duration
      ) {
        this.currentTime = parseFloat(audioPlayer.songPlay.point);
        this.duration = audioPlayer.songPlay.audio_duration;
        this.rate = this.currentTime / this.duration;

        console.log("跳转：", this.rate);
      } else {
        this.rate = 0;
      }

      if (this.isStart) {
        CIData.recActionTransact(val);
      }
    },

    progressStart: function(rate) {
      this.from_time = 0;
      if (this.isStart) {
        this.from_time = audioPlayer.audio.currentTime;
      }
    },
    progressEnd: function(rate) {
      CIData.push([
        "trackEvent",
        audioPlayer.songPlay.id,
        "audio_jump",
        this.from_time,
        rate * this.duration
      ]);
    },
    progressChange: function(rate) {
      this.rate = rate;

      if (!this.isStart) {
        this.addToPlaylist();
      }

      let point = rate * this.duration;
      audioPlayer.jumpTo(point);
    },
    start: function() {
      if (this.isStart) {
        audioPlayer.start();
      } else {
        this.forcePlay();
      }
    },
    forcePlay: function(songIndex) {
      if (!this.isStart) {
        this.addToPlaylist();
      } else {
        audioPlayer.play();
      }
    },
    forceJump: function(point) {
      if (!this.isStart) {
        this.classlist.point = point;
        this.addToPlaylist();
      } else {
        audioPlayer.play();
        audioPlayer.forceJump(point);
      }
    },
    addToPlaylist: function() {
      audioPlayer.autoPlay = true;
      audioPlayer.addToPlaylist(this.classlist);

      this.isStart = true;

      CIData.recActionTransact(this.classlist);
    }
  }
};
</script>

<style lang = "sass" scoped>
  @import './audioBottom.scss'
</style>
