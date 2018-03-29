<template>
  <OHSPage style = "background-color: #ffffff">
    <!--<OHSSearchbar :hotTags = "search_tags"></OHSSearchbar>-->
    <OHSSearchTab :hintText = "hintText" @onClick = "onSearchClick"></OHSSearchTab>
    <list id = "allList" class = "all-list" loadmoreoffset = "10" @loadmore = "onloading" @scroll = "onScroll" >
      <OHSTagGroup :enable = "enable" :typeTags = "tags1" :stageTags = "preg_tag_name" ref = "tagGroup" :hotTags = "tags3" :initSelect = "select"
                   @onTagChange = "onTagChange"></OHSTagGroup>
      <OBlock :width = "750" :height = "16" bgColor = "#eeeeee"></OBlock>
      <cell v-for = "item in items" @click = "onItemClick(item)">
        <OHSClasscell :obj = "item"></OHSClasscell>
      </cell>
      <div :style = "loadStyle">
        <text @click = "onMoreClick"  :style = "loadTextStyle">{{loading_txt}}</text>
      </div>

      <!--<loading class = "loading">-->
      <!--<text class='indicatortext' v-show = "showLoading === 'show'">Loading ...</text>-->
      <!--</loading>-->
    </list>
    <!--<OBlock :width = "750"-->
    <!--bgColor = "#ffffff"-->
    <!--:height = "130"></OBlock>-->

  </OHSPage>
</template>

<script>

  import Base from '../mixins/base'
  import network from '../modules/network/network'
  import OHSSearchbar from '../components-proj/search/searchbar'
  import OHSTagGroup from '../components-proj/all/tagGroup'
  import OHSClasscell from '../components-proj/all/classCell'
  import OBlock from '../components/OBlock'
  import { OHSPage } from '../components-proj/comm/page'
  import store from '../modules/store/index'
  import OHSSearchTab from '../components-proj/search/searchTab'
  import { courseRoute } from '../modules/tools'

  module.exports = {
    mixins: [Base],
    preload ($route) {
      /**
       * 默认 全部
       * @type {number}
       */
      let type = 3
      let stage = 0
      let tag = 0
      let preg_id = 0
      if ($route.params.preg_id) {
        preg_id = parseInt($route.params.preg_id)
      }
      if (typeof $route.params.type !== 'undefined') {
        type = parseInt($route.params.type)
      }
      if ($route.params.stage) {
        stage = parseInt($route.params.stage)
      }
      if ($route.params.tag) {
        tag = $route.params.tag.id
      }
      let s = 'getCourse.' + type + '.' + stage + '.' + preg_id + '.' + tag + '.' + '1' + '.' + '5'
      return [s]
    },
    components: {
      OHSSearchbar: OHSSearchbar.weexComponent,
      OHSTagGroup: OHSTagGroup.weexComponent,
      OHSClasscell: OHSClasscell.weexComponent,
      OBlock: OBlock.weexComponent,
      OHSPage: OHSPage.weexComponent,
      OHSSearchTab: OHSSearchTab.weexComponent
    },
    data () {
      return {
        items: [],
        page: 1,
//        tags1: ['全部', '最新', '推荐', '热门'],
        type_tags: [{id: 3, name: '全部'}, {id: 0, name: '最新'}, {id: 1, name: '推荐'}, {id: 2, name: '热门'}],
//        tags2: ['不限', '孕期', '0-12月', '12-24月', '24+月'],
        preg_tag: [{id: 0, name: '不限'}],
        tags: [{ id: 0, name: '热门标签' }],
        page_size: 5,
        select: [0, 0, 0],
        showLoading: 'hide',
        isLoading: false,
        refreshing: false,
        search_tags: [],
        hintText: '大脑发育',
        loading_txt: '正在努力加载...',
        keepAlive: true,
        scrollTop: 0,
        allList: {},
        emptyHotTag: true,
        enable: true
      }
    },
    computed: {
      tags1 () {
        let t = []
        for (let i = 0; i < this.type_tags.length; i++) {
          t.push(this.type_tags[i].name)
        }
        return t
      },
      tags3 () {
        let t = []
        for (let i = 0; i < this.tags.length; i++) {
          t.push(this.tags[i].name)
        }
        return t
      },
      preg_tag_name () {
      	let t = []
        for (let i = 0; i < this.preg_tag.length; i++) {
      		t.push(this.preg_tag[i].name)
        }
        return t
      },
      params () {
        console.log('params computed')
        let s = this.select
        return {
          type: this.type_tags[s[0]].id,
          time: s[1],
          preg_id: this.preg_tag[s[1]].id,
          tag: this.tags[s[2]].id,
          page: this.page,
          page_size: this.page_size
        }
      },
      loadStyle () {
        return {
          width: this.rpx(750, true),
          alignItems: 'center',
          height: this.rpx(80, true),
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
      this.init()
    },
    updated () {
      this.allList = document.querySelector('#allList')
    },
    activated () {
      if (this.allList) {
        this.allList.scrollTop = this.scrollTop
      }
    },
    methods: {
      init () {
        let a = Math.random()
        // if (a < 0.5) {
        //   this.hintText = '大脑发育'
        // } else {
        //   this.hintText = '母乳喂养'
        // }

        this.hintText = window.app_config.search_placeholder

        let self = this
        console.log('----------- all params', this.$route.params)

        if (typeof this.$route.params.type !== 'undefined') {
          let type = parseInt(this.$route.params.type)
          this.select[0] = type + 1
        }
        if (this.$route.params.stage) {
          let stage = parseInt(this.$route.params.stage)
          this.select[1] = stage
        }
        if (this.$route.params.tag) {
          let a = []
          a.push(this.tags[0])
          a.push(this.$route.params.tag)

          for (let idx in this.tags.length) {
            if (this.tags[idx].id === this.$route.params.tag.id) {
              this.tags.splice(idx, 1)
              break;
            }
          }
          a.push(...this.tags.slice(1, this.tags.length))
          this.tags = a
          this.select[2] = 1
        }

        this.fetchTag()

        store.getItem('search_tags', function (data) {
          if (data.result === 'failed') {
            self.search_tags = []
          } else {
            self.search_tags = JSON.parse(data.data)
          }
        })
        if (this.$refs.tagGroup) {
          this.$refs.tagGroup.setSelect(this.select)
        }
      },
      depend () {
        console.log('info--depend')
        let type = 3
        let stage = 0
        let tag = 0
        let preg_id = 0
        if (this.$route.params.preg_id) {
          preg_id = parseInt($route.params.preg_id)
        }
        if (typeof this.$route.params.type !== 'undefined') {
          type = parseInt(this.$route.params.type)
        }
        if (this.$route.params.stage) {
          stage = parseInt(this.$route.params.stage)
        }
        if (this.$route.params.tag) {
          tag = this.$route.params.tag.id
        }
        let s = 'getCourse.' + type + '.' + stage + '.' + preg_id + '.' + tag + '.' + '1' + '.' + '5'
        return [s]
      },
      resolve () {
        let type = 3
        let stage = 0
        let tag = 0
        let preg_id = 0
        if (this.$route.params.preg_id) {
          preg_id = parseInt($route.params.preg_id)
        }
        if (typeof this.$route.params.type !== 'undefined') {
          type = parseInt(this.$route.params.type)
        }
        if (this.$route.params.stage) {
          stage = parseInt(this.$route.params.stage)
        }
        if (this.$route.params.tag) {
          tag = this.$route.params.tag.id
        }
        let s = 'getCourse.' + type + '.' + stage + '.' + preg_id + '.' + tag + '.' + '1' + '.' + '5'
        let data = this.store(s).data
        this.items = []
        this.items.push(...data)
//      this.items = data
        if (data.length < this.page_size) {
          console.log('---暂无更多数据---')
          this.loading_txt = '暂无更多数据'
        }
        this.page = 2
      },
      fetchTag () {
        let self = this
//        network.getAllHotTag(function (res) {
//          if (res.ret === 1) {
//            let data = res.data
//            let arr = data.map(function (k) {
//              return { id: k.id, name: k.name }
//            })
//            if (self.emptyHotTag) {
//              self.tags.push(...arr)
//              self.emptyHotTag = false
//            }
//          }
//        })
        network.getAllTag(function (res) {
          if (res.ret === 1) {
            let hot_tag = res.data.hot_tag.map(function (k) {
              return { id: k.id, name: k.name }
            })

            let preg_tag = res.data.preg_tag.map(function (k) {
              return { id: k.id, name: k.name }
            })




            if (self.emptyHotTag) {
            	self.preg_tag.push(...preg_tag)


              if (self.tags[1]) {
                for (let i = 0;i < hot_tag.length;i++) {
            	    if (hot_tag[i].id === self.tags[1].id) {
            	      hot_tag.splice(i, 1)
                    break
                  }
                }
              }

              self.tags.push(...hot_tag)

            	self.emptyHotTag = false
            }

            if (self.$route.params.stage_id) {
              let stage_id = parseInt(self.$route.params.stage_id)
              for (let i = 0;i < preg_tag.length;i++) {
                if (preg_tag[i].id === stage_id) {
                  self.select[1] = i + 1
                  break;
                }
              }
            }

            if (self.$refs.tagGroup) {
              self.$refs.tagGroup.setSelect(self.select)
            }
          }
        })
      },
      fetch (params, tag, callback) {
        let self = this
        if (tag > 0) {

        } else {
          self.page = 1
        }
        self.loading_txt = '正在努力加载...'
        self.enable = false
        network.getCourse(params, function (res) {
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
          self.enable = true
        }, true)
      },
      onMoreClick () {
        let self = this
        if (self.isLoading === false) {
          console.log('onloading')
          self.isLoading = true
          this.fetch(this.params, 1, function () {
            self.isLoading = false
          })
        }
      },
      onSearchClick () {
        this.$router.push({ name: 'search', params: { hint: this.hintText,nokeep:true} })
      },
      onTagChange (select) {
        this.page = 1
        let a = []
        a.push(...select)
        this.select = a
        console.log('params', this.params)

        let self = this
        if (self.isLoading === false) {
          self.isLoading = true
          this.fetch(this.params, 0, function () {
            self.isLoading = false
          })
        }
      },
      onloading(event) {
        let self = this
        if (self.isLoading === false) {
          console.log('onloading')
          self.isLoading = true
          this.fetch(this.params, 1, function () {
            self.isLoading = false
          })
        }
      },
      onItemClick (item) {
        courseRoute(item)
        this.keepAlive = true
      },
      onScroll (ev) {
        if (this.allList) {
          this.scrollTop = this.allList.scrollTop
        }
      }
    }
  }
</script>

<style scoped>
  .all-list {
    position: absolute;
    top: 78px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }
</style>
