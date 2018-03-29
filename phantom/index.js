var webPage = require('webpage');
var page = webPage.create();
var fs= require('fs')


const ERROR_LOG='--err--'
const END_LOG='--end--'
// true 本地测试
var dev=true

var cache_num=1
var url='http://localhost:8080/?dynamic=1&grab=1'
var path='./'
var config='../indexConfig.json'
var base_url='http://cdn.s1.oneitfarm.com/web1/'


page.settings = {
  javascriptEnabled: true,
  loadImages: true,
  webSecurityEnabled: false,
  userAgent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36 LBBROWSER'
};


var getIndexName=function () {
  var n='index_'+new Date().getTime()+'.html'
  return n
}


var updateConfig=function (name) {

  var content='[]'

  if(fs.exists(config)){
    content=fs.read(config)
  }
  var arr=JSON.parse(content)
  var l=[]
  l.push(base_url+name)
  for(var i=0;i<arr.length;i++){
    l.push(arr[i])
  }
  l1=l.slice(cache_num)
  l=l.slice(0,cache_num)

  var str=JSON.stringify(l)
  fs.write(config,str,'w')

}



page.onConsoleMessage = function (msg, lineNum, sourceId) {
    console.log('CONSOLE:  ' + msg);
    if(msg==END_LOG){
      console.log("准备写入");
      var html=page.content
      html= dealHtml(html)

      if(dev){
        fs.write('../index.tpl', html, 'w');
      }else{
        var name=getIndexName()
        fs.write(path + name, html, 'w');
        updateConfig(name)
      }

      console.log("完成写入");
      phantom.exit();
    }
    if(msg==ERROR_LOG){
      phantom.exit();
    }


};



page.open(url, function(status) {
    console.log(status)
    if(status=='success'){
        page.evaluate(function() {
            var fn=function () {

              var flag=true
              console.log('------evaluate------')

              // 去除多余的js
              var scripts=document.querySelectorAll('script')
              for(var i=0;i<scripts.length;i++){
                var a=scripts[i]
                console.log(a.getAttribute('tag'))
                if(a.getAttribute('tag')!='1'){
                  if(a.parentNode){
                    a.parentNode.removeChild(a)
                  }
                }
              }

              // 去除旧的css
              var head=document.querySelector('head')
              var list=document.querySelectorAll('style')
              for(var i=0;i<list.length;i++){
                if(list[i].getAttribute('tag')=='old' ){
                  head.removeChild(list[i])
                }
              }
              document.head=head

              // css 过滤
              var styles=[]
              var k=0
              var list=document.querySelectorAll('style')
              console.log('------list.length=',list.length)
              for(var i=0;i<list.length;i++){
                var rules=list[i].sheet.cssRules
                var r=list[i].sheet.rules
                var style=document.createElement('style')
                var l=[]
                for(var j=0;j<rules.length;j++){
                  var selector=rules[j].selectorText
                  if(document.querySelector(selector)){
                    l.push(rules[j].cssText)
                  }else{
                    k=k+1
                  }
                }
                if(l.length<=0){
                  continue
                }
                var str=l.reduce(function (x,y) {
                  return x+'\n'+y
                })
                style.innerHTML=str
                style.setAttribute('type','text/css')
                styles.push(style)
              }
              console.log('========k=',k)

              // 去除旧的css
              var head=document.querySelector('head')
              var list=document.querySelectorAll('style')
              for(var i=0;i<list.length;i++){
                head.removeChild(list[i])
              }
              document.head=head

              for(var i=0;i<styles.length;i++){
                // console.log(styles[i].innerHTML)
                head.appendChild(styles[i])
              }

              // 去除首页超出第一屏的部分
              var loading=document.querySelector('#loading')
              if(loading){
                loading.innerHTML=''
              }

              var slider=document.querySelector('.weex-slider-inner')
              if(slider.children.length<=0){
                flag=false
              }



              var statichtml=document.querySelector('#static')
              var roothtml=document.querySelector('#root-container')

              if(roothtml==null||statichtml==null){
                console.log('--err--')
                return
              }
              statichtml.innerHTML=roothtml.innerHTML
              roothtml.innerHTML='<div id="root"></div>'



              if(flag){
                console.log('--end--')
              }else{
                console.log('--err--')
              }


            }
            setTimeout(fn,10000)
        });
    }
});


var dealHtml=function(html){

    // var static_start='<!--src start-->'
    // var static_end='<!--src end-->'
    // var root_start='<!--root start-->'
    // var root_end='<!--root end-->'
    // var root_reg=new RegExp(root_start+'(.|\n)*'+root_end,'g')
    // var static_reg=new RegExp(static_start+'(.|\n)*'+static_end,'g')
    //
    // var re=root_reg.exec(html)
    //
    // var div=re[0].slice(root_start.length,re[0].length-root_end.length)
    //
    // html=html.replace(static_reg,function(s){
    //     console.log('替换static')
    //     return static_start+'<div id="src">'+div+'</div>'+static_end
    // })
    // html=html.replace(root_reg,function(s){
    //     console.log('替换root')
    //     return root_start+'<div id="root"></div>'+root_end
    // })
    var reg=/\/\*(.|\n)*?\*\//g
    html=html.replace(/http(s)?:\/\/[^<>]*?\/images/g,function (s) {
      console.log('+++image+++')
      return 'images'
    })

    html=html.replace(reg,function (s) {
      return ''
    })

    return html
}
