<html>

<head>
  <meta charset="utf-8">
  <!--base insert-->
  <link rel="dns-prefetch" href="http://wyeth-uploadsites.nibaguai.com">
  <link rel="dns-prefetch" href="http://cdn.s1.oneitfarm.com">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="format-detection" content="telephone=no, email=no">
  <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>

  <script tag="1">
    window.CIData = [];
    window.CIData.push(["setAppKey", "jtcj5komwfxrv2qzbts4rlgu7ownzesy"]);
    window.CIData.push(["setVersion", "v1.0.0"])
  </script>

  <script src="http://sdk.talkingdata.com/app/h5/v1?appid=APPID&vn=魔栗妈咪学院&vc=5BE2AF352D654B89BB24D32D8E34602B"></script>

</head>

<body data-throttle-id="1">

  <!--root start-->
  <div id="root-container">
    <div id="root"></div>
  </div>
  <!--root end-->


  <script tag="1">

    window.wyeth_host = "https://mama-weiketang-wyeth.woaap.com"

    function GetRequest() {
      let url = window.location.search
      let requestParams = {}
      if (url.indexOf('?') !== -1) {
        let str = url.substr(1)
        let strs = str.split('&')
        for (let i = 0; i < strs.length; i++) {
          requestParams[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
      }
      return requestParams
    }



    // 获取url中参数
    let requestParams = GetRequest()

    window.requestParams = requestParams || {}

    // wyeth_channel为url带参数_hw_c的值,来源渠道
    window.requestParams.wyeth_channel = requestParams._hw_c || ''

    window.wyeth_channel = requestParams._hw_c || ''

    window.requestParams.test = requestParams.test || ''


    console.log('初始化 获取参数：', window.requestParams)

    window.app_config = {
      appkey: "jtcj5komwfxrv2qzbts4rlgu7ownzesy",
      copyright: "“魔栗妈咪学院”版权归属景栗科技所有，相关课程内容由景栗科技提供。平台相关内容不作为医学诊断参考，如情况严重，建议及时就医。",
      crm_register
        : "http://mama-weiketang.e-shopwyeth.com/mobile/registerCrm",
      crm_tip:
        "未注册",
      search_placeholder: "大脑发育",
      title: "魔栗妈咪学院"
    }

    window.isTest = true;

    if (!window.isTest) {
      window.onload = function () {
        //加载完毕，执行代码
        console.log('!!!!!!!!! window onload: ', Math.round(new Date().getTime() / 1000))

        var xhr = new XMLHttpRequest();
        xhr.open("get", "http://mama-weiketang.e-shopwyeth.com/wyeth/loadHome", true);
        xhr.withCredentials = true;
        xhr.send(null);

        var s = document.createElement("script");


        if (navigator.userAgent.indexOf("JianKongBao") == -1) {
          s = document.createElement("script");
          s.async = true;
          s.type = "text/javascript";
          s.src = "//oneitfarm.com/cidata/main.php/json/script";
          document.getElementsByTagName("head")[0].appendChild(s);
        }
      }
    }
  </script>
</body>

</html>