<template>
  <scroller >
    <div class = "o-mqrule-container">
      <image class = "rule-title-image" :src = "require('assets/icon-me-rule-title.png')"/>
      <OExpandList v-for = "list, i in listData" :key = "i" class = "o-mqrule-expand-list" :itemStyle = "itemStyle" :listStyle = "listStyle" @clickHeader = "expandClick" :index = "i">
        <div v-for = "item, index in list.items" slot = "expand" class = "o-mqrule-list-item">
          <image :src = "item.icon" class = "o-mqrule-header-icon"/>
          <div class = "o-mqrule-list-item-content">
            <text class = "o-mqrule-list-item-title">{{ item.title }}</text>
            <text class = "o-mqrule-list-item-detail">{{ item.detail }}</text>
          </div>
          <text v-if = "item.cost" class = "o-mqrule-list-item-title-1">{{ item.cost }}</text>
        </div>
        <div class = "o-mqrule-header" slot = "header">
          <image :src = "list.icon" class = "o-mqrule-header-icon"/>
          <text class = "o-mqrule-header-title">{{ list.title }}</text>
          <image ref = "arrow_down" class = "o-mqrule-header-i" :src = "require('assets/icon-me-arrow-down.png')"/>
        </div>
      </OExpandList>
    </div>
  </scroller>
</template>

<script>
  import OExpandList from '../../../components/expandList'
  import Base from '../../../mixins/base'
  const animation = weex.requireModule('animation')
  export default {
    mixins: [Base],
    components: {
      'OExpandList': OExpandList.weexComponent
    },
    props: {
      listData: {
        type: Array
      }
    },
    data () {
      return {
        listStyle: {
          'border-style': 'solid',
          'border-width': this.rpx(1, true),
          'border-color': '#ece1cd',
          'border-radius': this.rpx(10, true),
          'width': this.rpx(689, true),
          'margin-top': this.rpx(36, true),
          'position': 'relative'
        },
        itemStyle: {
          'width': this.rpx(689, true),
          'background-color': '#fff'
        }
      }
    },
    methods: {
      expandClick: function (index, state) {
        var degree = state ? 180 : 0
        animation.transition(this.$refs.arrow_down[index], {
          styles: {
            transform: 'rotate(' + degree + 'deg)',
            transformOrigin: 'center center'
          },
          duration: 200,
          timingFunction: 'ease',
          delay: 0
        })
      }
    }
  }
</script>

<style scoped lang = "sass">
  @import "index.scss"
</style>
