<template>
  <div class = "follow-container">
    <text class = "follow-title">你想关注哪些话题</text>
    <text class = "follow-subtitle">我们将根据你关注的话题定制首页推荐内容</text>
    <OGridView class = "follow-grid">
      <div class = "follow-grid-item" @click = "onItemClick(index)" v-for = "(item,index) in items" :key = "index">
        <image class = "follow-grid-cover" :src = "item.interest_img" />
        <div class = "follow-grid-select" v-if = "!selectTag[index]">
        </div>
        <image v-if = "selectTag[index]" class = "follow-grid-select-img" :src = "require('assets/select.png')" />
        <OShadow class = "follow-grid-shadow" direction = "to top" :startAlpha = "0.7" :width = "200" :height = "100" />
        <text class = "follow-grid-text">{{item.name}}</text>

      </div>
    </OGridView>
    <text @click = "onDone()" class = "follow-done">完成</text>
  </div>
</template>

<script>
// 其它用法与vue相同
import { OGridView } from '../components/OGridView'
import OBlock from '../components/OBlock'
import OShadow from '../components/OShadow'
import Base from '../mixins/base'
import event from '../modules/event'
import network from '../modules/network/network'
export default {
  mixins: [Base],
  preload ($route) {
    return ['getChooseTag']
  },
  components: {
    OGridView: OGridView.weexComponent,
    OBlock: OBlock.weexComponent,
    OShadow: OShadow.weexComponent
  },
  props: {},
  data () {
    return {
      items: [
      ],
      select: new Set(),
      imgStyle: {
        borderWidth: this.rpx(4, true),
        borderColor: '#ffffff',
        borderStyle: 'solid'
      }
    }
  },
  computed: {
    selectTag () {
      var tag = this.items.map(function () {
        return false
      })
      this.select.forEach(function (id) {
        tag[id] = true
      })
      return tag
    }
  },
  methods: {
    depend () {
      return ['getChooseTag']
    },
    resolve () {
      let date = new Date()
      console.log('resolve' + (date.getSeconds() * 1000 + date.getMilliseconds()))

      let data = this.store('getChooseTag').data

      this.items = data

      if (this.items.length > 4) {
        for (let i = 4; i < this.items.length; i++) {
          this.select.add(i)
        }
      }
      console.log('getChooseTag:', data)
    },
    onItemClick: function (index) {
      if (this.selectTag[index]) {
        this.select.delete(index)
        this.select = new Set(this.select)
      } else {
        this.select.add(index)
        this.select = new Set(this.select)
      }
    },
    onDone: function () {
      let tags = []
      for (let index of this.select) { // 遍历Set
        tags.push(this.items[index].id)
      }

      console.log('选择的tag:', tags)

      var self = this
      network.chooseTag({ tags: JSON.stringify(tags) }, function (res) {
        if (res.ret === 1) {
          event.sendEvent('toast', { type: 'success', text: '设置成功' })

          if (self.$route.params.to) {
            let to = self.$route.params.to
            self.$router.replace({ name: to.name, params: to.params })
          } else {
            self.$router.replace('/')
          }

          if (window.refreshRecom) {
            // 首页AJAX刷新推荐课程数据
            window.refreshRecom()
          }

          let userInfo = self.store('userInfo')
          console.log('userinfo:', userInfo)
          userInfo.chooseTag = true
          self.store('userInfo', userInfo)

          if (!userInfo.is_sign) {
            event.sendEvent('signup')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.follow-container {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: white;
  flex-direction: column;
  align-items: center;
}

.follow-title {
  margin-top: 75px;
  font-size: 44px;
  color: #333333;
}

.follow-subtitle {
  margin-top: 24px;
  font-size: 32px;
  color: #999999;
}

.follow-grid {
  margin-top: 33px;
  width: 654px;
  height: 700px;
}

.follow-grid-item {
  margin-top: 9px;
  margin-bottom: 9px;
  width: 200px;
  height: 200px;
  position: relative;
}

.follow-grid-cover {
  width: 200px;
  height: 200px;
  border-radius: 20px;
}

.follow-grid-select {
  border-style: solid;
  border-color: white;
  border-width: 4px;
  border-radius: 26px;
  position: absolute;
  top: 5px;
  right: 8px;
  width: 51px;
  height: 51px;
}

.follow-grid-select-img {
  position: absolute;
  top: 0px;
  right: 3px;
  width: 61px;
  height: 61px;
}

.follow-grid-text {
  position: absolute;
  left: 15px;
  bottom: 13px;
  lines: 1;
  text-shadow: #464646 2px 2px 2px;
  color: #ffffff;
  font-size: 26px;
}

.follow-grid-shadow {
  position: absolute;
  bottom: 0px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.follow-done {
  margin-top: 75px;
  width: 639px;
  height: 88px;
  line-height: 88px;
  color: #ffffff;
  font-size: 36px;
  border-radius: 10px;
  text-align: center;
  vertical-align: middle;
  background-image: linear-gradient(to top, #e7c25f, #e4be5b, #cea03f, #c69735);
}
</style>
