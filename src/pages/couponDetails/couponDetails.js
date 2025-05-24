Page({
  data: {
    // 团购详情内容（美食活动版）
    groupPurchaseDetails: ``,

    // 购买须知（美食活动版）
    purchaseNotes: ``
  },

  // 在onLoad中调用转换函数
  onLoad(options) {
    // console.log(options);
    const details = options.details || this.data.groupPurchaseDetails
    const notes = options.conditions || this.data.purchaseNotes
    this.setData({
      groupPurchaseDetails: this.formatText(details),
      purchaseNotes: this.formatText(notes)
    });
  },

  // 格式化文本，为每段添加加粗的小点
  formatText(text) {
    // 按行分割文本
    const lines = text.split('\n');
    // 为每行添加加粗的小点
    const formattedLines = lines.map(line => {
      if (line.trim() !== '') {
        return '<b>· </b>' + line;
      }
      return line;
    });
    // 将处理后的行重新组合为字符串
    return formattedLines.join('<br>');
  },
  // 这个页面还是不要分享为好，因为是里面的数据是从上一个页面传递下来的，如果是从分享页传递下来对的，那么回事乱码
  // onShareAppMessage() { },
  // onShareTimeline() { }
});