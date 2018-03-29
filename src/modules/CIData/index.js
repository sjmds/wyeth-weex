export default {
  setAppKey: function (appkey) {
    window.CIData.push(['setAppKey', appkey])
  },
  setChannel: function (channel) {
    window.CIData.push(['setChannel', channel])
  },
  // 课程曝光
  recActionExpose: function (obj) {
    if (obj && obj.id) {
      this.push(['recActionExpose', obj.id])
    }
  },
  // 课程浏览
  recActionView: function (obj) {
    console.log('CIData:', obj)
    if (obj && obj.id) {
      this.push(['recActionView', obj.id])
    }
  },
  // 转化成功    （听课）
  recActionTransact: function (obj) {
    if (obj && obj.id) {
      this.push(['recActionTransact', obj.id])
    }
  },
  // 收藏物品    （收藏）
  recActionCollect: function (obj) {
    if (obj && obj.id) {
      this.push(['recActionCollect', obj.id])
    }
  },
  // 取消收藏
  recActionUncollect: function (obj) {
    if (obj && obj.id) {
      this.push(['recActionUncollect', obj.id])
    }
  },
  // 喜欢/点赞
  recActionLike: function (obj) {
    if (obj && obj.id) {
      this.push(['recActionLike', obj.id])
    }
  },
  // 不喜欢/取消点赞
  recActionDislike: function (obj) {
    if (obj && obj.id) {
      this.push(['recActionDislike', obj.id])
    }
  },
  push: function (data) {
    if (window._hmt) {

      let data2 = []
      for (let i=0;i<data.length;i++) {
        data2.push(data[i])
      }

      window.CIData.push(data2)
      console.log('CIData:', data2)

      let TDAPP_id, TDAPP_label, TDAPP_MapKv = ""

      for (let i = data.length - 1; i >= 0; i--) {
        if (!data[i] || data[i].length === 0) {
          data.splice(i, 1)
        }
      }

      switch (data.length) {
        case 1: {
          TDAPP_id = data[0]
        }
          break;
        case 2: {
          TDAPP_id = data[0]
          TDAPP_label = data[1]
        }
          break;
        case 3: {
          TDAPP_id = data[0]
          TDAPP_label = data[1]
          TDAPP_MapKv = data[2]
        }
          break;
        case 4: {
          TDAPP_id = data[0]
          TDAPP_label = data[2]
          TDAPP_MapKv = data[3]
        }
          break;
        case 5: {
          TDAPP_id = data[2]
          TDAPP_label = data[3]
          TDAPP_MapKv = data[4]
        }
          break;
        default:
          break;
      }

      console.log('TDAPP:', TDAPP_id, TDAPP_label,TDAPP_MapKv)

      if(typeof(TDAPP_MapKv) === 'object'){
        TDAPP.onEvent(TDAPP_id, TDAPP_label,TDAPP_MapKv);
      }else{
        TDAPP.onEvent(TDAPP_id, TDAPP_label,{"id":TDAPP_MapKv});
      }

    }
  }
}
