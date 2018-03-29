<template>
  <OHSFullPage>

    <list id = "listview" class = "list-container" loadmoreoffset = "10" @scroll = "onScroll" @loadmore = "onloading">
      <OBlock :height = "24" bgColor = "#f6f6f6"></OBlock>
      <cell v-for = "item in items" @click = "onItemClick(item)">
        <component :is = "itemComponent" :obj = "item"></component>
      </cell>
      <text  :style = "loadingStyle">{{footer_text}}</text>
    </list>

  </OHSFullPage>
</template>


<script>
  import OBlock from '../components/OBlock'
  import {OHSFullPage} from '../components-proj/comm/page/index'
  import Base from '../mixins/base'
  import network from '../modules/network/network'
  import config from '../config.json'

  module.exports = {
    mixins: [Base],
    components: {
      OHSFullPage: OHSFullPage.weexComponent,
      OBlock: OBlock.weexComponent
    },
    preload ($route) {
      let url = $route.params.url
      let req = url
      let params = $route.params.params
      if (params) {
        let values = Object.values(params).join('.')

        if (values.length > 0) {
          req = url + '.' + values
        }
      }
      return [ req || '' ]
    },
    created () {
      console.log('-------------itemComponent=', this.itemComponent)
      if (this.$route.params.itemComponent) {
        this.itemComponent = this.$route.params.itemComponent
      }
    },
    computed: {
      loadingStyle () {
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
    updated () {
      this.listview = document.querySelector('#listview')
    },
    activated () {
      if (this.listview) {
        this.listview.scrollTop = this.offset
      }
    },
    data () {
      return {
        footer_text: '正在加载中...',
        itemComponent: {},
        isLoading: false,
        items: [],
        page: 1,
        page_size: 10,
        params: {},
        url: ''
      }
    },
    methods: {
      depend () {
        let url = this.$route.params.url
        let req = url
        let params = this.$route.params.params
        if (params) {
          let values = Object.values(params).join('.')
          if (values.length > 0) {
            req = url + '.' + values
          }
        }

        this.url = url
        this.params = params
        return [ req || '' ]
      },
      resolve () {
        let url = this.$route.params.url
        let req = url
        let params = this.$route.params.params
        if (params) {
          let values = Object.values(params).join('.')
          if (values.length > 0) {
            req = url + '.' + values
          }
        }

        let data = this.store(req).data
        if (data) {
          this.items = []
          this.items.push(...data)
        }
      },
      onloading () {
        this.fetch()
      },
      onItemClick (item) {
        let fn = this.$route.params.onItemClick
        if (fn && typeof fn === 'function') {
          fn(item)
        }
      },
      onScroll (ev) {
        if (this.listview) {
          this.offset = this.listview.scrollTop
        }
      },
      fetch () {
        let self = this
        let data = Object.assign(this.params, {
          page: this.page + 1,
          page_size: this.page_size
        })
        self.footer_text = '正在加载中...'
        network.getRequest(config.api[this.url], data, function (res) {
          if (res.ret === 1) {
            let data = res.data
            self.footer_text = ''
            self.page = self.page + 1
            self.items.push(...data)
          } else {
            self.footer_text = ''
          }
        }, true)
      }
    }
  }
</script>

<style>
  .list-container{
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }
  .loading-text{
    align-self: stretch;
    width: 750px;
    height: 80px;
    font-size: 50px;
    align-items: center;
    justify-content: center;
    color: #888888;
  }
</style>
