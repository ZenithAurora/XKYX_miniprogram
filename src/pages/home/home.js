import { reqHomeData } from '../../API/home'
import { debounce, throttle } from '../../utils/throttle-debounce'

Page({

  data: {
    // 页面滚动数据
    scrollTop: 0,
    // 数据
    advImgUrlList: [
    ],
    activityMessage: [
    ],
    announcement: { content: '' },

    // 控制骨架平的显示与否
    loading: true,
  },


  onLoad() {
    this.setData({ loading: true }, () => {
      this.fetchData().finally(() => {
        this.setData({ loading: false })
      })
    })
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady() {
  },

  // 封装公共的请求方法
  async fetchData() {
    const res = await reqHomeData()
    console.log(res);
    // 分步更新数据
    this.setData({
      advImgUrlList: res[0].data
    }, () => {
      this.setData({
        activityMessage: res[1].data
      }, () => {
        this.setData({
          announcement: res[2].data || this.data.announcement.content
        })
      })
    })
  },

  // 跳转到全部活动页面
  goToAllGoodNav() {
    wx.navigateTo({
      url: '/pages/allGoodNav/allGoodNav'
    });
  },

  // 监听用户下拉刷新
  onPullDownRefresh: debounce(function () {
    wx.showLoading({
      title: '数据加载中'
    })
    setTimeout(() => {
      this.fetchData()
        .finally(() => {
          wx.stopPullDownRefresh() // 无论成功失败都停止刷新
          wx.hideLoading()
        })
    }, 1000)
  }, 500),

  // 监听页面滚动
  onPageScroll: throttle(function (e) { // 使用节流包装
    const { scrollTop } = e;
    this.setData({
      scrollTop,
      showLogo: scrollTop > 5
    }, () => { }
    )
  }, 100),

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  // 在页面卸载时释放资源
  onUnload() {
    this.setData({
      activityMessage: [],
      advImgUrlList: []
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '西科严选',
      path: '/pages/home/home'
    }
  },
  onShareTimeline() {
    return {
      title: '西科严选',
    }
  }
})