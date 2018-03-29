<template>
  <div id = "courseDetail">
    <panel v-if = "showPannel" :title = "title" :paddingLeft = "12" :paddingRight = "34" :titlePaddingLeft = "10" :extraPaddingRight = "27" :titleSize = "29" :extraSize = "25" :imgBg = "require('assets/header_bg.png')" :imgLeftWitdh = "8" titleColor = "#af730c" extraColor = "#666666" :imgLeftHeight = "38" :imgRightWitdh = "28" :imgRightHeight = "28" :imgLeft = "require('assets/line.png')" :noextra = "true"></panel>
    <!-- <div ref = "courseDetailContent" class = "courseDetail-content" :style = "{height: contentHeight}">
                                                                                                                                                                                                                          <image class = "courseDetail-content-image" v-for = "(imgSrc, i) in details" :key = "i" :src = "imgSrc"/>
                                                                                                                                                                                                                      </div> -->
    <div class = "courseDetail-content"></div>

    <!-- <div class = "courseDetail-footer" v-show = "details.length > 1" @click = "showAll">
                                                                                                                                                                                                                          <image ref = "arrow" class = "courseDetail-footer-image" :src = "require('assets/arrow_down.png')"/>
                                                                                                                                                                                                                      </div> -->
  </div>
</template>

<script>
  import panel from '../../components/panel'
  import Base from '../../mixins/base'

  const animation = weex.requireModule('animation')
  export default {
    mixins: [Base],
    components: {
      panel: panel.weexComponent
    },
    props: {
      title: {
        type: String,
        required: false,
        default: '课程详情'
      },
      details: {
        type: String,
        required: false,
        default: ''
      },
      showPannel: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data () {
      return {
        imgHeader: require('assets/header_bg.png'),
        titleTxt: this.title,
        contentHeight: this.rpx(0, true),
        isShowAll: false
      }
    },
    created () {
      // if (this.details.length > 0) {
      //     this.contentHeight = this.rpx(1000, true)
      // }
    },
    mounted () {
    },
    watch: {
      details (val) {
        if (val) {
          var divTmp = document.createElement('div')
          divTmp.innerHTML = val

          let children = divTmp.childNodes
          for (let i = 0; i < children.length; i++) {
            this.getChildren(children[i])
          }

          // let rep = divTmp.innerHTML.replace(/\position\:\sstatic/g, "position:relative;align-items:center;");

          document.querySelector('.courseDetail-content').innerHTML = divTmp.innerHTML

          // this.$nextTick(function () {
          //     console.log('rrr:', document.querySelector('.courseDetail-content').clientHeight)
          // })
        }
      }
    },
    methods: {
      getChildren (dom) {
        var self = this
        self.dealDom(dom)
        let children = dom.childNodes
        for (let i = 0; i < children.length; i++) {
          self.getChildren(children[i])
        }
      },
      dealDom (dom) {
        // console.log('yyyy ', dom)
        if (dom.tagName === 'SPAN' || dom.tagName === 'STRONG' || dom.tagName === 'P' || dom.tagName === 'SECTION') {
          this.dealDomText(dom)
          this.dealDomImg(dom)
        } else if (dom.tagName === 'IMG' || dom.tagName === 'IMAGE') {
          this.dealDomImg(dom)
        }
      },
      dealDomText (dom) {
        if (!dom.innerText || dom.innerText.length === 0 || dom.innerText === ' ' || dom.innerText.replace(/(^s*)|(s*$)/g, '').length === 0) {
          dom.style.fontSize = 0
        } else {
          if (!dom.style.fontSize) {
            if (dom.parentNode && dom.parentNode.style.fontSize) {
              dom.style.fontSize = 'inherit'
            } else {
              dom.style.fontSize = this.rpx(16 * 2, true)
            }
          } else {
            if (dom.style.fontSize.indexOf('em') >= 0) {
              dom.style.fontSize = this.rpx(parseFloat(dom.style.fontSize) * 16 * 2, true)
            } else {
              dom.style.fontSize = this.rpx(parseFloat(dom.style.fontSize) * 2, true)
            }
          }

          dom.style.textAlign = dom.style.textAlign || 'inherit'

          dom.style.color = dom.style.color || 'inherit'

          if (dom.style.lineHeight) {
            if (dom.style.lineHeight.indexOf('px') > 0) {
              dom.style.lineHeight = ''
            }
          } else if (dom.parentNode && dom.parentNode.style.lineHeight) {
            dom.style.lineHeight = dom.parentNode.style.lineHeight
          }
        }
      },
      dealDomImg (dom) {
        dom.style.maxWidth = this.rpx(700, true)

        if (dom.style.width) {
          if (dom.style.width === '100%') {

          } else {
            dom.style.width = this.rpx(dom.style.width / 640 * 750, true)
          }
        } else {
          if (dom.parentNode && dom.parentNode.style.width && dom.parentNode.style.padding) {
            dom.style.width = this.rpx(dom.parentNode.style.width / 640 * 750 - parseFloat(dom.parentNode.style.paddingRight) - parseFloat(dom.parentNode.style.paddingLeft), true)
          } else {
            dom.style.width = 'inherit'
          }
        }
      },
      moreClick: function () {
        this.$router.push('/all')
      },
      showAll: function () {
        let arrow = this.$refs.arrow

//      let content = this.$refs.courseDetailContent

        if (this.isShowAll) {
          this.contentHeight = this.rpx(1000, true)
          this.rotation(arrow, 0, 0.3)
          // this.changeHeight(content, this.rpx(1000, true), 3)
        } else {
          this.contentHeight = this.rpx(1000 * this.details.length, true)
          this.rotation(arrow, 180, 0.3)
          // this.changeHeight(content, this.rpx(1000 * this.details.length, true), 3)
        }
        this.isShowAll = ~this.isShowAll
      },
      rotation: function (obj, deg, duration) {
        animation.transition(obj, {
          styles: {
            transform: 'rotate(' + deg + 'deg)',
            transformOrigin: 'center center'
          },
          duration: duration,
          timingFunction: 'linear'
        }, function () {

        })
      },
      changeHeight: function (obj, height, duration) {
        animation.transition(obj, {
          styles: {
            height: height
          },
          duration: duration,
          timingFunction: 'linear'
        }, function () {

        })
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./courseDetail.scss"
</style>
