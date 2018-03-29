/**
 * Created by FJC on 2017/9/7.
 */
var qs = require('qs')
var MyPlugin = {}

MyPlugin.install = function (Vue, options) {
  var navigator = weex.requireModule('navigator')
  const TYPE = process.env.COMPILE_ENV
  // 3. 注入组件
  Vue.mixin({
    methods: {
      jump (path, query) {
        console.log('will jump ' + TYPE)

        if (TYPE === 'vue') {
          if (this.$router) {
            this.$router.push({
              query: query,
              path: path
            })
          }
        }
        if (TYPE === 'weex') {
          var queryString = query ? '?' + qs.stringify(query) : ''
          var url = weex.config.bundleUrl.split('/').slice(0, -1).join('/') + '/' + path + '.js' + queryString

          console.log('will jump ' + url)
          navigator.push({
            url,
            animated: 'true'
          })
        }
      },
      jumpout (path) {
        console.log('will jump out')
        if (TYPE === 'vue') {
          if (this.$router) {
            this.$router.go(-1)
          }
        }
        if (TYPE === 'weex') {
          navigator.pop()
        }
      },
      query () {
        if (TYPE === 'vue') {
          return this.$route.query
        }

        if (TYPE === 'weex') {
          return qs.parse(weex.config.bundleUrl.split('?')[1])
        }
      },
      path () {
        if (TYPE === 'vue') {
          return this.$route.path
        }

        if (TYPE === 'weex') {
          return weex.config.bundleUrl.split('?')[0].split('/').splice(-1)[0].split('.js')[0]
        }
      }
    }
  })
}
export default MyPlugin
