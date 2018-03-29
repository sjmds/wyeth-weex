<template>
  <OHSFullPage>
    <OListView :url="url" :params="params" :itemComponent="itemComponent" @onItemClick="onItemClick">
      <template slot="headerView">
        <OPanel title="惠妈300问" :titleSize="30" titleColor="#101010" :noextra="true" :height="81" :titlePaddingLeft="0" :paddingLeft="32" />
        <OBlock :height="2" bgColor="#eeeeee" :width="718" :marginLeft="32" />
      </template>
    </OListView>
  </OHSFullPage>
</template>

<script>
import { OHSFullPage } from '../../components-proj/comm/page/index'
import OListView from '../../components/OListView'
import OHSQuestionItem from '../../components-proj/search/question/index'

import OPanel from '../../components/panel/index'
import OBlock from '../../components/OBlock'
module.exports = {

  components: {
    OHSFullPage: OHSFullPage.weexComponent,
    OListView: OListView.weexComponent,
    OPanel: OPanel.weexComponent,
    OBlock: OBlock.weexComponent
  },
  data () {
    return {
      itemComponent: OHSQuestionItem.weexComponent,
      url: 'getQuestionSearch',
      params: {
        keyword: '',
        page: 1,
        page_size: 10
      }
    }
  },
  methods: {
    onItemClick () {

    }
  },
  created () {
    if (this.$route.params.keyword) {
      this.params.keyword = this.$route.params.keyword
    }
  }
}
</script>

<style>

</style>
