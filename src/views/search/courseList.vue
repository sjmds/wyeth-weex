<template>
  <OHSFullPage>
    <OListView :url="params.url" :params="params.params" :itemComponent="itemComponent" @onItemClick="onItemClick">
    </OListView>
  </OHSFullPage>
</template>

<script>

import { OHSFullPage } from '../../components-proj/comm/page/index'
import OListView from '../../components/OListView'
import OHSCourseCell from '../../components-proj/all/classCell'
import { courseRoute } from '../../modules/tools/index'
import Base from '../../mixins/base'
module.exports = {
  mixins: [Base],
  components: {
    OHSFullPage: OHSFullPage.weexComponent,
    OListView: OListView.weexComponent
  },
  data () {
    return {
      itemComponent: OHSCourseCell.weexComponent,
      params: {
        url: 'getCourseSearch',
        params: {
          keyword: '',
          page_size: 10
        }
      }
    }
  },
  methods: {
    onItemClick (item) {
      courseRoute(item)
    }
  },
  created () {
    if (this.$route.params) {
      this.params = Object.assign(this.params, this.$route.params)
    }
  }
}
</script>

<style>

</style>
