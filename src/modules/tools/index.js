// import event from '../event'

export function courseRoute(item, params) {
  let router = window.vm.$router
  let currentName = router.currentRoute.name
  if (currentName === 'course' || currentName === 'shareResult') {
    router.replace('/course/' + item.id)
  } else {
    router.push('/course/' + item.id)
  }
}

export function changeNum(num) {
  let n = parseInt(num)
  if (n >= 10000) {
    return (n / 10000).toFixed(2) + '万'
  } else {
    return n
  }
}

export function linkJump(link) {

  console.log('linkJump:',link)

  if(!link || link.length === 0){
    return
  }

  let host = link

  let hostReg = new RegExp("^http(s)?://(.*?)/");

  let tmp = hostReg.exec(link)

  if (tmp && tmp.length > 1) {
    host = tmp[2];
  }

  let header = "defaultPath="
  let index = link.indexOf(header)

  if(host === window.location.host && index > -1){
    // 作为内链处理
    let path = link.substring(index + header.length,link.length)

    let router = window.vm.$router

    router.push(path)

  }else{
    // 作为外链处理
    window.location.href = link
  }
}
