import http from '../utils/http'

export const reqMyCouponList = (userId) => {
  return http.get(`/user/my/coupon/list/${userId}`)
}