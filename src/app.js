App({
  // 全局共享的数据
  globleData: {
    token: ''
  },

  // 全局共享的方法
  setToken(token) {
    this.globleData.token = token
  },



  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate(function (res) {
      console.log(res.hasUpdate); // 检查是否有新版本
    });

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate(); // 应用新版本并重启
          }
        }
      });
    });

    updateManager.onUpdateFailed(function () {
      console.log('新版本下载失败'); // 处理下载失败
    });
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    // console.log("onShow 冷启动或后台切前台");
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    // console.log("onHide 从前台进入后台");
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  },
  onShareAppMessage() {

  }
})

