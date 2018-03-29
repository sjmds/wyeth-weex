import App from './App.vue'
import Vuei18n from 'vue-i18n'
import fastClick from 'fastclick'
import router from './routes'
import store from './data/store'
import { beforeLoad } from './modules/validate'
import Utils from './mixins/utils'
import ORouter from './plugin/ORouter'
import network from './modules/network/network'

require('./directive/animation')


!(function () {

  let events = window.navigator.userAgent

  if (events.indexOf('Android') > -1) {
    // 安卓
    console.log("Android");
    window.PLATFORM = 0;
  } else if (events.indexOf('iPhone') > -1) {
    // iPhone
    window.PLATFORM = 1;
    //根据尺寸进行判断 苹果的型号
    if (screen.height == 812 && screen.width == 375) {
      console.log("iPhoneX");
      window.PLATFORM = 2;
    } else if (screen.height == 736 && screen.width == 414) {
      console.log("iPhone7P - iPhone8P - iPhone6");
    } else if (screen.height == 667 && screen.width == 375) {
      console.log("iPhone7 - iPhone8 - iPhone6");
    } else if (screen.height == 568 && screen.width == 320) {
      console.log("iPhone5");
    } else {
      console.log("iPhone4");
    }
  }else if (events.indexOf('Windows Phone') > -1) {
    console.log("诺基亚手机");
  } else if (events.indexOf("iPad") > -1) {
    console.log("平板");
  }
}());





var cidata = require('cidata-sdk');

// fastClick
fastClick.attach(document.body)

Vue.mixin(Utils)
Vue.use(ORouter)


window.onerror = function (msg, url, lineNo, columnNo, error) {
  let params = {
    url: url,
    msg: msg,
    ua: navigator.userAgent,
    stack: error.stack
  }
  if (!process.env.DEBUG) {
    network.sendErrorLog(params)
  }
  return false
}

// 解决css重复导致的text换行问题
var head = document.querySelector('head')
var style = document.querySelector('#weex-cmp-text')
if (style) {
  head.removeChild(style)
  head.appendChild(style)
}

// 验证用户是否已登录，同时获取用户信息，初始化CIData
beforeLoad()


Vue.use(Vuei18n)
var i18n = new Vuei18n({
  locale: 'zh'
})

/* eslint-disable no-new  */
const vm = new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
})

window.vm = vm

window.requestParams = window.requestParams || {}

// 默认跳转路径
let defaultPath = '/'

if (!window.requestParams.forcejump) {
  vm.$router.replace(defaultPath)
  if (window.requestParams.defaultPath && window.requestParams.defaultPath.length > 0) {
    defaultPath = requestParams.defaultPath
    setTimeout(function () {
      if (vm.$router.currentRoute.name === 'home') {
        vm.$router.push(defaultPath)
      }
    }, 500)
  }
}

vm.$mount('#root')

let tabbar = document.querySelector('#tabbar2')
if (tabbar) {
  tabbar.style.display = 'none'
}

if (window.firstClick) {
  window.showLoading(false)
  setTimeout(function () {
    window.firstClick()
  }, 100)
}
