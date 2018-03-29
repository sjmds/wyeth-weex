import App from {{ ENTRY }}
import Vuei18n from 'vue-i18n'
Vue.use(Vuei18n)
const locale = weex.config.language || 'zh'
var i18n = new Vuei18n({
  locale
})
/* eslint-disable no-new */
new Vue({
  i18n,
  el: '#root',
  render: h => h(App)
})
