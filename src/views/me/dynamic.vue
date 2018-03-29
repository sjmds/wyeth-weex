<template>
  <OHSFullPage>
    <list class = "dynamic-list" loadmoreoffset = "10" @loadmore = "onloading">
      <OHSDynamicCell v-for = "(item, index) in dynamicData" :key = "index" :obj = "item"></OHSDynamicCell>
      <div :style = "loadStyle">
        <text @click = "onMoreClick" :style = "loadTextStyle">{{loading_txt}}</text>
      </div>
    </list>
  </OHSFullPage>
</template>

<script>
  import OHSDynamicCell from '../../components-proj/me/dynamicCell'
  import { OHSFullPage } from '../../components-proj/comm/page'
  import event from '../../modules/event'
  import Base from '../../mixins/base'
  import network from '../../modules/network/network'
  module.exports = {
    mixins: [Base],
    preload ($route) {
      return ['getUserDynamic.1.10']
    },
    components: {
      'OHSDynamicCell': OHSDynamicCell.weexComponent,
      'OHSFullPage': OHSFullPage.weexComponent
    },
    created () {
      event.sendEvent('tabbar_g', true)
    },
    updated () {
      event.sendEvent('tabbar_g', true)
    },
    data () {
      return {
        dynamicData: [],
        showLoading: 'hide',
        isLoading: false,
        refreshing: false,
        page: 1,
        page_size: 10,
        loading_txt: '正在努力加载...'
      }
    },
    computed: {
      loadStyle: function () {
        return {
          width: this.rpx(750, true),
          height: this.rpx(80, true),
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: this.rpx(30, true)
        }
      },
      loadTextStyle () {
        return {
          color: '#888888',
          fontSize: this.rpx(24, true)
        }
      }
    },
    methods: {
      depend () {
        return ['getUserDynamic.1.10']
      },
      resolve () {
        let data = this.store('getUserDynamic.1.10').data
        this.dynamicData = data
        if (data.length < this.page_size) {
          this.loading_txt = '暂无更多数据'
        }
      },
      onloading (event) {
        var self = this
        if (self.isLoading === false) {
          self.isLoading = true
          this.fetch(1, function () {
            self.isLoading = false
          })
        }
      },
      onMoreClick () {
        var self = this
        if (self.isLoading === false) {
          self.isLoading = true
          this.fetch(1, function () {
            self.isLoading = false
          })
        }
      },
      fetch (tag, callback) {
        let params = {
          page: this.page,
          page_size: this.page_size
        }
        if (tag > 0) {
          params.page = params.page + 1
        }
        let self = this
        self.loading_txt = '正在努力加载...'
        network.getUserDynamic(params, function (res) {
          if (res.ret === 1) {
            let data = res.data
            if (data.length < self.page_size) {
              self.loading_txt = '暂无更多数据'
            } else {
              self.loading_txt = ''
            }
            if (tag > 0) {
              self.page = self.page + 1
              self.dynamicData.push(...data)
            } else {
              self.dynamicData = data
            }
            if (callback) {
              callback()
            }
          } else {
            self.loading_txt = ''
          }
        }, true)
      }
    }
  }
</script>

<style scoped>
  .dynamic-list {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    padding-top: 24px;
    background-color: #f6f6f6;
  }
  .indicator {
    color: #888888;
    font-size: 22px;
    width: 200px;
    text-align: center;
  }
</style>
