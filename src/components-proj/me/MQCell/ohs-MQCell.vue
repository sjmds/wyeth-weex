<template>
  <div class="o-mqcell-container">
    <div class="o-mqcell-line-container">
      <div class="o-mqcell-line-dot"></div>
      <div class="o-mqcell-line-line"></div>
    </div>
    <div class="o-mqcell-main-container">
      <div class="o-mqcell-main-date-container">
        <text class="o-mqcell-main-date-time"> {{MQInfo.created_at}} </text>
        <text class="o-mqcell-main-date-date"> {{MQInfo.day}} </text>
      </div>
      <div class="o-mqcell-main-detail-container">
        <text :class="MQInfo.mq >= 0 ? 'o-mqcell-main-detail-in' : 'o-mqcell-main-detail-out'"> {{MQInfo.mq >= 0 ? '+'
          : '-'}} {{ Math.abs(MQInfo.mq) }}MQ</text>
        <!--<text class="o-mqcell-main-detail-out">-{{ MQInfo.mq }}MQ</text>-->
        <text class="o-mqcell-main-detail-left">余额：{{MQInfo.balance}} </text>
        <text class="o-mqcell-main-detail-info">{{ MQInfo.event }}</text>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      MQInfo: {
        type: Object
      }
    }
  }
</script>

<style scoped lang="sass">
  @import "./index.scss"
</style>
