// 请求活动详情页面数据
import { reqActivityDetails } from '../../API/actiivty'
import { reqActivityCouponMsg } from '../../API/participateActivity'
import { getStorage } from '../../utils/storage';
Page({

  data: {
    // 利用上一个页面传递过来的id，去请求这个id对应的活动详情信息
    activityId: 1,
    // 分享的时候用到的数据
    shareData: {
      // 可以在这里定义分享的标题、路径、图片等信息
      shareTitle: '西科严选'
    },
    activityDetailsList: [],
    storeInfo: {
      phoneNumber: "",
      storeAddress: "",
      storeName: ""
    }
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 查询字符串 
    // console.log(options);
    // 接受对应传递过来的参数
    const { activityId } = options;
    // console.log(options);
    this.setData({
      activityId: activityId
    })
    this.fetchData(activityId)
  },

  // 封装公共的请求方法
  async fetchData(id) {
    const res = await reqActivityDetails(id)
    console.log(res);
    this.setData({
      activityDetailsList: res[0].data,
      storeInfo: res[1].data
    })
  },

  // 点击立即参与的业务
  async ParticipateActivity(e) {
    try {
      const token = getStorage('token') || ''
      if (token) {
        wx.showLoading({
          title: '活动参与中...',
          mask: true
        })
      }
      const couponId = e.currentTarget.id
      const activityId = this.data.activityId // 这个是顶级页面传过来的活动id
      // 在跳转下一个页面的时候，先调用一下接口，看看后端给我们返回来的数据状态，如果活动已经满了，就阻止用户参与活动
      const res = await reqActivityCouponMsg(activityId, couponId)
      if (res.statusCode === 401) {
        return Promise.reject(res);
      }
      if (res.code) {
        // 获取该优惠券的信息，并且传给下个页面
        const { storeName, storeAddress, qrCodeString, endTime, beginTime, } = res.data

        setTimeout(() => {
          wx.hideLoading()
          wx.navigateTo({
            url: `/pages/coupon/coupon?storeName=${storeName}&storeAddress=${storeAddress}&qrCodeString=${qrCodeString}&endDate=${endTime}&startDate=${beginTime}`,
          })
        }, 800)
      }
      else {
        setTimeout(() => {
          wx.hideLoading()
          const msg = res.msg
          wx.showToast({
            title: msg,
            icon: 'none'
          })
        }, 2000)
      }
    } catch (error) {
      wx.hideLoading();
      // 检查是否是已处理的401错误
      if (error?.isHandled) return; // 新增判断
      // 只处理非401错误
      if (error?.statusCode !== 401) {
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    }
  },

  // 预览图片
  previewImage(e) {
    console.log(e);
    const currentImage = e.currentTarget.dataset.url;
    const allImages = this.data.activityDetailsList.map(item => item.posterUrl);
    wx.previewImage({
      current: currentImage, // 当前显示图片的链接
      urls: allImages // 需要预览的图片链接列表
    });
  },

  couponDetails(event) {
    // 拿到当前点击的item的couponId
    const currentCouponId = event.currentTarget.id
    // 拿到当前对应的item
    const currentCoupon = this.data.activityDetailsList.find(item =>
      item.couponId === Number(currentCouponId))
    // console.log(currentCoupon);
    const { detail, condition } = currentCoupon.couponDetails
    // console.log(details, condition);
    wx.navigateTo({
      url: `/pages/couponDetails/couponDetails?details=${detail}&conditions=${condition}`,
    })
  },

  navigateBack() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },

  // 计算金额
  caclMoney(orinal, end) {
    return (orinal - end).toFixed(2);
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  // 下拉刷新处理
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '数据加载中'
    })
    setTimeout(() => {
      this.fetchData(this.data.activityId)
        .finally(() => {
          wx.stopPullDownRefresh() // 无论成功失败都停止刷新
          wx.hideLoading()
        })
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
  },





  // ------------------------------------
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
  },

  // 处理分享到朋友圈的逻辑
  onShareTimeline() {
  },

})