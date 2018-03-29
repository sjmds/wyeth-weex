<template>
  <OHSFullPage>
    <OListView style="background-color: #f0efee"
               :url="url"
               :params="params"
               :itemComponent="itemComponent"
               @onItemClick="onItemClick">
      <OBlock :height="11" slot="headerView" bgColor="#eeeeee"></OBlock>
    </OListView>
  </OHSFullPage>
</template>

<script>
  import OListView from '../components/OListView'
  import {OHSFullPage} from '../components-proj/comm/page'
  import OHSPaidCourseCell from '../components-proj/me/paidCourseCell'
  import OBlock from '../components/OBlock'
  module.exports = {
    components: {
      OHSFullPage: OHSFullPage.weexComponent,
      OHSPaidCourseCell: OHSPaidCourseCell.weexComponent,
      OListView: OListView.weexComponent,
      OBlock: OBlock.weexComponent
    },
    data () {
      return {
        itemComponent: OHSPaidCourseCell.weexComponent,
        url: 'getBoughtCat',
        params: {
          page_size: 10
        }
      }
    },
    methods: {
      onItemClick (item) {
        this.$router.push({name: 'courseSeries', params: {id: item.detail.id}})
      }
    }
  }
</script>

<style>

</style>
