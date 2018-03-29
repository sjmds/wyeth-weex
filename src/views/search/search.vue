<template>
  <OHSFullPage>
    <OHSSearchbar btnText="搜索" :hint="hint" :autofocus="true" :hotTags="hotTags" @onCourseClick="onCourseClick"></OHSSearchbar>
  </OHSFullPage>
</template>

<script>

import Base from '../../mixins/base'
import OHSSearchbar from '../../components-proj/search/searchbar/index'
import { OHSFullPage } from '../../components-proj/comm/page/index'
module.exports = {
  mixins: [Base],
  preload ($route) {
    return ['getSearchTag']
  },
  components: {
    OHSSearchbar: OHSSearchbar.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent
  },
  data () {
    return {
      hotTags: [],
      hint: '大脑发育',
      keepAlive: true
    }
  },
  created () {
    this.init()
  },
  watch: {
    initSelect (v1, v2) {
    }
  },
  methods: {
    init () {
      console.log(' ===  ===  === ', this.$route.params)
      if (this.$route.params) {
        this.hint = this.$route.params.hint
      }
      scrollTo(0, 0)
    },
    depend () {
      return ['getSearchTag']
    },
    resolve () {
      let data = this.store('getSearchTag').data
      console.log('--------getSearchTag-------', data)
      if (data) {
        this.hotTags = data.map(function (item) {
          return item.name
        })
      }
    },
    onCourseClick () {
      this.keepAlive = true
    }
  }
}
</script>

<style>

</style>
