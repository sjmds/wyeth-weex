<template>
  <OPopupWindow class="ohs-qiandao-window" :hasCancel="false" @onDoneClick="onClick" title="签到">
    <div class="ohs-qiandao-content">
      <text class="ohs-qiandao-text1">恭喜签到成功,获得MQ+20</text>
      <text class="ohs-qiandao-text2">专属积分MQ(魔力值),可以兑换精彩福利和<br/>付费内容,敬请期待~</text>
      <!--<text class="ohs-qiandao-text2">*当妈妈不仅要有EQ、IQ还要有魔栗MQ哦</text>-->
      <text @click="clickRule" class="ohs-qiandao-text3">点击查看"MQ规则"</text>
    </div>
  </OPopupWindow>
</template>

<script>
// 其它用法与vue相同
import OPopupWindow from '../../../components/OPopupWindow'
export default {
  components: {
    OPopupWindow: OPopupWindow.weexComponent
  },
  props: {},
  data () {
    return {}
  },
  methods: {
    onClick () {
      this.$emit('onClick')
    },
    clickRule () {
      this.$emit('clickRule')
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "index"
</style>
