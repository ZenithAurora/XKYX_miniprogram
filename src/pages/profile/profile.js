import { getCouponCount } from '../../API/getMyCouponCount'
import { debounce, throttle } from '../../utils/throttle-debounce'
Page({

  data: {
    // 用户数据
    userInfo: {
      avatar: "",
      nickname: '微信用户',
      userId: ''
    },
    //优惠券数量
    available: 0,
    unused: 0,

    token: '',
    showEditModal: false,
    // 模态框中的临时数据
    tempName: '',
    tempAvatar: '',
    isSaving: false
  },

  // 页面加载时读取本地存储
  onReady() {
    // 拿数据
    this.fetchData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
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

  // 获取页面数据
  async fetchData() {
    // 只有有token 的情况下我们才发请求获取数据
    const token = wx.getStorageSync('token') || null
    if (token) {
      // 获取本地数据
      const savedInfo = wx.getStorageSync('userInfo');
      const userId = savedInfo.userId;
      const res = await getCouponCount(userId);
      // 异步获取优惠券数量
      // console.log(res);
      this.setData({
        userInfo: savedInfo,
        token,
        available: res.data?.unused || 0,
        unused: res.data?.used || 0
      });
    }
  },

  // 选择头像
  onChooseAvatar(event) {
    console.log(event);
    wx.showLoading({
      title: '上传中...',
    });

    const { avatarUrl } = event.detail;
    const token = wx.getStorageSync('token')
    wx.uploadFile({
      filePath: avatarUrl,
      name: 'poster',
      url: 'https://xkyx.fun/admin/activity/upload',
      header: {
        'Authorization': `Bearer ${token}`
      },
      timeout: 1000000,
      success: res => {
        const data = JSON.parse(res.data)   //将json字符串解析为对象
        console.log(data) // 图片地址 
        this.setData({
          tempAvatar: data.data
        })
      },
      fail(err) {
        wx.showToast({
          title: '上传失败请重试',
          icon: 'error'
        })
        wx.hideLoading()
        return
      }
    })
    wx.hideLoading()
  },
  ChooseAvatar() {
    console.log("上传头像");
  },

  // 退出登录
  // relogin() {
  //   wx.showModal({
  //     title: '提示',
  //     content: '是否确认退出登录？',
  //     complete: (res) => {
  //       if (res.confirm) {
  //         wx.showToast({
  //           title: '成功',
  //           duration: 1500
  //         })
  //         wx.clearStorage()
  //         wx.reLaunch({
  //           url: '/pages/login/login',
  //         })
  //       }

  //       if (res.cancel) {
  //         wx.showToast({
  //           title: '取消',
  //           icon: 'none',
  //           duration: 1500
  //         })
  //       }
  //     }
  //   })
  // },

  // 用户授权登录


  login() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 输入昵称
  onNameInput(e) {
    this.setData({
      tempName: e.detail.value.slice(0, 10) // 限制10个字符
    });
  },

  // 显示修改模态框
  showEditModal() {
    this.setData({
      showEditModal: true,
      tempName: this.data.userInfo.nickname,
      tempAvatar: this.data.userInfo.avatar
    });
  },
  hideEditModal() {
    this.setData({
      showEditModal: false,
      tempName: this.data.userInfo.nickname,
      tempAvatar: this.data.userInfo.avatar
    })
  },

  // 保存修改
  saveChanges() {
    if (this.data.isSaving) return;

    const { tempName, tempAvatar } = this.data;
    if (!tempName.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    this.setData({ isSaving: true });

    // 更新数据并保存到本地
    const newInfo = {
      ...this.data.userInfo,
      nickname: tempName,
      avatar: tempAvatar
    };

    wx.setStorageSync('userInfo', newInfo);
    this.setData({
      userInfo: newInfo,
      showEditModal: false,
      isSaving: false
    });

    wx.showToast({ title: '保存成功' });
  },

  // 点击优惠券跳转历史优惠券对应页面
  ClickCouponCount(e) {
    // 将事件数据转换为 JSON 字符串
    const event = JSON.stringify(e);
    // 使用 encodeURIComponent 对参数进行编码，避免特殊字符导致的问题
    wx.navigateTo({
      url: `/pages/historyCoupon/historyCoupon?e=${encodeURIComponent(event)}`,
    });
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onShareTimeline() { }

})