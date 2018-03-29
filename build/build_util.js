/**
 * Created by FJC on 2017/8/10.
 */

const path = require('path')
const fs=require('fs')
const process = require('child_process');


var version=19

const index_path = path.resolve(__dirname, '../dist/web/index.html')
const outIndex_path = path.resolve(__dirname, '../dist/web/index'+version+'.html')
const manifestConfig=path.resolve(__dirname,'../dist/web/config'+'.json')

const js_path=path.resolve(__dirname,'../dist/web/js/')



var buildManifest=function (manifestName) {
  console.log('-buildManifest-')
  const vendor_path=path.resolve(__dirname, '../dist/web/js/vendor*')
  const app_path=path.resolve(__dirname, '../dist/web/js/app*')
  const manifest_path=path.resolve(__dirname, '../dist/web/js/'+manifestName)
  var s='cat '+vendor_path+' >> '+manifest_path +
    ' && cat '+app_path+' >> '+manifest_path
  process.exec(s,function (error, stdout, stderr) {
    if(error){
      console.log('合并manifest失败');
      console.log('exec error: ' + error);
    }else{
      console.log('合并manifest成功');
    }


  });

}
var getVendorName=function (content) {
  var reg=/vendor.*?js/g
  var res=content.match(reg)
  if(res){
    return res[0]
  } else {
    throw('--- ERROR --- : 找不到vendor文件')
    return ''
  }
}
var getAppName=function (content) {
  var reg=/app.*?js/g
  var res=content.match(reg)
  if(res){
    return res[0]
  } else {
    throw('--- ERROR --- : 找不到app文件')
    return ''
  }
}

var getManifestName=function (content) {
  var reg=/manifest.*?js/g
  var res=content.match(reg)
  if(res){
    return res[0]
  } else {
    throw('--- ERROR --- : 找不到manifest文件')
    return ''
  }
}

var getJSConfig = function(){

  var appName=''
  var vendorName=''
  var manifestName=''
  var chunks=[]


  var files=fs.readdirSync(js_path);
  files.forEach(function (file) {
    console.log('-file-',file)
    if(file.indexOf('app')>=0){
      appName=file
    }else if(file.indexOf('manifest')>=0){
      manifestName=file
    }else if(file.indexOf('vendor')>=0){
      vendorName=file
    }else {
      chunks.push(file)
    }
  })


  var a={
    manifestName:manifestName,
    vendorName:vendorName,
    appName:appName,
    chunksName:chunks
  }

  console.log('-file-',a)
  return a
}

var deleteScript=function (content) {
  var reg=/<script type="text\/javascript" src="js.*?<\/script>/g
  if(content.match(reg)){
    content=content.replace(reg,'')
  }
  return content
}

var addBaseUrl=function (content) {
  var reg=/<!--base insert-->/g
  if(content.match(reg)){
    content=content.replace(reg,function (s) {
      return '<base href="//cdn.s1.oneitfarm.com/web1/">'
    })
  }else{
    throw('--- ERROR --- : 找不到base插入点')
  }
  return content
}

var addVersion=function (content) {
  var reg=/src\/adjustView\.js/g
  if(content.match(reg)){
      content=content.replace(reg,function (s) {
      return 'src/adjustView'+version+'.js'
    })
  }else{
    throw('--- ERROR --- : 找不到adjustView')
  }
  return content
}





var addManifest=function (content,manifest) {
  var reg=/\/\*manifest insert\*\//g
  if(content.match(reg)){
    content=content.replace(reg,function (s) {
      return manifest
    })
  }else{
    throw('--- ERROR --- : 找不到manifest插入点')
  }
  return content
}

var checkScript=function (content) {
  var reg=/<script.*?>/g
  var res=content.match(reg)
  if(res){
    for(var i=0;i<res.length;i++){
      if(res[i].indexOf('tag="1"')<0){
        throw '--- ERROR --- : '+res[i]+' 没有tag标记'
        break
      }
    }
  }
}

fs.readFile(index_path, 'utf-8', function(err,content){
  if (err) {
    console.error(err)
  } else {

    content=addBaseUrl(content)
    // content=addVersion(content)

    var manifestName=getManifestName(content)
    var vendorName=getVendorName(content)
    var appName=getAppName(content)

    var a={manifestName:manifestName,vendorName:vendorName,appName:appName}
    var a=getJSConfig()
    fs.writeFile(manifestConfig,JSON.stringify(a),function () {
      if(err){

      }else{
        console.log('manifestConfig写入成功')
      }

    })



    // fs.writeFile(index_path, content, function (err) {
    //   if(err) {
    //     console.error(err);
    //   } else {
    //     // console.log('写入成功');
    //
    //     fs.rename(index_path,outIndex_path,function (err) {
    //       if(err){
    //         throw '重命名失败：'+index_path+' -> '+outIndex_path
    //       }else{
    //         console.log('重命名成功：'+index_path+' -> '+outIndex_path);
    //       }
    //     })
    //     const js_name = path.resolve(__dirname, '../dist/web/src/adjustView.js')
    //     const js_name2 = path.resolve(__dirname, '../dist/web/src/adjustView'+version+'.js')
    //     fs.rename(js_name,js_name2,function (err) {
    //       if(err){
    //         throw '重命名失败：'+js_name+' -> '+js_name2
    //       }else{
    //         console.log('重命名成功：'+js_name+' -> '+js_name2);
    //       }
    //     })
    //   }
    // });
  }
});


console.log('-start-')
