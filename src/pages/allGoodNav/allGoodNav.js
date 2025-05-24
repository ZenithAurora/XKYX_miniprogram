import { reqHomeData } from '../../API/home'

Page({
  data: {
    activityMessage: []
  },
  onLoad(options) {
    this.fetchData()
  },

  // 封装公共的请求方法
  async fetchData() {
    const res = await reqHomeData()
    this.setData({
      activityMessage: res[1].data
    })
  },
  onShareAppMessage() { },
  onShareTimeline() { }
});