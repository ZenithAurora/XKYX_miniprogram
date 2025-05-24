// pages/goods-detail/goods-detail.js
Page({
  data: {
    active: 1,
  },
  onLoad() {
    // 商品数据请求
    this.fetchData()
  },

  async fetchData() {
    const res = await wx.request({
      url: 'http://47.109.145.128:8025/api/gifs',
    })

    console.log(res);
  },


  navigateBack() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  onChange(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });
  },



})