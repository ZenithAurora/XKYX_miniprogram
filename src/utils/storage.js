// 封装的本地存储api

// 【1】同步方法
export const setStorage = (key, value) => {
  try {
    wx.setStorageSync(key, value)
  } catch (error) {
    console.log(err);
  }
}

export const getStorage = (key) => {
  try {
    const value = wx.getStorageSync(key)
    if (value) return value
  } catch (error) {
    console.log(error);
  }
}

export const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
  } catch (error) {
    console.log(error);
  }
}

export const clearStorage = () => {
  try {
    wx.removeStorageSync()
  } catch (error) {
    console.log(error);
  }
}

//----------------------------------------------


// 【2】异步方法
export const setStorageAsync = (key, value) => {
  return new Promise((resolve) => {
    wx.setStorage({
      key,
      value,
      complete(res) {
        resolve(res)
      }
    });
  });
};

export const getStorageAsync = (key) => {
  return new Promise((resolve) => {
    wx.getStorage({
      key,
      complete(res) {
        resolve(res)
      }
    });
  });
};

export const removeStorageAsync = (key) => {
  return new Promise((resolve) => {
    wx.removeStorage({
      key,
      complete(res) {
        resolve(res)
      }
    });
  });
};

export const clearStorageAsync = () => {
  return new Promise((resolve) => {
    wx.clearStorage({
      complete(res) {
        resolve(res)
      }
    });
  });
};