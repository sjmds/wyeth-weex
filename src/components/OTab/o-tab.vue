<template>
  <div v-if = "actived" style = "flex: 1">
    <slot></slot>
  </div>
</template>
<script>

  import Base from '../../mixins/base'

  export default {
    mixins: [Base],
    name: 'OTab',
    props: {
      label: {
        type: String,
        required: true
      },
      value: {
        type: [String, Number, Boolean, Object, Array],
        required: true
      },
      icon: {
        type: [String, Number, Boolean, Object, Array],
        default: ''
      }
    },
    data () {
      return {
        $parent: null
      }
    },
    computed: {
      actived () {
        return this.$parent && this.$parent.value === this.value
      }
    },
    created () {
      console.log('xxx o-tab created')
      const modal = weex.requireModule('modal')

      let parent = this.$parent
      while (parent.$parent && parent.$options._componentTag !== 'Tabs') {
        parent = parent.$parent
      }
      if (parent.$options._componentTag !== 'Tabs') {
        modal.toast({ message: 'OTabs不能单独使用', duration: 0.3 })
        return
      }
      this.$parent = parent
      parent.addTab(this)
    },
    beforeDestroy () {
      this.$parent && this.$parent.removeTab(this)
    }
  }
</script>
