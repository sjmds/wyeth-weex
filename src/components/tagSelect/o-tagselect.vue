<template>
  <scroller scroll-direction = "horizontal"  class = "o-tagSelect-container">
    <div v-for = "item,key in tags" @click = "onClick(key)" style = "justify-content: center">
      <OButton :text = "item"
               :radius = "31" :height='62'
               :ref = "'btn'+key"
               :borderWidth = "1"
               :highLight = "key === index"
               :style = "{marginLeft:rpx(6, true),
                 marginRight:rpx(6, true),
                 height:rpx(62, true)}"></OButton>
    </div>
  </scroller>
</template>

<script>
  // 其它用法与vue相同
  import OButton from '../OButton'
  import base from '../../mixins/base'
  const dom = weex.requireModule('dom')

  export default {
    components: {
      OButton: OButton.weexComponent
    },
    mixins: [base],
    props: {
      enable: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      tags: {
        type: Array,
        required: true
      },
      selectid: {
        type: Number,
        default: function () {
          return 0
        }
      }
    },
    computed: {
    },
    data () {
    	console.log('this.selectid=',this.selectid)
      return {
        index: this.selectid
      }
    },
    created () {
      this.rpx(11, true)
    },
    watch: {
      index: function (newid, oldid) {

      	let self = this


      	setTimeout(function () {
          let btn = self.$refs['btn' + newid]
          if (btn.length<1){
          	return
          }
          console.log('xxx newid=', newid, 'oldid=', oldid)
          dom.scrollToElement(btn, {offset: -300})
        },0)

        // this.$emit('onSelect',newid)
      }
    },
    methods: {
      setIndex (x) {
        console.log('this.selectid  setSelect index',x)
        this.index = x
      },
      onClick: function (key) {
        if (this.enable) {
          this.index = key
          this.$emit('onSelect', key)
        }
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
