// 这个api是为了点击立即参与获取奖券和信息的

import http from '../utils/http'
export const reqActivityCouponMsg = (activityId, couponId) => {
  return http.post(
    `/user/activity/qrCode`,
    {
      activityId,
      couponId
    }
  )
}
