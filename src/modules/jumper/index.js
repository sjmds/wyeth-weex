import event from '../event'
export const jumper = {

  push (vm, name, params) {
    let date = new Date()
    console.log('jumper.push', name, params)
    if (name !== 'home') {
      event.sendEvent('disableStatic')
    }
    console.log('jump' + (date.getSeconds() * 1000 + date.getMilliseconds()))
    const type = weex.config.env.platform
    if (type === 'Web') {
      // if (params !== undefined) {
      //   vm.$router.push({name: path, params})
      // } else {
      //   vm.$router.push(path)
      // }

      vm.$router.push({name: name, params: params})
    } else {
      var navigator = weex.requireModule('navigator')
      if (!navigator) {
        throw new Error('weex路由api依赖 weex navigator')
      }
      var url = weex.config.bundleUrl  // 获取当前页面路径
      url = url.split('/').slice(0, -1).join('/') + path + '.js'  // 获取编译后界面的js文件路径
      // navigator.pop()
      navigator.push({
        url: url,
        animated: 'true'
      })
    }
  }
}
