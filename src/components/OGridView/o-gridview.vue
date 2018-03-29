<template>
  <GridView class = "o-gridview-container" :clos = "cloumn" >
    <slot></slot>
  </GridView>
</template>

<script>
// 其它用法与vue相同

let gird = Vue.extend({
  render: function (createElement) {
    if(!this.$slots || !this.$slots.default){
      return
    }

    let children = this.$slots.default.filter(function (vn) {
      return vn.context !== null
    })
    if (!children || children.length === 0) {
      return
    }
    let len = children.length
    let a = parseInt(len / this.clos)
    let b = this.clos - len + a * this.clos

    children = children.map(function (item) {
      return createElement('div', {
        style: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }
      }, [item])
    })
    for (let i = 0; i < b; i++) {
      children.push(createElement('div', {
        style: {
          flex: 1
        }
      }, []))
    }
    len = children.length
    a = parseInt(len / this.clos)
    let list = []
    for (let i = 0; i < a; i++) {
      let nodes = children.slice(this.clos * i, this.clos * i + this.clos)
      list.push(createElement('cell', {
        style: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      }, nodes))
    }

    return createElement(
      'list',
      {
        on: {
          loadmore: this.loadmore,
          scroll: this.scroll
        }
      },
      list
    )
  },
  methods: {
    loadmore (event) {
      this.$emit('loadmore', event)
    },
    scroll (event) {
      this.$emit('scroll', event)
    }
  },
  props: {
    clos: {
      type: Number,
      default: function () {
        return 3
      }
    }
  }
})

export default {
  components: {
    GridView: gird
  },
  props: {
    cloumn: {
      type: Number,
      default: function () {
        return 3
      }
    }
  },
  data () {
    return {
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>
  .o-gridview-container{
  }
</style>
