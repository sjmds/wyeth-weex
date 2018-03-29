<template>
  <OSearchbar :hint = "hint" @onBtnClick = "onBtnClick" @onClose = "onClose" @showResult = "onTransition" @search = "search" :autofocus = "autofocus" :btnText = "btnText" ref = "input1">
    <!--历史搜索页面-->
    <div slot = "search_preview" class = "ohs-history">
      <div v-if = "historyItems.length>0" class = "ohs-tag-header">
        <text class = "ohs-history-title">历史搜索</text>
        <div class = "ohs-tag-clear-wrap" @click = "clearHistory">
          <image class = "ohs-tag-clear" :src = "clearImg"/>
        </div>
      </div>
      <div class = "ohs-tag-group">
        <text class = "ohs-tag-span" v-for = "item in historyItems" @click = "onTagClick(item)">{{item}}</text>
      </div>
      <text v-if = "hotTags.length>0" class = "ohs-hot-title">热门搜索</text>
      <div class = "ohs-tag-group">
        <text class = "ohs-tag-span" v-for = "item in hotTags" @click = "onTagClick(item)">{{item}}</text>
      </div>
    </div>

    <!--搜索结果页面-->
    <scroller  id = "scroller" slot = "search_result" style = "flex: 1;" @scroll = "onScroll">

      <OPanel v-if = "classItems.length>0" title = "课程" :titleSize = "30" titleColor = "#999999" :noextra = "true" extra = "更多" :extraSize = "28" extraColor = "#999999" :extraPaddingRight = "22" :paddingRight = "25" :height = "81" :titlePaddingLeft = "0" :paddingLeft = "32" />

      <OBlock :height = "2" bgColor = "#eeeeee" :width = "718" :marginLeft = "32" />
      <div v-for = "item in classItems" @click = "onClassClick(item)">
        <!--<OBlock :height = "2" bgColor = "#eeeeee" :width = "718" :marginLeft = "32" />-->
        <OHSClasscell class = "ohs-search-result-classcell" :obj = "item"></OHSClasscell>
      </div>


      <text class = "ohs-search-loadmore" v-if = "isLoading">正在努力加载中...</text>
      <text class = "ohs-search-loadmore" v-if = "!isLoading&&loadmore_flag" @click = "onClassLoad">点击加载更多</text>
      <text class = "ohs-search-loadmore" v-if = "!isLoading&&!loadmore_flag" @click = "refresh">暂无更多数据,点击重试</text>
    </scroller>



  </OSearchbar>
</template>

<script>
  // 其它用法与vue相同

  import searchbar from '../../../components/searchbar/index'
  import store from '../../../modules/store/index'
  import config from '../../../config.json'
  import OPanel from '../../../components/panel/index'
  import OBlock from '../../../components/OBlock/index'
  import OHSClasscell from '../../all/classCell'
  import OHSTeacherItem from '../teacherItem/'
  import OHSArticleItem from '../articleItem'
  import network from '../../../modules/network/network'
  import { courseRoute } from '../../../modules/tools'

  import Base from '../../../mixins/base'
  export default {
    mixins: [Base],
    components: {
      OSearchbar: searchbar.weexComponent,
      OPanel: OPanel.weexComponent,
      OBlock: OBlock.weexComponent,
      OHSClasscell: OHSClasscell.weexComponent,
      OHSTeacherItem: OHSTeacherItem.weexComponent,
      OHSArticleItem: OHSArticleItem.weexComponent
    },
    props: {
      hint: {
        type: String,
        default: '搜索一下'
      },
      hotTags: {
        type: Array,
        default: function () {
          return ['宝宝', '孕期']
        }
      },
      btnText: {
        type: String,
        default: function () {
          return '取消'
        }
      },
      autofocus: {
        type: Boolean,
        default: function () {
          return false
        }
      }
    },
    data () {
      return {
        clearImg: require('assets/delete.png'),
        historyItems: [],
        hintText: this.hint,
        classItems: [],
        teachers: [
          {
            img: '//wyeth-uploadsites.nibaguai.com/wyethcourse/course/teacher/1cac857b5facb0967551485583a56720.jpg',
            name: '金焱',
            teacher_hospital: '国际和平妇幼保健院',
            teacher_position: '主治医师',
            answer: 1233,
            follow: 23423
          },
          {
            img: '//wyeth-uploadsites.nibaguai.com/wyethcourse/course/teacher/1cac857b5facb0967551485583a56720.jpg',
            name: '金焱',
            teacher_hospital: '国际和平妇幼保健院',
            teacher_position: '主治医师',
            answer: 1233,
            follow: 23423
          },
          {
            img: '//wyeth-uploadsites.nibaguai.com/wyethcourse/course/teacher/1cac857b5facb0967551485583a56720.jpg',
            name: '金焱',
            teacher_hospital: '国际和平妇幼保健院',
            teacher_position: '主治医师',
            answer: 1233,
            follow: 23423
          }
        ],
        articles: [
          {
            img: '//wyeth-uploadsites.nibaguai.com/wyethcourse/course/img/ab7480b80b486342ac45742a0fe6ae01.jpg',
            title: '昆凌二胎，告诉你一定要生两个宝宝的三个理由',
            source: '惠氏妈妈俱乐部',
            num: 121123
          },
          {
            img: '//wyeth-uploadsites.nibaguai.com/wyethcourse/course/img/ab7480b80b486342ac45742a0fe6ae01.jpg',
            title: '昆凌二胎，告诉你一定要生两个宝宝的三个理由',
            source: '惠氏妈妈俱乐部',
            num: 121123
          },
          {
            img: '//wyeth-uploadsites.nibaguai.com/wyethcourse/course/img/ab7480b80b486342ac45742a0fe6ae01.jpg',
            title: '昆凌二胎，告诉你一定要生两个宝宝的三个理由',
            source: '惠氏妈妈俱乐部',
            num: 121123
          }
        ],
        course_page: 1,
        keyword: '',
        loadmore_flag: false,
        isLoading: false,
        offset: 0,
        scroller: {}
      }
    },
    created () {
      var self = this
      store.getItem('search_history', function (data) {
        if (data.result === 'failed') {
          self.historyItems = []
        } else {
          self.historyItems = JSON.parse(data.data)
        }
      })
    },

    activated () {
      if (this.scroller) {
        this.scroller.scrollTop = this.offset
      }
    },
    watch: {
      historyItems: function (newobj, oldobj) {
        var str = JSON.stringify(newobj)
        store.setItem('search_history', str, function (data) {
          console.log('保存搜索历史,', data)
        })
      }
    },
    computed: {

    },
    methods: {
      search: function (item) {
        console.log('----------search', this)
        var first = this.historyItems[0]
        if (item !== first) {
          var a = []
          a.push(item)
          a.push(...this.historyItems)
          this.historyItems = a
          if (this.historyItems.length > 5) {
            this.historyItems = this.historyItems.slice(0, 5)
          }
          console.log('this.historyItems=', this.historyItems)
        }
        this.keyword = item
        this.fetch(item, 0)
      },
      fetch: function (keyword, flag) {
        let params = {}
        params.keyword = keyword

        let self = this
        this.isLoading = true
        if (flag === 0) {
          this.course_page = 1
          params.page = self.course_page
        } else {
          params.page = self.course_page + 1
        }
        console.log('this.params=', params)
        network.getCourseSearch(params, function (res) {
          self.isLoading = false
          if (res.ret === 1) {
            let data = res.data
            console.log('--- getSearchResult ---', data)
            if (flag === 0) {
              self.classItems = data
            } else {
              let a = []
              a.push(...self.classItems)
              a.push(...data)
              self.classItems = a
              self.course_page = self.course_page + 1
            }
            self.loadmore_flag = data.length !== 0
          } else {

          }
        })
      },
      onTagClick: function (item) {
        this.$refs.input1.search(item)
      },
      clearHistory: function () {
        this.historyItems = []
      },
      onBtnClick: function () {
        this.$refs.input1.search(this.$refs.input1.getValue())
      },
      onClose: function () {

      },
      onTeacherClick: function () {

      },
      onArticleClick: function () {

      },
      onClassLoad: function () {
        this.fetch(this.keyword, 1)
      },
      onArticleLoad: function () {

      },
      refresh: function () {
        if (this.classItems.length === 0) {
          this.fetch(this.keyword, 0)
        } else {
          this.fetch(this.keyword, 1)
        }
      },
      onTransition: function (showResult) {
        if (!showResult) {
          this.classItems = []
        }
      },
      onClassClick (item) {
        if (window.develop === 1) {
          var page = 'end'
          switch (item.status) {
            case 1:
              // reg
              page = 'reg'
              break
            case 3:
              // end
              page = 'end'
              break
            default:
              page = 'end'
              // end
              break
          }
          let url = window.wyeth_host + '/mobile/' + page
          url = url + '?cid=' + item.id
          window.location.href = url
        } else {
          this.$emit('onCourseClick')
          courseRoute(item)
        }
      },
      onScroll (ev) {
        if (this.scroller) {
          this.offset = -ev.contentOffset.y
        }
      }
    },
    updated () {
      this.scroller = document.querySelector('#scroller')
    }
  }
</script>

<style lang = "sass" scoped>
  @import "index"
</style>
