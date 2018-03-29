const storage = weex.requireModule('storage')

export default {
  setItem (key, value, callback) {
    console.log('storage-setItem key:', key)

    storage.setItem(key, value, function (event) {
      var state = event.result === 'success'
      callback(state)
    })
  },
  getItem (key, callback) {
    console.log('storage-getItem key:', key)

    storage.getItem(key, callback)
  },
  removeItem (key, callback) {
    console.log('storage-removeItem key:', key)

    storage.removeItem(key, callback)
  },
  getAll (callback) {
    storage.getAllKeys(callback)
  },
  length (callback) {
    storage.length(callback)
  },
  store (key, val) {
    return new Promise((resolve, reject) => {
      if (typeof val === 'undefined') {
        this.getItem(key, (e) => {
          resolve(e.data)
        })
      } else {
        this.setItem(key, val, (state) => {
          if (state !== true) {
            reject(new Error(`[ERROR] setItem failed in store @ store/index where key = ${key}, val = ${val}`))
          } else {
            resolve()
          }
        })
      }
    })
  }
}
