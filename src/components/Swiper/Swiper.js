
Component({
  properties: {
    imgURLList: {
      type: Array,
      value: []
    }
  },

  data: {
    localAutoplay: true,
    swiperCurrent: 0
  },

  pageLifetimes: {
    // 小程序显示时开启自动播放
    show() {
      this.setData({ localAutoplay: true });
    },
    // 小程序隐藏时关闭自动播放
    hide() {
      this.setData({ localAutoplay: false });
    }
  },

  methods: {
    // 切换时处理视频播放
    onSwiperChange(e) {
      const current = e.detail.current;
      const currentItem = this.data.imgURLList[current];

      if (currentItem?.type === 'video') {
        const videoId = `video_${currentItem.id}`;
        const videoCtx = wx.createVideoContext(videoId, this);
        videoCtx.play();
      }

      this.setData({ swiperCurrent: current });
    }
  }
});
