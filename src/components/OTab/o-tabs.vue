<template>
  <div style="align-items: stretch">
    <div class="o-tab-nav" ref="tabs">
      <div v-for="(tab,i) in tabs" :key="i" class="o-tab" @click="selectTab(tab)">
        <CIcon v-if="tab.icon" class="o-tab_icon" :class="[tab.value === value? 'o-tab-active' : '']" :iconID="`${tab.icon}`"></CIcon>
        <text class="o-tab_text" :class="[tab.value === value? 'o-tab-active' : '']">{{tab.label}}</text>
      </div>
      <div class="o-tab-line" ref="line" :style="{width: rpx(136, true)}"></div>
    </div>
    <div style="flex: 1">
      <slot></slot>
    </div>
  </div>
</template>
<script>
  import CIcon from '../icon/C-Icon'
  import Base from '../../mixins/base'

  export default {
    mixins: [Base],
    name: 'OTabs',
    components: {
      CIcon
    },
    props: {
      // 属性值
      value: {
        type: [String, Number, Boolean, Object, Array],
        default: 0
      },
      // 图标
      icon: {
        type: [String, Number, Boolean, Object, Array],
        default: ''
      },
      // 默认颜色
      defaultcolor: {
        default: '#333;'
      },
      activecolor: {
        default: '#eb7b09'
      }
    },
    data () {
      console.log('xxx data')
      return {
        tabs: [],
        color: this.defaultcolor
        //        lineWidth: this.rpx(136,false)
      }
    },
    computed: {
      activeIndex () {
        return [
          this.tabs.map(function (tab) { return tab.value }).indexOf(this.value) || 0
        ]
      }
    },
    watch: {
      value (val) {
        this.$nextTick(function () {
          this.animateLine()
        })
      }
    },
    methods: {
      addTab (tab) {
        console.log('xxx addTab')
        let self=this
        setTimeout(function () {
          console.log('xxx push addTab')
          self.tabs.push(tab)
        }, 0)
      },
      removeTab (tab) {
        this.tabs.splice(this.tabs.indexOf(tab), 1)
      },
      selectTab (tab) {
        this.$emit('input', tab.value)
        this.$emit('change', tab.value)
      },
      animateLine () {
        const animation=weex.requireModule('animation')
        animation.transition(this.$refs.line, {
          duration: 300,
          timingFunction: 'ease-in-out',
          styles: {
            transformOrigin: 'center center',
            transform: `translateX(${this.activeIndex * 750 / this.tabs.length + (750 / this.tabs.length - 136) / 2}px)`
          }
        })
      }
    },
    created () {
      let t=this
      console.log('xxx tabs created')
      setTimeout(function () {
        t.$nextTick(function () {
          const dom=weex.requireModule('dom')
          dom.getComponentRect(this.$refs.tabs, function (option) {
            if (!option || option.result === false) {
              return
            }
            console.log('xxx animateLine')
            t.animateLine()
          })
        })
      }, 100)
    },
    activated () {
      console.log('xxx tabs activated')
    }

  }
</script>
<style lang="sass" scoped>
  @import 'o-tabs.scss'
</style>
