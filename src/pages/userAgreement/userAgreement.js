Page({
  data: {
    showBackToTop: false
  },

  onPageScroll(e) {
    const shouldShow = e.scrollTop > 300;
    if (shouldShow !== this.data.showBackToTop) {
      this.setData({ showBackToTop: shouldShow });
    }
  },

  scrollToSection(e) {
    const targetId = e.currentTarget.dataset.target;
    const query = wx.createSelectorQuery().in(this);

    query.select(`#${targetId}`).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (res[0] && res[1]) {
        const targetTop = res[0].top;
        const viewportHeight = res[1].scrollTop;
        wx.pageScrollTo({
          scrollTop: viewportHeight + targetTop - 80, // 减去导航栏高度
          duration: 300
        });
      }
    });
  },

  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    });
  }
});
