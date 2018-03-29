<template>
  <div class = "ohs-taggroup-container">
    <OTagSelect :enable = "enable" :tags = "typeTags" ref = "s1" :selectid = "select[0]" @onSelect = "onTag1Select"></OTagSelect>
    <OTagSelect :enable = "enable" :tags = "stageTags" ref = "s2" :selectid = "select[1]" @onSelect = "onTag2Select"></OTagSelect>
    <OTagSelect :enable = "enable" :tags = "hotTags" ref = "s3" :selectid = "select[2]" @onSelect = "onTag3Select"></OTagSelect>
  </div>
</template>

<script>

  import Base from '../../../mixins/base'
  import OTagSelect from '../../../components/tagSelect'
  // 其它用法与vue相同
  export default {
    mixins: [Base],
    components: {
      OTagSelect: OTagSelect.weexComponent
    },
    props: {
      enable: {
        type: Boolean,
        default: function () {
          return true
        }
      },
      initSelect: {
        type: Array,
        default: function () {
          return [0, 0, 0]
        }
      },
      typeTags: {
        type: Array,
        required: true
      },
      stageTags: {
        type: Array,
        required: true
      },
      hotTags: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        tags1: ['最新', '推荐', '热门'],
        tags2: ['不限', '孕期', '0-12月', '12-24月', '24+月'],
        tags3: ['热门标签', '奶爸', '宝宝护理', '孕期营养'],
        select: this.initSelect
      }
    },
    methods: {
      setSelect (s) {
        this.select = s
        this.$refs.s1.setIndex(s[0])
        this.$refs.s2.setIndex(s[1])
        this.$refs.s3.setIndex(s[2])
      },
      onTag1Select: function (index) {
        this.select[0] = index
        this.$emit('onTagChange', this.select)
      },
      onTag2Select: function (index) {
        this.select[1] = index
        this.$emit('onTagChange', this.select)
      },
      onTag3Select: function (index) {
        this.select[2] = index
        this.$emit('onTagChange', this.select)
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
