// 导入类
import WxRequest from 'mina-request'
import { getStorage, clearStorage } from './storage'
import { toast } from './toastAPI'
// 实例化
const instance = new WxRequest({
  // baseURL: 'http://47.109.145.128:8023',
  baseURL: 'https://xkyx.fun',
  timeout: 600000,
  isLoading: false,
})

// 请求拦截器
instance.interceptors.request = (config) => {
  // 每次请求的时候就检验是否有访问令牌，如果有，就将访问令牌放到配置的响应头中去
  const token = getStorage('token')
  if (token) {
    config.header['user-token'] = token
  }
  return config
}

//响应拦截器
instance.interceptors.response = (response) => {
  // 从对象种结构两个数据：isSuccess   data.code
  const { isSuccess, data } = response

  if (!isSuccess) {
    toast({
      title: '服务器暂时无法响应，请稍后再试',
      icon: 'none'
    })
    return Promise.reject(response)
  }

  // 如果状态码是200：调用成功，208：没有token或token失效，其他：出现了其他异常
  if (response.statusCode === 200) {
    // console.log("这是页面的返回的状态码" + response.statusCode);
    return data
  }
  else if (response.statusCode === 401) {
    const token = getStorage('token')
    if (token) {
      wx.showModal({
        content: '登录状态已失效，请重新登录',
        showCancel: false,
        complete: (res) => {
          // 用户点击了确认，那么就得清除本地的token ,并重新登录
          if (res.confirm) {
            wx.clearStorage()

            wx.navigateTo({
              url: '/pages/login/login',
              success: res => {
                console.log(res);
                return
              },
              fail: err => {
                console.log(err);
                return
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        content: '您尚未登录，请先登录',
        complete: (res) => {
          // 用户点击了确认，那么就得清除本地的token ,并重新登录
          if (res.confirm) {
            wx.clearStorage()
            wx.navigateTo({
              url: '/pages/login/login',
              success: res => {
                console.log(res);
              },
              fail: err => {
                console.log(err);
              }
            })
          }
          if (res.cancel) {
            return
          }
        }
      })
    }
    // 标记该错误已被处理，避免控制台打印
    return Promise.reject({ ...response, isHandled: true }) // 新增标记
  }
  else {
    wx.showToast({
      title: '服务器开小差了，请稍后重试',
      icon: 'none'
    })
    return Promise.reject(response)
  }
}

export default instance