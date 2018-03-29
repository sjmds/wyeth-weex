<template>
  <OHSFullPage class = "myfollow-bg" >
    <scroller class = "myfollow-scroller">
      <div>
        <div class = "myfollow-header">
          <text class = "myfollow-header-text">你已关注</text>
        </div>
        <OHSTagsGroup :followItems = "followItems" :followed = "true" @closeClick = "unfollow"></OHSTagsGroup>
        <div class = "myfollow-header">
          <text class = "myfollow-header-text">点击添加更多关注</text>
        </div>
        <OHSTagsGroup :followItems = "unfollowItems" :followed = "false" @followTag = "followTag"></OHSTagsGroup>
      </div>
    </scroller>
  </OHSFullPage>
</template>

<script>
  import { OHSFullPage } from '../../components-proj/comm/page'
  import OHSTagsGroup from '../../components-proj/me/tagsGroup'
  import Base from '../../mixins/base'
  import event from '../../modules/event'
  import network from '../../modules/network/network'
  module.exports = {
    mixins: [Base],
    components: {
      OHSFullPage: OHSFullPage.weexComponent,
      OHSTagsGroup: OHSTagsGroup.weexComponent
    },
    data () {
      return {
        followItems: [],
        unfollowItems: []
      }
    },
    created () {
      console.log('ttt')
      this.fetch()
      event.sendEvent('tabbar_g', true)
    },
    updated () {
      event.sendEvent('tabbar_g', true)
    },
    destroyed () {
      console.log('destroyed')
      this.setFollow()
    },
    methods: {
      fetch () {
        var self = this
        network.getMyFollow({}, function (data) {
          console.log('myFollowData', data)
          var result = data.data
          self.followItems = result.concerned
          self.unfollowItems = result.not_concerned
        })
      },
      setFollow () {
        var length = this.followItems.length
        var tags = '['
        for (var i = 0; i < length; i++) {
          tags += this.followItems[i].id
          if (i !== length - 1) {
            tags += ','
          }
        }
        tags += ']'
        console.log(tags)
        network.setMyFollow({tags: tags}, function (data) {

        })
      },
      unfollow (item) {
        var length = this.followItems.length
        for (var i = 0; i < length; i++) {
          if (this.followItems[i] === item) {
            this.followItems.splice(i, 1)
            break
          }
        }
        this.unfollowItems.push(item)
      },
      followTag (item) {
        for (var i = 0; i < this.unfollowItems.length; i++) {
        	this.unfollowItems[i] === item ? this.unfollowItems.splice(i, 1) : ''
        }
        this.followItems.push(item)
      }
    }
  }
</script>

<style scoped>
  .myfollow-scroller {
    position: absolute;
    bottom: 0px;
    top: 0px;
    left: 0px;
    right: 0px;
  }
  .myfollow-bg {
    background-color: #f4f4f4;
  }
  .myfollow-header {
    background-color: #fff;
    height: 80px;
    justify-content: center;
    padding-left: 24px;
  }
  .myfollow-header-text {
    color: #eb7b09;
  }
  body {
    background-color: #f4f4f4;
  }
</style>
