<template>
  <div class = "ohs-dynamic-container">
    <image class = "ohs-dynamic-avatar" :src = "obj.teacher_avatar"/>
    <div class = "ohs-dynamic-info-container">
      <div class = "ohs-dynamic-info-linear">
        <text class = "ohs-dynamic-info-linear-name">{{ obj.teacher_name }}</text>
        <text class = "ohs-dynamic-info-linear-type">发布了课程:</text>
      </div>
      <text class = "ohs-dynamic-info-date">{{time}}</text>
      <text class = "ohs-dynamic-info-content">{{ obj.desc }}</text>
      <div class = "ohs-dynamic-info-course" @click = "onClick">
        <image class = "ohs-dynamic-info-course-img" :src = "obj.img"/>
        <div style = "flex: 1;align-items: stretch;justify-content: space-between">
          <text class = "ohs-dynamic-info-course-title">{{ obj.title }}</text>
          <text class = "ohs-dynamic-info-course-teacher">{{ obj.teacher_name }}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { courseRoute } from "../../../modules/tools";
export default {
  props: {
    obj: {
      type: Object
    }
  },
  computed: {
    time() {
      // let obj = this.obj.created_at
      // if (obj) {
      //   // 2017-07-31 16:36:31.000000
      //   let date = obj.date
      //   let arr = date.split(/[-: \/]/)
      //   arr[1] = arr[1] - 1
      //   let time = new Date(...arr)
      //   console.log('dynamic time', time)
      //   let t = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate()
      //   return t
      // }
      if (this.obj) {
        return this.obj.start_day + " " + this.obj.start_time;
      } else {
        return "";
      }
    }
  },
  methods: {
    onClick() {
      courseRoute(this.obj);
    }
  }
};
</script>

<style lang = "sass" scoped>
  @import "./index.scss"
</style>
