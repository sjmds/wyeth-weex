<template>
  <div style="position: static">

    <keep-alive>
      <router-view v-if="keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!keepAlive"></router-view>

    <!-- 灰皮 -->
    <div v-if="showGraySkin && graySkinUrl.length > 0" class="graySkin" :style="{backgroundImage:'url(' + graySkinUrl + ')'}"></div>

    <div id="tabbar_app" class="tabbar_app" v-if="isTabbar">

      <div class="bottom-shadow" style="background-image:linear-gradient(to top,RGBA(0,0,0,0.08),RGBA(255,255,255,0));"></div>
      <template v-if="tab_flag">
        <OTabbar :value="$route.name" router :tabbarItems="tabItems" imageType="image" :defaultColor="defaultColor" :activedColor="activedColor" @selectBar="selectBar">
        </OTabbar>
        <AudioHome></AudioHome>
      </template>
      <WyethTabbar v-if="!tab_flag"></WyethTabbar>
    </div>
    <!-- <OHSQiandao v-if="show_qiandao" @onClick="onQiandaoClick" @clickRule="clickRule"></OHSQiandao> -->
    <CommonAlert v-if="show_commonAlert" @onDoneClick="onDoneClick" :content="crm_tip"></CommonAlert>
    <OHSToast></OHSToast>
    <FlashView v-if="show_flase" @closeFlash="closeFlash"></FlashView>
  </div>
</template>

<script>
import Base from './mixins/base'

import event from './modules/event'
import CIData from './modules/CIData'
import { gotoRegister } from './modules/login'

import OHSToast from './components/toast'
import { OTabbar, OTabbarItem } from './components/tabbar'
import { WyethTabbar, AudioHome, FlashView } from './components-proj/app'
import { CommonAlert } from './components-proj/other'
import OHSQiandao from './components-proj/home/qiandao'

export default {
  mixins: [Base],
  components: {
    OTabbar: OTabbar.weexComponent,
    OTabbarItem: OTabbarItem.weexComponent,
    AudioHome: AudioHome.weexComponent,
    WyethTabbar: WyethTabbar.weexComponent,
    OHSQiandao: OHSQiandao.weexComponent,
    OHSToast: OHSToast.weexComponent,
    CommonAlert: CommonAlert.weexComponent,
    FlashView: FlashView.weexComponent
  },
  data() {
    return {
      defaultColor: '#666666',
      activedColor: '#cd9e29',
      tabItems: [
        {
          index: 'home',
          label: '首页',
          titleColor: '#000000',
          nUrl: require('assets/home2.png'),
          aUrl: require('assets/home.png')
        },
        {
          index: 'all',
          label: '全部',
          titleColor: '#000000',
          nUrl: require('assets/all2.png'),
          aUrl: require('assets/all.png')
        },
        {},
        {
          index: 'discover',
          label: '魔栗365',
          titleColor: '#000000',
          nUrl: require('assets/moli2.png'),
          aUrl: require('assets/moli.png')
        },
        {
          index: 'me',
          label: '我的',
          titleColor: '#000000',
          nUrl: require('assets/mine2.png'),
          aUrl: require('assets/mine.png')
        }
      ],
      show_qiandao: false,
      show_flase: false,
      show_commonAlert: false,
      graySkinUrl: require('assets/default_grayskin.png'),
      showGraySkin: false,
      crm_tip: "请先完成注册！",
    }
  },
  created() {
    console.log('xxxxxxxxx App created')

    var self = this
    event.addEventListener('signup', function(hidden) {
      self.show_flase = true
    })

    event.addEventListener('registerAlert', function() {
      self.crm_tip = window.app_config.crm_tip

      self.show_commonAlert = true
    })

    event.addEventListener('graySkin', function(e) {
      if (e.show) {
        self.showGraySkin = true
      } else {
        self.showGraySkin = false
      }
    })
  },
  computed: {
    tab_flag() {
      return window.develop !== 1
    },
    isTabbar() {
      return (this.$route.name === 'home' || this.$route.name === 'all' || this.$route.name === 'discover' || this.$route.name === 'me')
    },
    keepAlive() {
      let k = this.$route.meta.keepAlive
      return k
    }
  },
  watch: {
    $route() {
      this.showGraySkin = false
    }
  },
  mounted() {
    console.log('!!!!!!!!! App mounted')
  },
  methods: {
    closeFlash: function() {
      this.show_flase = false
      this.show_qiandao = true

      let userInfo = this.store('userInfo')

      userInfo.is_sign = true

      this.store('userInfo', userInfo)
    },
    onQiandaoClick: function() {
      var self = this
      setTimeout(function() {
        console.log('onQiandaoClick')
        self.show_qiandao = false
      }, 400)
    },
    clickRule: function() {
      var self = this
      setTimeout(function() {
        console.log('onQiandaoClick')
        self.show_qiandao = false
        self.$router.push('/MQRule')
      }, 400)
    },
    onDoneClick() {
      console.log('点击确认')
      this.show_commonAlert = false
      gotoRegister()
    },
    selectBar: function(e) {
      console.log('selectBar', e)
      CIData.push(['trackEvent', 'wyeth', 'tabbar_click', this.$router.currentRoute.name, e])
    }
  }
}
</script>


<style>
body {
  margin: 0;
}

.container {
  background-color: white;
  height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

.tabbar_app {
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0px;
}

.bottom-shadow {
  height: 20px;
  position: fixed;
  bottom: 100px;
  left: 0px;
  right: 0px;
}

.graySkin {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
