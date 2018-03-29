/**
 * Created by zhangyi on 2017/5/10.
 * Desc:
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    'course': {},
    'getCourse': {}
  },
  mutations: {
    set (state, keysVal) {
      let tmp = state
      let keysTemp = keysVal.keys.split('.')

      let keys = []
      if (keysTemp.length > 2) {
        for (let i = 0; i < keysTemp.length; i++) {
          if (i > 1) {
            keys[1] = keys[1] + '.' + keysTemp[i]
          } else {
            keys[i] = keysTemp[i]
          }
        }
      } else {
        keys = keysTemp
      }

      keys.map((key, idx) => {
        if (idx === keys.length - 1 || idx === 1) {
          tmp[key] = keysVal.val
        } else {
          tmp[key] = {}
          tmp = tmp[key]
        }
      })
    }
  }
})

export default store
