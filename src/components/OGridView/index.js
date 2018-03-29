
import { register } from 'utils'

var components = {

  OGridView: require('./o-gridview.vue')
}

Object.keys(components).map(function (key) {
  components[key] = register(components[key])
  return components
})

module.exports = components
