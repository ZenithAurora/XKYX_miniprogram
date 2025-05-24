Page({
  data: {
    // 电话号码
    phone: "19114023393",
  },
  onLoad() {
    // 页面加载时的逻辑
  },

  // 复制电话号码
  onCopyPhoneNumber() {
    wx.setClipboardData({
      data: this.data.phone,
      success: () => {
        wx.showToast({
          title: '手机号已复制',
          icon: "success"
        })
      }
    })
  },

  onCall() {
    // 拨打电话的逻辑
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success: function () {
        console.log("拨打电话成功!");
      },
      fail: function () {
        console.log("取消打电话");
      }
    });
  },

  // 页面返回的逻辑
  navigateBack() {
    wx.navigateBack()
  },
});