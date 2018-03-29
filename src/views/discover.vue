<template>
  <OHSPage>
    <list class="discover" ref="list" loadmoreoffset="10" @loadmore="loadmore">

      <Calendar ref="Calendar" :sign="sign" @choseDay="choseDay"></Calendar>

      <div class="reward">
        <div class="header" style="position: relative;height:140px;flex-direction: row;justify-content: space-between;align-items: center;">
          <image class="icon" :src="require('assets/discover_gift.png')"/>
          <div class="content">
            <text class="content-title">MQ专享魔栗转转乐</text>
            <text class="subtitle">{{((new Date()).getMonth()+1)}}月大礼上线啦，0元拿好货</text>
          </div>
        </div>
        <div class="button" @click="gotoExchange()">
          <text class="title">前往抽奖</text>
        </div>
      </div>

      <Tabs :value="tab1" @input="v => tab1=v" class="tabs-content">
        <Tab label="我的足迹" value="one">
          <list>
              <cell v-for="(item,i) in networkParam[0].itemList" :key="i" @click="onItemClick(item)">
                <CourseCell :obj= "item"></CourseCell>
              </cell>
              <text :style="loadingStyle">{{footer_text}}</text>
          </list>

        </Tab>
        <Tab label="我的关注" value="two">
          <list>
              <cell v-for="(item,i) in networkParam[1].itemList" :key="i">
                <OHSDiscoverCell  :obj="item"></OHSDiscoverCell>
              </cell>
              <text :style="loadingStyle">{{footer_text}}</text>
          </list>
        </Tab>
      </Tabs>
    </list>
  </OHSPage>
</template>

<script>
import config from "../config.json";
import Base from "../mixins/base";
import network from "../modules/network/network";
import { courseRoute } from "../modules/tools";

import { OHSPage } from "../components-proj/comm/page";
import Calendar from "../components/calendar/calendar.vue";
import Tabs from "../components/OTab";
import Tab from "../components/OTab/o-tab";
import OHSDiscoverCell from "../components-proj/cms/discovercell";
import courseCell from "../components-proj/all/classCell";

module.exports = {
  mixins: [Base],
  preload($route) {
    return ["getDiscover"];
  },
  components: {
    OHSPage: OHSPage.weexComponent,
    Tabs: Tabs.weexComponent,
    Tab: Tab.weexComponent,
    Calendar,
    CourseCell: courseCell.weexComponent,
    OHSDiscoverCell: OHSDiscoverCell.weexComponent
  },
  data() {
    return {
      footer_text: "正在加载中...",
      isLoading: false,
      tab1: "one",
      date: null,
      networkParam: [
        {
          url: "getTraceCourse",
          page: 2,
          page_size: 10,
          itemList: []
        },
        {
          url: "getDynamicAndArticles",
          page: 2,
          page_size: 5,
          itemList: []
        }
      ],
      sign: {}
    };
  },
  computed: {
    loadingStyle() {
      return {
        alignSelf: "stretch",
        height: this.rpx(80, true),
        fontSize: this.rpx(24, true),
        alignItems: "center",
        justifyContent: "center",
        color: "#888888",
        listview: {},
        offset: 0,
        list: {}
      };
    }
  },
  methods: {
    depend() {
      return ["getDiscover"];
    },
    resolve() {
      let data = this.store("getDiscover").data;

      this.sign = data.sign;
      this.networkParam[0].itemList = data.my_trace;
      this.networkParam[1].itemList = this.dealDataSource(data.my_attention);
    },
    loadmore: function(e) {
      let index = this.tab1 === "one" ? 0 : 1;

      if (!this.isLoading && (index || !this.date)) {
        let params = this.networkParam[index];

        this.footer_text = "正在加载中...";

        this.isLoading = true;

        let self = this;
        network.getRequest(
          config.api[params.url],
          {
            page: params.page,
            page_size: params.page_size
          },
          function(res) {
            if (res.ret === 1) {
              let data = res.data;
              if (data.length === null || data.length < 1) {
                self.footer_text = "暂无更多数据";
              } else {
                self.footer_text = "";
              }

              if (index === 1) {
                data = self.dealDataSource(data);
              }

              if (params.page < 2) {
                params.itemList = data;
              } else {
                params.itemList.push(...data);
              }

              params.page = params.page + 1;
            } else {
              self.footer_text = "暂无更多数据";
            }
            self.isLoading = false;

            self.$refs.list.resetLoadmore();
          },
          true
        );
      }
    },
    choseDay(date) {
      this.date = date;

      if (this.date) {
        let params = this.networkParam[0];

        let self = this;

        self.isLoading = true;

        network.getTraceCourseByDate(
          date,
          function(res) {
            if (res.ret === 1) {
              let data = res.data;

              self.footer_text = "";

              params.page = 2;

              params.itemList = data;

              if (data.length > 0) {
                self.footer_text = "暂无更多数据";
              } else {
                self.footer_text = "当天没有学习记录哦~";
              }
            } else {
              self.footer_text = "当天没有学习记录哦~";
            }

            self.isLoading = false;
          },
          false
        );
      } else {
        this.tab1 = "one";
        this.networkParam[0].page = 1;
        this.loadmore();
      }
    },
    onItemClick(item) {
      courseRoute(item);
    },
    onPicItemClick(item) {
      this.jump("cmsPageInfo", { item });
    },
    dealDataSource: function(dataSource) {
      for (let i = 0; i < dataSource.length; i++) {
        let item = dataSource[i];
        if (parseInt(item["type"])) {
          // CMS
          item["avatar"] = item["author_avatar"] || "";
          item["name"] = item["account_id"] || "";
          item["date"] = item["showed"] || "";
          item["img"] = item["img"] || "";
          item["title"] = item["title"] || "";
          item["author"] = item["category_name"] || "";
        } else {
          // 课程动态
          item["avatar"] = item["teacher_avatar"] || "";
          item["name"] = item["teacher_name"] || "";
          item["date"] = item["start_day"] + " " + item["start_time"];
          item["img"] = item["img"] || "";
          item["title"] = item["title"] || "";
          item["author"] = item["teacher_name"] || "";
          item["desc"] = item["desc"] || "";
        }
      }
      return dataSource;
    },
    gotoExchange() {
      this.$router.push("./exchange");
    }
  }
};
</script>

<style lang="sass" scoped>
  @import './scss/discover.scss'
</style>
