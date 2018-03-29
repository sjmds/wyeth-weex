<template>
  <OHSFullPage>

    <!--<Tabs :value = "tab1" @input = "v => tab1 = v" class = "tabs-container">-->
      <!--<Tab label = "课程" value = "one" style = "position: static;" >-->
        <!---->
      <!--</Tab>-->
      <!--<Tab label = "发现图文" value = "two">-->
        <!--<text>未发货...</text>-->
      <!--</Tab>-->
    <!--</Tabs>-->

    <list class = "history-list" loadmoreoffset = "10" @loadmore = "onloading">
      <cell v-for = "(item, i) in items" :key='i' @click = "onItemClick(item)">
        <OHSClasscell :obj = "item"></OHSClasscell>
      </cell>
      <div :style = "loadStyle">
        <text @click = "onMoreClick" :style = "loadTextStyle">{{loading_txt}}</text>
      </div>
    </list>
  </OHSFullPage>
</template>

<script>
import { courseRoute } from '../../modules/tools'
import { OHSFullPage } from '../../components-proj/comm/page'
import Tabs from '../../components/OTab'
import Tab from '../../components/OTab/o-tab'
import event from '../../modules/event'
import OHSClasscell from '../../components-proj/all/classCell'
import Base from '../../mixins/base'
import network from '../../modules/network/network'
module.exports = {
  mixins: [Base],
  preload ($route) {
    console.log('info-history-preload')
    return ['getTraceCourse.1.5']
  },
  components: {
    OHSFullPage: OHSFullPage.weexComponent,
    Tab: Tab.weexComponent,
    OHSClasscell: OHSClasscell.weexComponent,
    Tabs: Tabs.weexComponent
  },
  data () {
    return {
      items: [],
      page: 1,
      page_size: 5,
      showLoading: 'hide',
      isLoading: false,
      refreshing: false,
      tab1: 'one',
      loading_txt: '正在努力加载...'
    }
  },
  computed: {
    params: function () {
      return {
        page: this.page,
        page_size: this.page_size
      }
    },
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
  created () {
    console.log('info-history-created')
    event.sendEvent('tabbar_g', true)
  },
  updated () {
    console.log('info-history-updated')
    event.sendEvent('tabbar_g', true)
  },
  methods: {
    depend () {
      console.log('info-history-depend---')
      return ['getTraceCourse.1.5']
    },
    resolve () {
      console.log('info-history-resolve')
      let data = this.store('getTraceCourse.1.5').data
      this.items = data

      if (data.length < this.page_size) {
        console.log('---暂无更多数据---')
        this.loading_txt = '暂无更多数据'
      }
    },
    fetch (tag, callback) {
      var self = this
//      if (tag === 0) {
//        self.page = 1
//      }
      let param = {
        page: self.page + 1,
        page_size: self.page_size
      }
      self.loading_txt = '正在努力加载...'
      network.getTraceCourse(param, function (res) {
        if (res.ret === 1) {
          let data = res.data
          if (data.length < self.page_size) {
            self.loading_txt = '暂无更多数据'
          } else {
            self.loading_txt = ''
          }

          if (tag > 0) {
            // 加载更多
            self.items.push(...data)
          } else {
            // 刷新数据
            self.items = data
          }
          self.page = self.page + 1
          if (callback) {
            callback()
          }
        } else {
          self.loading_txt = '暂无更多数据'
        }
      }, true)
    },
    onloading (event) {
      var self = this
      if (self.isLoading === false) {
        console.log('onloading')
        self.isLoading = true
        this.fetch(1, function () {
          self.isLoading = false
        })
      }
    },
    onItemClick (item) {
      courseRoute(item)
    },
    onMoreClick () {
      var self = this
      if (self.isLoading === false) {
        console.log('onloading')
        self.isLoading = true
        this.fetch(1, function () {
          self.isLoading = false
        })
      }
    }
  }
}
</script>

<style scoped>
  .tabs-container{
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
  }
  .history-list{
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
  }
</style>
