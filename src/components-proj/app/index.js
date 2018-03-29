// 每个组件以这种形式对外暴露
import { register } from 'utils'

var components = {
    // 公用
  WyethTabbar: require('./wyethTabbar.vue'),
  AudioHome: require('./audioHome.vue'),
  FlashView: require('./flashView.vue'),
  FlashPic: require('./flashPic.vue')
}

Object.keys(components).map(function (key) {
  components[key] = register(components[key])
  return components
})

module.exports = components
