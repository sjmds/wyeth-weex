
import { register } from 'utils'

var components = {

  OTabbar: require('./O-Tabbar.vue'),
  OTabbarItem: require('./O-TabbarItem.vue'),
  OWTabbar: require('./OW-Tabbar.vue'),
  OWTabbarItem: require('./OW-TabbarItem.vue')
}

Object.keys(components).map(function (key) {
  components[key] = register(components[key])
  return components
})

module.exports = components
