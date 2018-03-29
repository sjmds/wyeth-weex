const CIBus = new Vue()
export default {
  addEventListener: function (type, callback) {
    CIBus.$on(type, function (data) {
      console.log('接收到' + type + ' ', data)
      callback(data)
    })
  },
  sendEvent: function (type, data) {
    console.log('发送 ' + type + ' ', data)
    CIBus.$emit(type, data)
  }
}
