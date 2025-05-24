import { reqMyCouponList } from '../../API/myCouponList'
import { getStorage } from '../../utils/storage';

Page({
  data: {
    activeTab: 'usable',
    tabAnimation: 'usable',

    tabLabels: ['可使用', '已使用', '已失效'],
    couponCounts: [0, 0, 0], // 初始化计数器
    currentList: [],
    showModal: false,
    selectedCouponQRCode: '',
    selectedCouponPayMoney: 0,
    couponData: {
      usable: [],
      used: [],
      expired: []
    },
    currentCouponDetails: {
      condition: '',
      detail: ''
    }
  },

  onLoad(option) {
    // 如果有参数，那么说明是从  我的->可用->点击数字进来的
    if (option.e) {
      const e = JSON.parse(decodeURIComponent(option.e))
      const tab = e.currentTarget.dataset.tab
      // 设置当前选项卡
      this.setData({
        activeTab: tab
      });
      // 切换选项卡并触发小横条动画
      this.switchTab({
        currentTarget: {
          dataset: {
            tab: tab
          }
        }
      });
    }
    // 如果没有参数，那么就是从 全部   进来的
    else {
      this.setData({
        activeTab: "usable"
      })
    }
    this.fetchData();
    this.setInitialTabIndicator();
    // 
  },

  // 封装公共的请求方法
  async fetchData() {
    const token = getStorage('token') || null
    if (token) {
      const user = getStorage('userInfo')
      const userId = getStorage('userInfo').userId
      const res = await reqMyCouponList(userId)
      console.log(res);
      if (res.code === 1) {
        // 打造一个预处理对象数组
        const processedData = {
          usable: [],
          used: [],
          expired: []
        };

        res.data.forEach(item => {
          // 状态分类
          let statusKey;
          switch (item.status) {
            case 1:
              statusKey = 'used';
              break;
            case 0:
              statusKey = 'usable';
              break;
            case -1:
              statusKey = 'usable';
              break;
            default:
              statusKey = 'expired';
          }

          // 将本item映射到我们的预处理数组中
          const processedItem = {
            couponId: item.couponId,
            shopName: item.shopName,
            shopAddress: item.shopAddress,
            endTime: item.endTime,
            status: statusKey,
            activityName: item.activityName,
            qrCodeUrl: item.qrCodeUrl,
            couponImg: item.iconUrl,
            couponDetails: item.couponDetails,
            payValue: item.payValue,
            title:item.title
          }

          // 将预处理item装入对应的预处理对象数组中
          processedData[statusKey].push(processedItem)

        });

        // 将预处理对象数组，更新到我们当前的这个couponData中
        this.setData({
          couponData: processedData,
          couponCounts: [
            processedData.usable.length,
            processedData.used.length,
            processedData.expired.length
          ]
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        })
      }

      this.setCurrentList();
    }

  },


  onPullDownRefresh() {
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    setTimeout(() => {
      this.fetchData()
        .finally(() => {
          wx.stopPullDownRefresh()
        })
    }, 800)
    wx.hideLoading()
  },

  // 设置当前列表数据
  setCurrentList() {
    const { activeTab, couponData } = this.data;
    this.setData({
      currentList: couponData[activeTab]
    });
  },


  // 初始化小横条位置
  setInitialTabIndicator() {
    const { activeTab } = this.data
    const index = ['usable', 'used', 'expired'].indexOf(activeTab);

    const animation = wx.createAnimation({
      duration: 0, // 初始动画不需要过渡时间
      timingFunction: 'ease'
    });

    // 每个选项卡的宽度为 33.33%，小横条的宽度设置为 80% 的选项卡宽度
    // 计算小横条的偏移量，使其居中
    const tabWidth = 33.33; // 选项卡宽度百分比
    const indicatorWidth = 10; // 小横条宽度百分比
    const offset = (tabWidth - indicatorWidth) / 2; // 偏移量

    animation.left(`${index * tabWidth + offset}%`).width(`${indicatorWidth}%`).step();

    this.setData({
      tabAnimation: animation.export()
    });
  },


  // 切换选项卡
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    // console.log(tab);
    const index = ['usable', 'used', 'expired'].indexOf(tab);
    const animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease'
    });

    const tabWidth = 33.33; // 选项卡宽度百分比
    const indicatorWidth = 10; // 小横条宽度百分比
    const offset = (tabWidth - indicatorWidth) / 2; // 偏移量

    animation.left(`${index * tabWidth + offset}%`).width(`${indicatorWidth}%`).step();

    this.setData({
      activeTab: tab,
      tabAnimation: animation.export()
    }, () => {
      this.setCurrentList();
    });
  },


  // 显示优惠券详情（跳转新页面）
  showCouponDetail(e) {
    // console.log(e);
    const couponId = e.currentTarget.dataset.id;
    const status = e.currentTarget.id
    const arrayList = this.data.couponData[status]
    const currentItem = arrayList.find(item => item.couponId == couponId)

    // console.log(currentItem);
    const { condition, detail } = currentItem.couponDetails
    // console.log(condition, detail);
    // 将优惠券详情传递给下一个页面
    wx.navigateTo({
      url: `/pages/couponDetails/couponDetails?details=${detail}&conditions=${condition}`
    });
  },

  // 点击使用按钮
  handleUseCoupon(e) {
    const couponId = e.currentTarget.dataset.id;
    const coupon = this.data.couponData[this.data.activeTab].find(item => item.couponId === couponId);
    // console.log(coupon);
    if (coupon) {
      this.setData({
        showModal: true,
        selectedCouponQRCode: coupon.qrCodeUrl,
        selectedCouponPayMoney: coupon.payValue
      });
    }
  },
  // 点击复制地址按钮
  copyPosition(e) {
    const couponId = e.currentTarget.dataset.id;
    const status = e.currentTarget.id
    const arrayList = this.data.couponData[status]
    const currentItem = arrayList.find(item => item.couponId == couponId)
    // console.log(currentItem);
    wx.setClipboardData({
      data: currentItem.shopAddress,
      success() {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },

  // 关闭模态框
  closeModal() {
    this.setData({
      showModal: false
    });
  },
  onShareAppMessage() { },
  onShareTimeline() { }
});