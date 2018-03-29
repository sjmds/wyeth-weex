<template>
  <OHSFullPage>
    <OListView :url="url" :params="params" :itemComponent="itemComponent" @onItemClick="onItemClick"></OListView>
  </OHSFullPage>
</template>

<script>

import OHSDynamicCell from '../../components-proj/me/dynamicCell'
import { OHSFullPage } from '../../components-proj/comm/page'
import OListView from '../../components/OListView'

module.exports = {
  components: {
    OListView: OListView.weexComponent,
    OHSFullPage: OHSFullPage.weexComponent
  },
  data () {
    return {
      url: 'getUserDynamic',
      params: {
        page: 1,
        page_size: 10
      },
      itemComponent: OHSDynamicCell.weexComponent
    }
  },
  methods: {
    onItemClick (item) {
    }
  }
}
</script>

<style>

</style>
