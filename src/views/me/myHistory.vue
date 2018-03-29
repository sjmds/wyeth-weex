<template>
  <OHSFullPage>
    <Tabs :value = "tab1" @input = "v => tab1 = v" class = "tabs-container">
      <Tab label = "课程" value = "one">
        <OListView style = "background-color: #f0efee" :url = "url" :params = "params" :itemComponent = "itemComponent" @onItemClick = "onItemClick"></OListView>
      </Tab>
      <Tab label = "发现图文" value = "two">
        <OListView style = "background-color: #f0efee" :url = "picUrl" :params = "picParams" :itemComponent = "picComponent"
                    @onItemClick = "onPicItemClick"></OListView>
      </Tab>
    </Tabs>
    <!--<OListView :url = "url" :params = "params" :itemComponent = "itemComponent" @onItemClick = "onItemClick"></OListView>-->

  </OHSFullPage>
</template>

<script>
import Tabs from '../../components/OTab'
import Tab from '../../components/OTab/o-tab'

import courseCell from '../../components-proj/all/classCell'
import { OHSFullPage } from '../../components-proj/comm/page'
import OListView from '../../components/OListView'
import { courseRoute } from '../../modules/tools'

import OCellSTitleBGCellContainer from '../../components-proj/cms/cmsCell/O-CellS-Title-BG-Cell-Container.vue'

import Base from '../../mixins/base'
module.exports = {
  mixins: [Base],
  components: {
    OListView: OListView.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent,
    Tabs: Tabs.weexComponent,
    Tab: Tab.weexComponent,
    OCellSTitleBGCellContainer
  },
  data () {
    return {
      tab1: 'one',
      url: 'getTraceCourse',
      params: {
        page: 1,
        page_size: 10
      },
      picUrl: 'getSaveArticles',
      picParams: {
        page: 1,
        page_size: 5
      },
      itemComponent: courseCell.weexComponent,
      picComponent: OCellSTitleBGCellContainer
    }
  },
  methods: {
    onItemClick (item) {
      courseRoute(item)
    },
    onPicItemClick (item) {
      this.jump('cmsPageInfo', { item })
    }
  }
}
</script>

<style scoped>
.tabs-container {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
}
</style>
