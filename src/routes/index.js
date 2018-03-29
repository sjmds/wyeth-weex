// 依赖模块
import VueRouter from 'vue-router'
import event from '../modules/event'
import CIData from '../modules/CIData'
import { fetchAll } from '../modules/network'
import { WxShare } from '../modules/WxSDK'
import config from '../config.json'

// 一级页面
import index from '../views/index.vue'
import login from '../views/login.vue'
import all from '../views/all.vue'
import follow from '../views/follow.vue'
import discover from '../views/discover.vue'
import me from '../views/me.vue'
import courseSeries from '../views/course/courseSeries.vue'
import Live from '../views/live/live.vue'


import course from '../views/course/course.vue'
import exchange from '../views/other/exchange.vue'
import recharge from '../views/other/recharge.vue'
// import activity1 from '../views/activity/activity1.vue'


// const all = resolve => require(['../views/all.vue'], resolve)
// const discover = resolve => require(['../views/discover.vue'], resolve)
// const me = resolve => require(['../views/me.vue'], resolve)
// const courseAudio = resolve => require(['../views/course/courseAudio.vue'], resolve)
// const courseVideo = resolve => require(['../views/course/courseVideo.vue'], resolve)
// const courseNew = resolve => require(['../views/course/courseNew.vue'], resolve)
// const course = resolve => resolve(require('../views/course/course.vue'), resolve)

// const courseSeries = resolve => resolve(require('../views/course/courseSeries.vue'), resolve)
const cmsPageInfo = resolve => resolve(require('../views/cmsPageInfo.vue'), resolve)
// const recharge = resolve => resolve(require('../views/other/recharge.vue'), resolve)


const dynamic = resolve => require.ensure([], () => resolve(require('../views/me/dynamic.vue')), 'group-async')
const MQDetail = resolve => require.ensure([], () => resolve(require('../views/me/MQDetail.vue')), 'group-async')
const MQRule = resolve => require.ensure([], () => resolve(require('../views/me/MQRule.vue')), 'group-async')
const history = resolve => require.ensure([], () => resolve(require('../views/me/history.vue')), 'group-async')
const myHistory = resolve => require.ensure([], () => resolve(require('../views/me/myHistory.vue')), 'group-async')
const myDynamic = resolve => require.ensure([], () => resolve(require('../views/me/myDynamic.vue')), 'group-async')
const myFollow = resolve => require.ensure([], () => resolve(require('../views/me/myFollow.vue')), 'group-async')
const listView = resolve => require.ensure([], () => resolve(require('../views/listView.vue')), 'group-async')
const invitation = resolve => require.ensure([], () => resolve(require('../views/other/invitation.vue')), 'group-async')
const search = resolve => require.ensure([], () => resolve(require('../views/search/search.vue')), 'group-async')
const shareResult = resolve => require.ensure([], () => resolve(require('../views/other/shareResult.vue')), 'group-async')
const orderPay = resolve => require.ensure([], () => resolve(require('../views/other/orderPay.vue')), 'group-async')

const questionList = resolve => require.ensure([], () => resolve(require('../views/search/questionList.vue')), 'group-async')
const courseList = resolve => require.ensure([], () => resolve(require('../views/search/courseList.vue')), 'group-async')

const questionDetail = resolve => require.ensure([], () => resolve(require('../views/search/questionDetail.vue')), 'group-async')

const paidCourse = resolve => require.ensure([], () => resolve(require('../views/paidCourse.vue')), 'group-async')
const activity = resolve => require.ensure([], () => resolve(require('../views/activity/activity.vue')), 'group-async')
const activity1 = resolve => require.ensure([], () => resolve(require('../views/activity/activity1.vue')), 'group-async')


Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/home'
  },
  {
    path: '/',
    redirect: (window.requestParams && window.requestParams.forcejump && window.requestParams.defaultPath) ? window.requestParams.defaultPath : '/home'
  },
  {
    name: 'home',
    path: '/home',
    component: index
  },
  {
    name: 'all',
    path: '/all',
    component: all,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'discover',
    path: '/discover',
    component: discover,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'discover',
    path: '/discover',
    component: discover,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'me',
    path: '/me',
    component: me
  },
  {
    name: 'login',
    path: '/login',
    component: login
  },
  {
    name: 'course',
    path: '/course/:id',
    component: course,
    meta: {
      graySkin: true // 显示灰皮
    },
    alias: ['/courseAudio/:id', '/courseVideo/:id', '/courseNew/:id']
  },
  {
    name: 'courseSeries',
    path: '/courseSeries/:id',
    component: courseSeries,
  },
  {
    name: 'dynamic',
    path: '/dynamic',
    component: dynamic,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'MQDetail',
    path: '/MQDetail',
    component: MQDetail
  },
  {
    name: 'MQRule',
    path: '/MQRule',
    component: MQRule
  },
  {
    name: 'history',
    path: '/history',
    component: history,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'myFollow',
    path: '/myFollow',
    component: myFollow
  },
  {
    name: 'recharge',
    path: '/recharge/:id',
    component: recharge
  },
  {
    name: 'follow',
    path: '/follow',
    component: follow
  },
  {
    name: 'index',
    path: '/index',
    component: index
  },
  {
    name: 'invitation',
    path: '/invitation',
    component: invitation
  },
  {
    name: 'search',
    path: '/search',
    component: search,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'shareResult',
    path: '/shareResult',
    component: shareResult
  },
  {
    name: 'listView',
    path: '/listView',
    component: listView
  },
  {
    name: 'myDynamic',
    path: '/myDynamic',
    component: myDynamic,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'myHistory',
    path: '/myHistory',
    component: myHistory,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'cmsPageInfo',
    path: '/cmsPageInfo/:id',
    component: cmsPageInfo,
    meta: {
      graySkin: true // 显示灰皮
    }
  },
  {
    name: 'orderPay',
    path: '/orderPay/:trade_id/:from_recharge',
    component: orderPay
  },
  {
    name: 'questionList',
    path: '/questionList',
    component: questionList,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'courseList',
    path: '/courseList',
    component: courseList,
    meta: {
      keepAlive: true // 需要被缓存
    }
  },
  {
    name: 'questionDetail',
    path: '/questionDetail/:id',
    component: questionDetail
  },
  {
    name: 'paidCourse',
    path: '/paidCourse',
    component: paidCourse
  },
  {
    name: 'exchange',
    path: '/exchange',
    component: exchange
  },
  {
    name: 'activity',
    path: '/activity',
    component: activity
  },
  {
    name: 'live',
    path: '/live',
    component: Live
  },
  {
    name: 'activity1',
    path: '/activity1',
    component: activity1
  }
]

let router = new VueRouter({
  routes: routes
})

function _getMatchedComponents(name) {
  return routes.reduce(function (components, route) {
    route.name === name && components.push(route.component)
    return components
  }, [])
}

function _tryFetch(component, route) {
  if (component.preload && typeof component.preload === 'function') {
    let date = new Date()
    console.log('fetchAll in route' + (date.getSeconds() * 1000 + date.getMilliseconds()))

    fetchAll(component.preload(route)).then(() => { }).catch(function (e) {
      console.error(e)
    })
  }
}

router.beforeEach((to, from, next) => {
  console.log('beforeEach: ', to, from)

  let staticDom = document.querySelector('#static')
  if (staticDom) {
    staticDom.style.display = 'none'
  }

  if (window._hmt && window.stashPath && window.stashPath.length > 0) {
    let stashPath = window.stashPath
    window.stashPath = ''
    next({ path: stashPath, params: { to: to } })
  }

  if (to.meta.graySkin) {
    event.sendEvent('graySkin', { show: true })
  } else {
    event.sendEvent('graySkin', { show: false })
  }

  if (from.name === 'course' || from.name === 'courseSeries' || from.name === 'invitation' || from.name === 'cmsPageInfo') {
    if (to.name !== 'course' && to.name !== 'courseSeries' && to.name !== 'invitation' && to.name !== 'cmsPageInfo') {
      let title = '魔栗妈咪学院'
      let desc = '最权威专家为您答疑解惑，学育儿知识还能赚取积分MQ，兑换惠员好礼哦！当妈妈不仅要有EQ、IQ，还要有MQ哦！~~~'
      let img = window.location.protocol + '//wyeth-course.nibaguai.com/wyeth/image/logo.png'
      let link = window.wyeth_host + '/mobile/index?'
      WxShare.share(title, desc, img, link, function () {
        console.log('分享成功')
      }, function () {
        console.log('分享失败')
      })
    }
  }

  const components = _getMatchedComponents(to.name)

  if (components.length === 0) {
    next()
  } else {
    _tryFetch(components[0], to)
    next()
  }
})

router.afterEach((to, from) => {
  console.log('afterEach: ', to, from)

  CIData.push(['actionTimeEnd', 'visit'])

  if (!window._hmt && ((window.requestParams.defaultPath && router.currentRoute.path === window.requestParams.defaultPath) || (!window.requestParams.defaultPath || window.requestParams.defaultPath.length === 0))) {
    if (navigator.userAgent.indexOf('JianKongBao') === -1 && window.location.host.indexOf('mama-weiketang') >= 0) {
      console.log('开始统计 引入 hmt:', window.location.href, window.requestParams.defaultPath,router.currentRoute.path)

      window._hmt = _hmt || []
      let _hmt = window._hmt
      _hmt.push(['_setAutoPageview', false])

      let urlPath = window.location.pathname + window.location.search + '#' + router.currentRoute.path

      _hmt.push(['_trackPageview', urlPath])

      CIData.push(['actionTimeStart', 'visit', { url: urlPath, wyeth_channel: window.wyeth_channel }])

      if (!window.isTest) {
        (function () {
          let hm = document.createElement('script')
          hm.src = '//hm.baidu.com/hm.js?48d0daf26b11c052fb2a98dcb072f1bc'
          let s = document.getElementsByTagName('script')[0]
          s.parentNode.insertBefore(hm, s)
        })()
      }
    }
  } else {
    if (window._hmt && from.name !== 'follow') {
      let urlPath = window.location.pathname + '#' + router.currentRoute.path
      _hmt.push(['_trackPageview', urlPath])
      CIData.push(['actionTimeStart', 'visit', { url: urlPath }])
    }
  }

  // 原beforeEach
  if (from.path === window.requestParams.defaultPath) {
    window.requestParams.defaultPath = ''
    window.requestParams.wyeth_channel = ''
  }

  if (from.name === 'course') {
    CIData.push(['actionTimeEnd', 'end'])
  }


  if (to.name === 'home') {
    CIData.push(['trackEvent', 'page', 'page_index'])
  } else if (to.name === 'course') {

    let wyethChannelTmp = ''
    if (to.path === window.requestParams.defaultPath && window.requestParams && window.requestParams.wyeth_channel) {
      wyethChannelTmp = window.requestParams.wyeth_channel

      console.log('使用 channel：',wyethChannelTmp)
    }

    if (to.name === 'course') {
      CIData.push(['trackEvent', 'page', 'page_end'])

      CIData.push(['actionTimeStart', 'end', { cid: to.params.id, wyeth_channel: wyethChannelTmp }])
      CIData.push(['trackEvent', 'wyeth', 'class', wyethChannelTmp, to.params.id])
    }

    CIData.push(['trackEvent', window.requestParams.v, 'course_template', wyethChannelTmp, to.params.id])
    window.requestParams.v = ''
  }
})

export default router
