/**
 * Created by admin on 17/8/3.
 */
<template>
  <div>
    <!--<OHSSearchTab :hintText = "hintText" @onClick = "onSearchClick"></OHSSearchTab>-->
  </div>

</template>

<script>
// 其它用法与vue相同
import OHSSearchTab from '../components-proj/search/searchTab'
import Base from '../mixins/base'
export default {
  mixins: [Base],
  components: {
    OHSSearchTab: OHSSearchTab.weexComponent
  },
  props: {},
  data () {
    return {
      hintText: '大脑发育'
    }
  },
  created () {
    if (document.getElementById('static')) {
      document.getElementById('static').style.display = ''
    }

    this.hintText = window.app_config.search_placeholder
  },

  methods: {
    onSearchClick () {
      this.$router.push({ name: 'search', params: { hint: this.hintText } })
    }
  }
}
</script>

<style lang = "sass" scoped>

</style>
