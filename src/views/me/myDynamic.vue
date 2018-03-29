<template>
  <OHSFullPage>
    <list id="cmsList" @scroll="onScroll" loadmoreoffset="10" @loadmore="onloading">
    <OHSDiscoverCell v-for = "(item,i) in itemsList" :obj="item" :key="i"></OHSDiscoverCell>
      <text :style="loadingStyle">{{footer_text}}</text>
    </list>
  </OHSFullPage>
</template>

<script>
import Base from "../../mixins/base";
import CIData from "../../modules/CIData";

import network from "../../modules/network/network";
import { OHSFullPage } from "../../components-proj/comm/page";
import OHSDiscoverCell from "../../components-proj/cms/discovercell";

export default {
  mixins: [Base],
  preload($route) {
    return ["getDynamicAndArticles.1"];
  },
  components: {
    OHSFullPage: OHSFullPage.weexComponent,
    OHSDiscoverCell: OHSDiscoverCell.weexComponent
  },
  data: function() {
    return {
      itemsList: [],
      categoryName: "",
      refreshing: false,
      showLoading: "hide",
      itemLength: 0,
      maxNum: false,
      page: 1,
      pageSize: 6,
      keepAlive: true,
      scrollTop: 0,
      cmsList: Object,
      footer_text: "正在加载中..."
    };
  },
  created() {},
  updated() {
    this.cmsList = document.querySelector("#cmsList");
  },
  activated() {
    if (this.cmsList) {
      this.cmsList.scrollTop = this.scrollTop;
    }
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
        offset: 0
      };
    }
  },
  methods: {
    depend() {
      console.log("info--depend");
      return ["getDynamicAndArticles." + this.page];
    },
    resolve() {
      let data = this.store("getDynamicAndArticles." + this.page).data;
      console.log(
        "!!!!!! CMS:",
        this.store("getDynamicAndArticles." + this.page)
      );

      this.dealDataSource(data)

      this.itemsList = data;
    },
    /* 上拉加载更多 */
    onloading(event) {
      console.log("--------------onloading");
      this.fetch(true);
    },
    fetch(isLoadMore) {
      let p = 1;

      if (isLoadMore) {
        p = this.page + 1;
        this.showLoading = "show";
      } else {
        this.page = 1;
        p = this.page;
        this.refreshing = true;
      }

      let self = this;
      self.footer_text = "正在加载中...";
      network.getDynamicAndArticles({ page: p }, function(res) {
        console.log("onloading:", res);
        if (res.ret === 1) {
          let data = res.data;

          self.dealDataSource(data)

          if (isLoadMore) {
            self.itemsList.push(...data);
          } else {
            self.itemsList = data;
          }
          self.showLoading = "hide";

          self.page = self.page + 1;
          if (data.length < self.pageSize) {
            self.footer_text = "-我还是有底线的-";
          } else {
            self.footer_text = "";
          }
        } else {
          self.footer_text = "";
        }

        if (isLoadMore) {
          self.showLoading = "hide";
        } else {
          self.refreshing = false;
        }
      });
    },
    dealDataSource: function(dataSource) {
      for (let i = 0; i < dataSource.length; i++) {
        let item = dataSource[i];
        if (parseInt(item["type"])) {
          // CMS
          item["avatar"] = item["author_avatar"] || ""
          item["name"] = item["account_id"] || ""
          item["date"] = item["showed"] || ""
          item["img"] = item["img"] || ""
          item["title"] = item["title"] || ""
          item["author"] = item["category_name"] || ""
        } else {
          // 课程动态
          item["avatar"] = item["teacher_avatar"] || ""
          item["name"] = item["teacher_name"] || ""
          item["date"] = item["start_day"] + " " + item["start_time"]
          item["img"] = item["img"] || ""
          item["title"] = item["title"] || ""
          item["author"] = item["teacher_name"] || ""
          item["desc"] = item["desc"] || ""
        }
      }
    },
    makeDate(time) {
      let timeArr = [];
      timeArr = time.split(" ");
      return timeArr[0];
    },
    listStyle() {
      let baseNum = 5;
      const baseHeight = 265;
      let height = baseHeight * baseNum;
      return `height: ${height}px`;
    },
    onScroll(ev) {
      if (this.cmsList) {
        this.scrollTop = this.cmsList.scrollTop;
      }
    }
  },
  mounted: function() {}
};
</script>

<style scoped>
#cmsList {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
}
</style>
