<template>
  <div class = "chargecell" @click = "clickChargeCell" :class = "selected === item.id?'chargecell-selected':'chargecell-normal'">
    <text class = "price">{{item.price + '元'}}</text>
    <text class = "mq">{{item.mq + 'MQ'}}</text>
  </div>
</template>

<script>

  export default {
    props: {
      item: {
        type: Object,
        require: true,
        default: {
          id: 0,
          price: 0,
          mq: 0
        }
      },
      selected: {
        type: Number,
        require: false,
        default: 0
      }
    },
    data () {
      return {
      }
    },
    methods: {
      clickChargeCell () {
        this.$emit('clickChargeCell', this.item.id)
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./chargecell.scss"
</style>
