<template>
  <!--<div class = "o-cells-title-bg-cell" v-on:click = "click(articleaddress)">-->
  <div class = "o-cells-title-bg-cell" @click = "onclick">
    <div class = "topmsg">
        <div class = "category_container">
            <image :src = "author_avatar" class = "topmsg-logo1__image"/>
            <text class = "topmsg-word__text">{{ categoryname }}</text>
        </div>

        <div class = "views_container">
            <image :src = "logoUrl2" class = "topmsg-logo2__image"/>
            <text class = "topmsg-readcounter__text">{{ counter }}</text>
        </div>
    </div>
    <div class = "middlemsg">
      <image class = "middlemsg-background__image" :src = "imgaddress"/>
      <div class = "middlemsg-surface">
        <text class = "middlemsg-title__text">{{ title }}</text>
        <text class = "middlemsg-articletime__text">{{ uploadtime }}</text>
      </div>
    </div>
    <div class = "bottommsg"></div>
  </div>
</template>

<script>
  import EVENT from '../../../const/event'

  /**
   * 信息展示，点击信息会有跳转
   */
  export default {
    props: {
      avatar: {
        type: String,
        required: false,
        default: require('assets/default_cms_icon_1.png') 
      },
      /**
       * 背景图片地址
       */
      imgaddress: {
        type: String,
        required: true
      },
      /**
       * 阅读量
       */
      readcounter: {
        type: Number,
        required: true
      },
      /**
       * 显示的文章标题
       */
      title: {
        type: String,
        required: true
      },
      /**
       * 文章上传的时间
       */
      articletime: {
        type: String,
        required: true
      },
      /**
       * 跳转的文章地址
       */
      articleaddress: {
        type: String,
        required: true
      },
      /**
       * 文章分类
       */
      categoryname: {
        type: String,
        required: true
      }
    },

    data () {
      return {
        /**
         * 两个logo的地址
         */
        logoUrl1: '',
        logoUrl2: '',
        /**
         * 显示的文章上传时间
         */
        uploadtime: '',
        /**
         * 显示的阅读量
         */
        counter: '0',
        /**
         * 显示的年月日
         */
        year: '0',
        mon: '0',
        day: '0',
        default_avatar: require('assets/default_cms_icon_1.png')
      }
    },

    methods: {
      /**
       * 点击跳转，同时记录阅读量
       */
      click (e) {
        this.counter++
        this.$emit(EVENT.MESSAGE, this.counter)
        console.log(e)
      },
      onclick (e) {
        this.$emit('onClick', e)
      }
    },

    /**
     * 渲染前将时间进行处理
     */
    created: function () {
      this.counter = this.readcounter
      var date = new Date()
      var date1 = new Date(this.articletime)
      var time = (date.getTime() - date1.getTime()) / 3600000
      if (time < 24) {
        this.uploadtime = Math.round(time) + '小时前'
      } else {
        this.year = date1.getFullYear()
        if (date1.getMonth() < 9) {
          this.mon = '0' + (date1.getMonth() + 1)
        } else {
          this.mon = (date1.getMonth() + 1)
        }
        if (date1.getDate() < 10) {
          this.day = '0' + date1.getDate()
        } else {
          this.day = date1.getDate()
        }
        this.uploadtime = this.year + '年' + this.mon + '月' + this.day + '日'
      }
    },
    computed: {
      author_avatar: function () {
        if(this.avatar && this.avatar.length > 0){
          return this.avatar
        }
        // else{
        //   return this.default_avatar
        // }
      }
    }
  }
</script>

<style lang = "sass" scoped>
  @import './O-CellS-Title-BG-Cell'
</style>
