// 这个api是为了授权登录业务的

import http from '../utils/http'

export const reqLogin = (code) => {
  return http.post(`/user/login`, { code })
}
