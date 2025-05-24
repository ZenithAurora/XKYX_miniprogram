// 这个api是为了获取我的页面   优惠券数量的

import http from '../utils/http'
export const getCouponCount = (userId) => {
  return http.get(`/user/my/coupon/sum/${userId}`)
}
