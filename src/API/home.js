// 这个api是为了获取首页数据的

import http from '../utils/http'
// 一次性质获得多个数据，并发操作，提高页面渲染速度
export const reqHomeData = () => {
  return Promise.all([
    // 【1】获取主页轮播图数据
    http.get('/user/advertisement/list'),
    // 【2】获取活动专区列表
    http.get('/user/activity/list'),
    // 【3】获取公告
    http.get('/user/activity/announcement/list')
  ])
}
