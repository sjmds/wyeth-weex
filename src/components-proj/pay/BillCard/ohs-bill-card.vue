<template>
  <div style = "background-color: #ffffff">
    <OTextInfoCell :height = "116" keyText = "课程" :valueText = "courseName"></OTextInfoCell>
    <OBlock :marginLeft = "24" :marginRight = "25" :height = "1" bgColor = "#eeeeee"></OBlock>
    <OTextInfoCell :height = "116" keyText = "价格" :valueText = "price+'MQ'"></OTextInfoCell>
    <OBlock :marginLeft = "24" :marginRight = "25" :height = "1" bgColor = "#eeeeee"></OBlock>
    <OTextInfoCell :height = "116" keyText = "MQ余额" :valueText = "balance+'MQ'"></OTextInfoCell>
    <OBlock :marginLeft = "24" :marginRight = "25" :height = "1" bgColor = "#eeeeee"></OBlock>
    <div class = "tip-container">
      <image class = "tip-img" :src = "require('assets/tip.png')"/>
      <text class = "tip-text">{{remark}}</text>
    </div>
    <OBlock :marginLeft = "24" :marginRight = "25" :height = "1" bgColor = "#eeeeee"></OBlock>
    <div class = "total-container">
      <text class = "total-extra">共计{{courseNum}}节课 小计:</text>
      <text class = "total-num">{{total}}MQ</text>
    </div>
  </div>
</template>

<script>

  import OBlock from '../../../components/OBlock/index'
  import OTextInfoCell from '../../../components/OTextInfoCell/o-text-info-cell.vue'

  module.exports = {

    components: {
      OTextInfoCell,
      OBlock: OBlock.weexComponent
    },
    props: {
      courseName: {
        type: String,
        required: true
      },
      courseNum: {
        type: Number,
        required: true
      },
      balance: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      total: {
        type: Number,
        required: true
      },
      remark: {
        type: String,
        required: false,
        default: ''
      }
    },
    data () {
      return {}
    },
    computed: {
    },
    methods: {}
  }
</script>


<style lang = "sass" scoped>
  @import "./index.scss"
</style>
