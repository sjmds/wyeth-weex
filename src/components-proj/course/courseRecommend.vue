<template>
  <div v-show = "recommendList.length > 0" id = "courseRecommend">
    <panel v-if="showPannel" :title = "title" :paddingLeft = "12" :paddingRight = "34" :titlePaddingLeft = "10" :extraPaddingRight = "27" :titleSize = "29" :extraSize = "25" :imgBg = "require('assets/header_bg.png')" :imgLeftWitdh = "8" titleColor = "#af730c" extraColor = "#666666" :imgLeftHeight = "38" :imgRightWitdh = "28" :imgRightHeight = "28" @more = "moreClick" :imgLeft = "require('assets/line.png')"></panel>
    <list class = "courseRecommend-list">
      <cell v-for = "(item,i) in recommendList" :key = "i" @click = "onItemClick(item)">
        <OHSClasscell :obj = "item"></OHSClasscell>
      </cell>
    </list>
  </div>
</template>

<script>
import panel from '../../components/panel'
import OHSClasscell from '../../components-proj/all/classCell'

import { courseRoute } from '../../modules/tools'

export default {
  components: {
    OHSClasscell: OHSClasscell.weexComponent,
    panel: panel.weexComponent
  },
  props: {
    showPannel: {
      type:Boolean,
      required:false,
      default:true
    },
    title: {
      type: String,
      required: false,
      default: '爱学习的妈妈都在看'
    },
    recommendList: {
      type: Array,
      required: true
    }
  },
  methods: {
    moreClick: function () {
      this.$router.push('/all')
    },
    onItemClick: function (item) {
      console.log('courseRecommend:', item)
      courseRoute(item)
    }
  }
}
</script>
