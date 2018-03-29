<template>

  <OHSFullPage>

    <OHSQuestionHeader :title="title" :num="num" :keyword="keyword"></OHSQuestionHeader>
    <OBlock  :height="16" bgColor="#eeeeee"></OBlock>

    <OHSQuestionContent :content="answer"></OHSQuestionContent>
    <OBlock  :height="16" bgColor="#eeeeee"></OBlock>
    <CourseRecommend :recommendList="recomClass"></CourseRecommend>

    <OSlider v-show="broadcast.length > 0" :items="broadcast" :width="750" :interval="3000" :autoPlay="true" :height="200" :showIndicator="false"></OSlider>

  </OHSFullPage>

</template>

<script>
  import { OHSFullPage } from '../../components-proj/comm/page'
  import OBlock from '../../components/OBlock'
  import {OHSQuestionHeader, OHSQuestionContent} from '../../components-proj/question'
  import {CourseRecommend} from '../../components-proj/course'
  import OSlider from '../../components/OSlider'
  import network from '../../modules/network/network'
  module.exports = {
    components: {
      OHSQuestionHeader: OHSQuestionHeader.weexComponent,
      OBlock: OBlock.weexComponent,
      OHSQuestionContent: OHSQuestionContent.weexComponent,
      CourseRecommend: CourseRecommend.weexComponent,
      OHSFullPage: OHSFullPage.weexComponent,
      OSlider: OSlider.weexComponent
    },
    created () {
      this.fetch();
    },
    data () {
      return {
        title: '',
        num: 0,
        keyword:'',
        answer: '',
        recomClass: [],
        broadcast: []
      }
    },
    methods: {
      fetch: function () {
        let self = this;
        let params = {};

        params.tid = this.$route.params.id;

        network.getTagQuestion(params, function (res) {
          if (res.ret == 1) {
            let data = res.data;
            self.title = data.tag_question.question;
            self.num = data.tag_question.scan_num;
            self.keyword = data.tag_question.keyword;
            self.answer = data.tag_question.answer;
            self.recomClass = data.recomClass;
          }
        });
        console.log(params);
      }
    }
  }
</script>

<style>

</style>
