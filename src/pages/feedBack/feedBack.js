import { postFeedback } from '../../API/feedback'

Page({
  data: {
    feedbackTypes: [
      '活动建议',
      '内容投诉',
      '服务态度',
      '活动奖励',
      '其他反馈'
    ],
    selectedTypeIndex: 0, // 初始未选择
    feedbackContent: '', // 用户输入的反馈内容
    contactInfo: '',     // 用户输入的联系方式
    currentWordCount: 0, // 当前输入的字数
  },

  // 监听反馈内容输入
  onFeedbackInput(e) {
    const value = e.detail.value;
    this.setData({
      feedbackContent: value,
      currentWordCount: value.length
    });

    if (value.length > 300) {
      wx.showToast({
        title: '最多只能输入 300 字',
        icon: 'none'
      });
      this.setData({
        feedbackContent: value.slice(0, 300),
        currentWordCount: 300
      });
    }
  },

  // 监听联系方式输入
  onContactInput(e) {
    this.setData({
      contactInfo: e.detail.value
    });
  },

  // 选择反馈类型
  onTypeChange(e) {
    this.setData({
      selectedTypeIndex: e.detail.value
    });
  },

  // 验证手机号
  validatePhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  submitFeedback() {
    const { selectedTypeIndex, feedbackContent, contactInfo } = this.data;

    if (selectedTypeIndex === -1) {
      wx.showToast({
        title: '请选择反馈类型',
        icon: 'none'
      });
      return;
    }

    // 验证内容是否为空
    if (!feedbackContent.trim()) {
      wx.showToast({
        title: '请输入反馈内容喔！',
        icon: 'none'
      });
      return;
    }

    // 验证手机号是否填写
    if (!contactInfo) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    // 验证手机号格式是否正确
    if (!this.validatePhone(contactInfo)) {
      wx.showToast({
        title: '非有效手机号',
        icon: 'error'
      });
      return;
    }

    // 收集数据示例
    const formData = {
      type: this.data.feedbackTypes[selectedTypeIndex],
      content: feedbackContent,
      phoneNumber: contactInfo,
    };

    wx.showLoading({ title: '提交中...' });
    // 提交反馈
    postFeedback(formData.type, formData.content, formData.phoneNumber).then(res => {
      console.log(res);
      if (res.code) {
        setTimeout(() => {
          wx.hideLoading();
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          });
          this.resetForm();
        }, 1500);
      }
      else {
        setTimeout(() => {
          wx.hideLoading();
          wx.showToast({
            title: '提交失败请重试',
            icon: 'error'
          });
        }, 1500);
      }
    })
  },

  resetForm() {
    this.setData({
      selectedTypeIndex: -1,
      feedbackContent: '',
      contactInfo: '',
      currentWordCount: 0
    });
  },

});