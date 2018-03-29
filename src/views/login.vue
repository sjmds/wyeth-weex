<template>
  <div>
    <!-- <text>login</text> -->
  </div>
</template>

<script>
import { beforeLoad } from '../modules/validate'

export default {
  // mixins: [Base],
  created () {
    beforeLoad()
    this.$router.push({ name: 'home' })

    // var self = this
    // store.getItem('lastView', function (e) {
    //   if (e.result === "failed" || e.data === "undefined") {
        // self.$router.push({ name: 'home' })
    //   } else {
    //     self.$router.push({ name: e.data })
    //   }
    // })
  }
}
</script>

<style>

</style>
