<template>
  <div style="background-color: white">
    <div class="ohs-paid-course-cell-container">
      <image class="ohs-paid-course-img" :src="obj.banner"/>
      <div class="ohs-paid-course-text-container">
        <div class="ohs-paid-course-title-container">
          <text class="ohs-paid-course-title">{{obj.detail.name}}</text>
          <text class="ohs-paid-course-desc">{{obj.detail.description}}</text>
        </div>
        <div class="ohs-paid-course-extra-contianer">
          <text class="ohs-paid-course-num">已有{{obj.bought_num}}人购买</text>
          <text class="ohs-paid-course-label">交易成功</text>
        </div>
      </div>
    </div>
    <OBlock :marginLeft="25" :marginRight="24" :height="1" bgColor="#eeeeee"></OBlock>
  </div>
</template>

<script>

  import OBlock from '../../../components/OBlock'
  export default {
    components: {
      OBlock: OBlock.weexComponent
    },
    props: {
      obj: {
        type: Object,
        required: true
      }
    },
    computed: {
    },
    methods: {
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
