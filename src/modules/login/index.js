
import event from '../event'
import data from '../../data'
import config from '../../config.json'

export function gotoLogin (loginUrl) {
  console.log('loginUrl:', loginUrl)

  window.location.href = loginUrl
}

export function checkRegister () {
  if (window.needReg) {
    event.sendEvent('registerAlert')
    return true
  }
  return false
}

export function gotoRegister () {
  let redirectUrl =  window.location.origin + '/mobile/index?defaultPath=' + window.vm.$router.currentRoute.path

  let userInfo = data.store('userInfo')
  if(window.app_config && window.app_config.crm_register && window.app_config.crm_register.length > 0){
     window.location.href = window.app_config.crm_register + '?redirect=' + encodeURI(redirectUrl)
  }
}