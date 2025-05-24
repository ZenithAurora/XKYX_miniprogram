// 这个api是为了获取活动详情的
// 获取：店家信息、优惠券列表

import http from '../utils/http'
// 一次性质获得多个数据，并发操作，提高页面渲染速度
export const reqActivityDetails = (activityId) => {
  return Promise.all([
    http.get(`/user/activity/details/${activityId}`),
    http.get(`/user/activity/store-details/${activityId}`),
  ])
}
