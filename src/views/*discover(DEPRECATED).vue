<template>
  <OHSPage>
    <list id="cmsList" @scroll="onScroll" loadmoreoffset="10" @loadmore="onloading">
      <component :is="component" :listItems="itemsList" @itemClick="itemClick">
      </component>
      <text :style="loadingStyle">{{footer_text}}</text>
    </list>
  </OHSPage>
</template>

<script>
import Base from '../mixins/base'
import CIData from '../modules/CIData'


import network from '../modules/network/network'

import OCellSTitleBG from '../components-proj/cms/cmsCell/O-CellS-Title-BG.vue'
// import OCellSTitleBG from '../../node_modules/iweex/src/o-components/components/cell/O-CellS-Title-BG.vue'
import { OHSPage } from '../components-proj/comm/page'
export default {
  mixins: [Base],
  preload($route) {
    return ['getNewestArticle.1.5']
  },
  components: {
    OHSPage: OHSPage.weexComponent,
    OCellSTitleBG
  },
  data: function() {
    return {
      itemsList: [],
      categoryName: '',
      refreshing: false,
      showLoading: 'hide',
      itemLength: 0,
      maxNum: false,
      component: 'OCellSTitleBG',
      page: 1,
      pageSize: 5,
      keepAlive: true,
      scrollTop: 0,
      cmsList: Object,
      footer_text: '正在加载中...'
    }
  },
  created() {

  },
  updated() {
    this.cmsList = document.querySelector('#cmsList')
  },
  activated() {
    if (this.cmsList) {
      this.cmsList.scrollTop = this.scrollTop
    }
  },
  computed: {
    loadingStyle() {
      return {
        alignSelf: 'stretch',
        height: this.rpx(80, true),
        fontSize: this.rpx(24, true),
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888888',
        listview: {},
        offset: 0
      }
    }
  },
  methods: {
    depend() {
      console.log('info--depend')
      return ['getNewestArticle.' + this.page + '.' + this.pageSize]
    },
    resolve() {
      let data = this.store('getNewestArticle.' + this.page + '.' + this.pageSize).data.data
      for (let i = 0; i < data.length; i++) {
        let item = data[i]
        item['categoryname'] = item.account_id || ''
        item['date'] = this.makeDate(item['showed'])
        item['readcounter'] = Number(item['scan_num']) || 0
      }
      this.itemsList = data
    },
    itemClick(item) {
      CIData.push(['trackEvent', 'wyeth', 'cms_click', item.account_id, item.id]);
      this.$router.push({ name: 'cmsPageInfo', params: item })
    },
    /* 下拉刷新 */
    //    onrefresh(event) {
    //      console.log('onrefresh')
    //      this.fetch()
    //      this.page = 1
    //
    //      var self = this
    //      network.getNewestArticle({ page: this.page, articleNum: this.pageSize, substrcount: this.substrcount }, function (res) {
    //        console.log('onrefresh:', res)
    //        if (res.ret === 1) {
    //          let data = res.data.data
    //
    //          for (let i = 0; i < data.length; i++) {
    //            let item = data[i]
    //            item['categoryname']='魔栗妈咪学院'
    //            item['date'] = self.makeDate(item['showed'])
    //            item['readcounter'] = 0
    //          }
    //
    //          self.itemsList = data
    //        }
    //        self.refreshing = false
    //
    //      })
    //    },
    /* 上拉加载更多 */
    onloading(event) {
      console.log('--------------onloading')
      this.fetch(true)

      //      this.page = this.page + 1
      //
      //      var self = this
      //      network.getNewestArticle({ page: this.page, articleNum: this.pageSize, substrcount: this.substrcount }, function (res) {
      //        console.log('onloading:', res)
      //        if (res.ret === 1) {
      //          let data = res.data.data
      //
      //
      //          for (let i = 0; i < data.length; i++) {
      //            let item = data[i]
      //            item['categoryname']='魔栗妈咪学院'
      //            item['date'] = self.makeDate(item['showed'])
      //            item['readcounter'] = 0
      //          }
      //
      //          self.itemsList.push(...data)
      //
      //          self.showLoading='hide'
      //        }
      //      })
    },
    fetch(isLoadMore) {
      let p = 1

      if (isLoadMore) {
        p = this.page + 1
        this.showLoading = 'show'
      } else {
        this.page = 1
        p = this.page
        this.refreshing = true
      }

      let self = this
      self.footer_text = '正在加载中...'
      network.getNewestArticle({ page: p, page_size: this.pageSize }, function(res) {
        console.log('onloading:', res)
        if (res.ret === 1) {
          let data = res.data.data

          for (let i = 0; i < data.length; i++) {
            let item = data[i]
            item['categoryname'] = item.account_id || ''
            item['date'] = self.makeDate(item['showed'])
            item['readcounter'] = Number(item['scan_num']) || 0
          }
          if (isLoadMore) {
            self.itemsList.push(...data)
          } else {
            self.itemsList = data
          }
          self.showLoading = 'hide'

          self.page = self.page + 1
          if (data.length < self.pageSize) {
            self.footer_text = '-我还是有底线的-'
          } else {
            self.footer_text = ''
          }
        } else {
          self.footer_text = ''
        }

        if (isLoadMore) {
          self.showLoading = 'hide'
        } else {
          self.refreshing = false
        }
      })
    },

    makeDate(time) {
      let timeArr = []
      timeArr = time.split(' ')
      return timeArr[0]
    },
    listStyle() {
      let baseNum = 5
      const baseHeight = 265
      let height = baseHeight * baseNum
      return `height: ${height}px`
    },
    onScroll(ev) {
      if (this.cmsList) {
        this.scrollTop = this.cmsList.scrollTop
      }
    }
  },
  mounted: function() {

  }
}
</script>

<style scoped>
#cmsList {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
</style>
