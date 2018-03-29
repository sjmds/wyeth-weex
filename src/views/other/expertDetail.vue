<template>
  <div id="expertDetail">
    <OSlider :items="imageList_top" :width="750" :interval="3000" :autoPlay="true" :height="272"></OSlider>
    <Usercell :userInfo="userInfo" @clickConcern="clickConcern"></Usercell>
    <text class="expertDetail-content-text">{{content}}</text>
    <CourseRecommend title="主要课程" :recommendList="recommendList"></CourseRecommend>
    <OBlock :width="750" :height="100" bgColor="rgba(0,0,0,0)"></OBlock>
    <button class="expertDetail-button" @click="clickSubscribe" :disabled="subscribeStyles[isScribe].buttonEnable" :style="subscribeStyles[isScribe].buttonImage">{{subscribeStyles[isScribe].buttonTitle}}</button>
  </div>
</template>

<script>
import event from '../../modules/event'
import network from '../../modules/network/network'

import OSlider from '../../components/OSlider'
import Usercell from '../../components/usercell'

import { CourseRecommend } from '../../components-proj/course'
import OBlock from '../../components/OBlock'
import base from '../../mixins/base'

export default {
  mixins: [base],
  components: {
    OSlider: OSlider.weexComponent,
    Usercell: Usercell.weexComponent,
    CourseRecommend: CourseRecommend.weexComponent,
    OBlock: OBlock.weexComponent
  },
  data () {
    return {
      imageList_top: [],
      userInfo: {
        'teacher_id': 52,
        'teacher_name': '芮溧',
        'teacher_position': '讲师',
        'teacher_hospital': '昆明医科大学公共卫生学院营养与食品科学系',
        'teacher_desc': '毕业于四川大学华西公共学院，营养学硕士\r\n昆明医科大学公共卫生学院营养系，讲师。\r\n2008年美国耶鲁大学访问学者。\r\n中国营养学会09年营养领导才能培训优秀学员\r\n2012年美国约翰霍普金斯大学访问学者。\r\n昆明市五华区妇幼保健中心，特聘营养咨询专家。',
        'teacher_avatar': '//7xk3aj.com1.z0.glb.clouddn.com/wyethcourse/7f424bc88216ac239762edd9811708db.jpg',
        'concern': 0
      },
      content: '母乳营养最全面，那么母乳喂养到底有哪些需要注意的地方呢？不同阶段的母乳又有什么不同，如何解决母乳不够的问题，听医生说听医生说听医生说听医生说听医生说听医生说听医生说",',
      recommendList: [],
      subscribeStyles: [
        {
          buttonEnable: false,
          buttonTitle: '一键订阅',
          buttonImage: 'backgroundImage: linear-gradient(to right, #e7c25f, #e4be5b,#cea03f,#c69735)'
        },
        {
          buttonEnable: true,
          buttonTitle: '已订阅',
          buttonImage: 'backgroundImage: linear-gradient(to right,#dddddd,#dddddd)'
        }
      ],
      isScribe: 0
    }
  },
  created () {
    var self = this
    network.getCourse({
      type: 0,
      time: 0,
      tag: '热门标签',
      page: 0,
      page_size: 3
    }, function (res) {
      if (res.ret === 1) {
        self.recommendList = res.data
      }
    })
  },
  methods: {
    clickSubscribe: function () {
      event.sendEvent('toast', { type: 'success', text: '订阅成功' })
      this.isScribe = 1
    },
    clickConcern: function (e) {
      if (e.teacher_id === this.userInfo.teacher_id) {
        this.userInfo.concern = e.concern
      }
    }
  }
}
</script>

<style scoped>
#expertDetail {
  background-color: #f5f5f5;
}

#expertDetail .expertDetail-content-text {
  position: relative;
  width: inherit;
  background-color: #ffffff;
  padding: 20px 40px;
  font-size: 30px;
  text-align: left;
  border-top-width: 1px;
  border-top-color: #eeeeee;
  border-top-style: solid;
}

#expertDetail .expertDetail-button {
  position: fixed;
  bottom: 0px;
  width: 750px;
  height: 100px;
  /* background-image: linear-gradient(to right, #e7c25f, #e4be5b,#cea03f,#c69735);
     background-color: #dddddd;  */
  text-align: center;
  color: white;
}
</style>
