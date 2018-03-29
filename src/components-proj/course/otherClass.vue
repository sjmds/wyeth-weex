<template>
  <div v-show="items.length > 0" class="o-cells-container">
    <panel  :title="title" :paddingLeft = "12" :paddingRight = "34" :titlePaddingLeft = "10" :extraPaddingRight = "27" :titleSize = "29" :extraSize = "25" :imgBg = "require('assets/header_bg.png')" :imgLeftWitdh = "8" titleColor = "#af730c" extraColor = "#666666" :imgLeftHeight = "38" :imgRightWitdh = "28" :imgRightHeight = "28" :imgLeft = "require('assets/line.png')" :noextra = "true"></panel>
    <div class="o-cells-container-main">
      <div class="o-cells-container-item" v-for="(item,index) in items" :key="index" @click="onItemclick(item)">
        <div>
          <div class="o-cells-cover">
            <image class="o-cells-cover-img" :src="item.img.indexOf('imageView')>0?item.img:item.img+'?imageView2/1/w/220/h/220'"/>
            <div class="o-cells-cover-mask" style="background-image:linear-gradient(to top,RGBA(48,48,48,0.5),RGBA(255,255,255,0));"></div>
            <image class="o-cells-cover-num-icon" :src="require('assets/love.png')"/>
            <text class="o-cells-cover-num" :lines="1">{{num2str(item.hot)}}</text>
          </div>
          <text class="o-cells-title" :lines="2">{{item.title}}</text>
        </div>
        <div>
          <div class="o-cells-name-desc">
            <div class="o-cells-name-div">
              <text class="o-cells-name" :lines="1">{{item.teacher_name}}</text>
            </div>
            <div class="o-cells-desc-div">
              <text class="o-cells-desc" :lines="1">{{item.teacher_position}}</text>
            </div>
          </div>
          <div class="o-cells-class-tag">
            <image class="o-cells-tag-img" :src="require('assets/tag.png')"/>
            <text class="o-cells-tag-txt" :lines="1">{{item.tag}}</text>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import CIData from "../../modules/CIData/index"

import panel from '../../components/panel'

import { courseRoute } from '../../modules/tools'

// 其它用法与vue相同
export default {
  components: {
    panel: panel.weexComponent
  },
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      imgHeader: require('assets/header_bg.png'),
      titleTxt: this.title
    }
  },
  mounted() {
    this.items.forEach(function(item) {
      CIData.recActionExpose(item)
    }, this); 
  },
  methods: {
    onItemclick: function(item) {
      courseRoute(item,{otherClass: this.items})
    }
  }
}
</script>

<style lang = "sass" scoped>
  @import "otherClass"
</style>
