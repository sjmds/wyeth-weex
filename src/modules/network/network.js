
// import store from '../store'
import event from '../../modules/event'
import { gotoLogin, checkRegister } from '../../modules/login'
import axios from 'axios'
var config = require('../../config.json')
axios.defaults.withCredentials = true
axios.defaults.timeout = config.timeout
axios.defaults.baseURL = window.wyeth_host

var network = new Vue({
  data () {
    return {
      user_token: ''
    }
  },
  methods: {
    getRequest: function (url, data, callback, hideLoading) {
      return this.request('GET', url, data, callback, hideLoading)
    },
    postRequest: function (url, data, callback, hideLoading) {
      return this.request('POST', url, data, callback, hideLoading)
    },
    equeue: function (method, url, data, callback) {
      url = url + '?' + config.dev

      var self = this

      if (method === 'POST') {
        let fn = function (n) {
          axios.post(url, data)
            .then(function (response) {
              callback(response)
            })
            .catch(function (error) {
              if (n < 2) {
                error.ret = error.ret ? error.ret : -1
                error.msg = error.msg || '网络请求失败'

                callback(error)
                self.showError(error)
              } else {
                fn(n - 1)
              }
            })
        }

        return fn(2)
      } else {
        if (data) {
          Object.keys(data).map(function (key) {
            url = url + '&' + key + '=' + data[key]
          })
        }

        let fn = function (n) {
          axios.get(url)
            .then(function (response) {
              callback(response)
            })
            .catch(function (error) {
              if (n < 2) {
                error.ret = error.ret ? error.ret : -1
                error.msg = error.msg || '网络请求失败'

                callback(error)
                self.showError(error)
              } else {
                console.log(' ----------> 请求失败，重新请求,url=', url)
                fn(n - 1)
              }
            })
        }

        return fn(2)
      }
    },
    request: function (method, url, data, callback, hideLoading) {
      // CMS
      if (!hideLoading) {
        event.sendEvent('toast_loading_start')
      }
      console.log('------->method=' + method + ',url=' + url + ',data=', data)

      var self = this
      function networkResponse (response) {
        console.log('请求结束', response)

        let error = {}

        console.log('----------->   method=' + method + ',url=' + url + ',data=', data, 'response=', response)
        if (response.status === 200) {
          var res = response.data
          if (!res.ret) {
            res = JSON.parse(res)
          }
          if (res.ret === 1) {
            // 请求成功
            if (callback) {
              callback(res)
            }
          } else {
            error.ret = res.ret ? res.ret : -1
            error.msg = res.msg ? res.msg : '获取数据失败'

            if (res.login_url) {
              // 跳转登录
              gotoLogin(res.login_url)

              error.msg = '正在跳转登录'
            }
            self.showError(error)

            if (callback) {
              callback(error)
            }
          }
        } else {
          error.ret = response.status ? response.status : -1
          error.msg = response.msg || '网络请求失败'
          self.showError(error)

          if (callback) {
            callback(error)
          }
        }

        if (!hideLoading) {
          event.sendEvent('toast_loading_end')
        }

      }
      this.equeue(method, url, data, networkResponse)
    },
    showError: function (error) {
      event.sendEvent('toast', { type: 'fail', text: error.msg })
    },
    getAllTag: function (callback) {
      this.getRequest(config.api.getAllTag, {}, callback)
    },
    getAllHotTag: function (callback) {
      this.getRequest(config.api.getAllHotTag, {}, callback)
    },
    getSignature: function (reqUrl, timestamp, callback) {
      let params = {
        url: encodeURIComponent(reqUrl),
        t: timestamp
      }
      this.equeue('GET', config.api.getSignature, params, callback)
    },
    shareCourse: function (courseId, callback) {
      this.getRequest(config.api.shareCourse, { cid: courseId }, callback, true)
    },
    getHomePageData: function (callback) {
      this.getRequest(config.api.getHomePageData, {}, callback)
    },
    getCourseDetail: function (courseId, callback) {
      this.getRequest(config.api.getCourseDetail, { courseId: courseId }, callback)
    },
    getUserDynamic: function (params, callback, hideToast) {
      this.getRequest(config.api.getUserDynamic, params, callback, hideToast)
    },
    getCourse: function (params, callback, hideToast) {
      this.getRequest(config.api.getCourse, params, callback, hideToast)
    },
    getSearchResult: function (params, callback) {
      this.getRequest(config.api.getSearchResult, params, callback)
    },
    getCourseSearch: function (params, callback) {
      this.getRequest(config.api.getCourseSearch, params, callback)
    },
    getQuestionSearch: function (params, callback) {
      this.getRequest(config.api.getQuestionSearch, params, callback)
    },
    getTagQuestion: function (params, callback) {
      this.getRequest(config.api.getTagQuestion, params, callback)
    },
    /** 我的相关接口 **/
    getMine: function (params, callback) {
      this.getRequest(config.api.getMine, params, callback, true)
    },
    getMq: function (params, callback) {
      this.getRequest(config.api.getMq, params, callback)
    },
    getMQDetail: function (params, callback) {
      this.getRequest(config.api.getMQDetail, params, callback)
    },
    getTraceCourse: function (params, callback) {
      this.getRequest(config.api.getTraceCourse, params, callback)
    },
    getMyFollow: function (params, callback) {
      this.getRequest(config.api.getMyFollow, params, callback)
    },
    setMyFollow: function (params, callback) {
      this.postRequest(config.api.setMyFollow, params, callback)
    },
    /** 我的相关接口end **/
    getLoginInfo: function (callback) {
      this.postRequest(config.api.getLoginInfo, {}, callback, true)
    },
    observePro: function (params, callback) {
      if (checkRegister()) {
        return
      }
      this.getRequest(config.api.observePro, params, callback)
    },
    chooseTag: function (params, callback) {
      this.postRequest(config.api.chooseTag, params, callback)
    },
    courseListenAdd: function (id, callback) {
      this.postRequest(config.api.courseListenAdd, { cid: id }, callback, true)
    },
    courseLike: function (params, callback) {
      params.is_like = 1
      this.getRequest(config.api.saveOrcollect, params, callback)
    },
    courseCollect: function (params, callback) {
      params.is_like = 2
      this.getRequest(config.api.saveOrcollect, params, callback)
    },
    orderCourse: function (id, callback) {
      this.getRequest(config.api.orderCourse, { cid: id }, callback)
    },
    signCat: function (cid, callback) {
      this.getRequest(config.api.signCat, { cid: cid }, callback)
    },
    getCMSLike: function (params, callback) {
      this.getRequest(config.api.getCMSLike, params, callback)
    },
    getCMSCollect: function (params, callback) {
      this.getRequest(config.api.getCMSCollect, params, callback)
    },
    getArticleDetail: function (id, callback) {
      this.getRequest(config.api.getArticleDetail, { article_id: id }, callback)
    },
    getArticleShare: function (id, callback) {
      this.getRequest(config.api.getArticleShare, { article_id: id }, callback, true)
    },
    getBoughtCat: function (callback, hideToast) {
      this.getRequest(config.api.getBoughtCat, {}, callback, hideToast)
    },
    createOrderMQ: function (cid, type, callback) {
      this.postRequest(config.api.createOrderMQ, { cid: cid, type: type }, callback)
    },
    payMQ: function (id, callback) {
      this.postRequest(config.api.payMQ, { trade_id: id }, callback)
    },
    createOrder: function (price, returnUrl, callback) {
      this.postRequest(config.api.createOrder, { price: price, return_url: returnUrl,channel: window.wyeth_channel}, callback)
    },
    queryOrder: function (orderNo, callback, hideToast) {
      this.postRequest(config.api.queryOrder, { order_no: orderNo }, callback, hideToast)
    },
    sendErrorLog: function (params) {
      this.postRequest(config.api.sendErrorLog, params,null,true)
    },
    addChance: function (num,callback) {
      this.postRequest(config.api.addChance, {num:num},callback)
    },
    getShortLink: function (link, callback) {
      this.postRequest(config.api.getShortLink, {pre_link: link}, callback)
    },
    getPlayList: function (id_array,callback){
      this.getRequest(config.api.getPlayList, {id_array:id_array}, callback)
    },
    jumpToLogin: function (loginUrl) {
      window.location.href = loginUrl
    },
    getCourseSeries: function (params,callback,hideLoading){
      this.getRequest(config.api.getCourseSeries, params, callback,hideLoading)
    },
    getNewestArticle: function (params, callback) {
      this.getRequest(config.api.getNewestArticle, params, callback, true)
    },
    getDynamicAndArticles: function(params, callback){
      this.getRequest(config.api.getDynamicAndArticles, params, callback, true)
    },
    getDetailCatCourse: function(params, callback){
      this.getRequest(config.api.getDetailCatCourse, params, callback, true)
    },
    getActivity: function (callback) {
      this.getRequest(config.api.getActivity,{},callback,true)
    },
    getTraceCourseByDate: function(date,callback){
      this.getRequest(config.api.getTraceCourseByDate,{"date":date},callback,false)
    }
  }
})

module.exports = network
