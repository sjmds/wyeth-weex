<template>

  <list id = "listview" class = "list-container" loadmoreoffset = "10" @scroll = "onScroll" @loadmore = "onloading">

    <slot name = "headerView"></slot>
    <cell v-for = "item in items" @click = "onItemClick(item)">
      <component :is = "itemComponent" :obj = "item" :extra = "extra"></component>
    </cell>
    <text  :style = "loadingStyle">{{footer_text}}</text>
  </list>

</template>

<script>
  // 其它用法与vue相同
  import OBlock from '../OBlock'
  import Base from '../../mixins/base'
  import network from '../../modules/network/network'
  import config from '../../config.json'

  export default {
    mixins: [Base],
    components: {
      OBlock: OBlock.weexComponent
    },
    props: {
      url: {
        type: String,
        required: true
      },
      params: {
        type: Object,
        required: true
      },
      extra: {
        type: Object
      },
      itemComponent: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        page: 1,
        items: [],
        footer_text: '正在加载中...'
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
          offset: 0,
          list: {}
        }
      }
    },

    created () {
      let self = this
      setTimeout(function () {
        self.fetch()
      }, 0)
    },
    mounted () {
//    this.fetch()
    },
    updated () {
      this.list = document.querySelector('#listview')
    },
    activated () {
      if (this.list) {
        this.list.scrollTop = this.offset
      }
    },
    methods: {
      fetch () {
        let self = this
        let p = Object.assign(this.params, {
          page: this.page
        })
        self.footer_text = '正在加载中...'
        network.getRequest(config.api[this.url], p, function (res) {
          console.log('xxx res', res)
          if (res.ret === 1) {
            let data = res.data
            if (data.length === null || data.length < 1) {
              self.footer_text = '暂无更多数据'
            } else {
              self.footer_text = ''
            }
            self.page = self.page + 1
            self.items.push(...data)
          } else {
            self.footer_text = '暂无更多数据'
          }
        }, true)
      },
      onScroll (ev) {
        if (this.list) {
          this.offset = this.list.scrollTop
        }
      },
      onItemClick (item) {
        this.$emit('onItemClick', item)
      },
      onloading () {
        this.fetch()
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import 'index'
</style>
