// 配置小程序的环境变量

const { miniprogram } = wx.getAccountInfoSync()

// 获取版本
const { envVersion } = miniprogram

// 根据版本选择不同的基准地址
let env = {
  baseURL: ""
}

switch (envVersion) {
  case 'develop':
    env.baseURL = ""
    break
  case 'trail':
    env.baseURL = ""
    break
  default:
    env.baseURL = ""
    break
}


export { env }