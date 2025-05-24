Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponMsg: {
      endDate: "",
      qrCodeString: "",
      startDate: "",
      storeAddress: "",
      storeName: "",
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 上一个页面传递过来的信息，我就赋值给couponMsg
    this.setData({
      couponMsg: options
    })
  },

  navigateBack() {
    wx.navigateBack()
  },


  onCopyPosition() {
    wx.setClipboardData({
      data: this.data.couponMsg.storeAddress,
      success: () => {
        wx.showToast({
          title: '位置已复制',
          icon: "success"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 参与成功
    wx.showToast({
      title: '恭喜你成功参与!',
      icon: 'success',
      duration: 2000
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

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

  }
})