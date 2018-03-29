<template>
  <div class="tags-group_container">
    <div v-for="item in followItems" :class="followed ? 'tags-group_tag_followed' : 'tags-group_tag_unfollowed'" @click="itemClick(item)">
      <text class="tags-groups_text">{{item.name}}</text>
      <image v-if="followed" :src="require('assets/icon-me-close.png')" class="tags-group_tag_close"/>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      followed: {
        type: Boolean
      },
      followItems: {
        type: Array
      }
    },
    methods: {
      itemClick (item) {
        if (this.followed) {
          this.$emit('closeClick', item)
        } else {
          this.$emit('followTag', item)
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
  @import "index.scss"
</style>
