// 【1】在使用toast方法时，可以传入参数，也可以不传入参数
const toast = (
  { title = "数据加载中...", icon = "none", duration = 2000, mask = true } = {}) => {
  wx.showToast({ title, icon, duration, mask })
}

// 导出 
export { toast }