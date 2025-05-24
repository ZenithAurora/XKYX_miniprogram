// pages/login/login.js
import { setStorage } from '../../utils/storage';

Page({
  data: {
    currentStep: 1,
    tempAvatar: '/assets/avator/default.jpg',
    tempNickname: '',
    checked: false,
    isLoading: false,
    loadingText: '授权中...',

    // 用户信息
    tempUserInfo: {},
    tempPhone: ''

  },

  // 选择头像
  handleChooseAvatar(e) {
    this.uploadFile(e.detail.avatarUrl).then(res => {
      this.setData({
        tempAvatar: res.data
      })
    }).catch(err => {
      console.log(err);
    })
  },

  // 文件上传方法
  uploadFile(filePath) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: 'https://xkyx.fun/admin/activity/upload',
        filePath,
        name: 'poster',
        success(res) {
          const data = JSON.parse(res.data)
          resolve(data)
        },
        fail: reject
      })
    })
  },

  // 获取微信昵称
  getWechatNickname() {
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: res => {
        this.setData({ tempNickname: res.userInfo.nickName });
      }
    });
  },

  // 输入昵称
  handleNicknameInput(e) {
    this.setData({ tempNickname: e.detail.value.slice(0, 12) });
  },

  // 下一步
  handleNextStep() {
    if (!this.data.tempAvatar) {
      wx.showToast({ title: '请选择头像', icon: 'none' });
      return;
    }
    if (!this.data.tempNickname.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    this.setData({ currentStep: 2 });
  },

  // 上一步
  handleLastBtn() {
    this.setData({
      currentStep: 1
    })
  },


  // 获取手机号
  async handleGetPhone(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') return;
    this.setData({ isLoading: true, loadingText: '正在验证...' });

    const { code } = await wx.login();
    wx.request({
      url: 'https://xkyx.fun/user/login/phone',
      method: 'POST',
      data: {
        code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: (res) => {
        console.log(res);
        // 如果获取到了数据
        if (res.data && res.data.code === 1) {
          this.setData({
            tempPhone: res.data.data.phoneNumber,
            tempUserInfo: {
              phoneNumber: res.data.data.phoneNumber,
              avatar: this.data.tempAvatar,
              nickname: this.data.tempNickname,
              userId: res.data.data.userId
            }
          });

          // 将token存下来
          setStorage('token', res.data.data.token)
        } else {
          wx.showToast({
            title: '授权失败，请重试',
            icon: 'none'
          })
        }
      },
      fail: (err) => {
        console.log('请求失败:', err);
        wx.showToast({
          title: '服务器开小差了，请稍后重试',
          icon: 'none'
        })
      },
      complete: () => {
        this.setData({ isLoading: false });
      }
    });
  },


  // 提交登录
  async handleSubmit() {
    if (!this.data.tempUserInfo.phoneNumber) {
      wx.showToast({ title: '请先授权手机号', icon: 'none' });
      return;
    }
    if (!this.data.checked) {
      wx.showToast({ title: '请先阅读并同意协议', icon: 'none' });
      return;
    }

    // 展示正在登录
    this.setData({ isLoading: true, loadingText: '正在登录中' });

    // 将信息存储到本地
    setStorage('userInfo', this.data.tempUserInfo)

    setTimeout(() => {
      wx.showToast({ title: '登录成功', icon: 'success' })
    }, 1000)
    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/home/home',
      })
    }, 1000)
  },

  // 复选框
  onChange(event) {
    this.setData({
      checked: event.detail
    });
  },

  // 隐私政策
  onPrivacyPolicy() {
    wx.navigateTo({
      url: '/pages/userAgreement/userAgreement'
    });
  },


  // 返回
  navigateBack() {
    wx.navigateBack();
  },
});