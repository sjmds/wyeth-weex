 <template>
  <div class = "o-img-text-panel-container" @click = "itemClick">
    <image
      class = "o-img-text-panel-image"
      :src = "panelInfo.iconSrc"
      :style = "panelInfo.imgStyle"/>
    <div class = "o-img-text-panel-container-text">
      <text class = "o-img-text-panel-text-title">{{ panelInfo.title }}</text>
      <text class = "o-img-text-panel-text-content">{{ panelInfo.content }}</text>
    </div>
    <div class = "o-img-text-panel-divider"></div>
  </div>
</template>

<script>
  export default {
    props: {
      panelInfo: {
        type: Object
      }
    },
    methods: {
      itemClick () {
        this.$emit('itemClick')
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
