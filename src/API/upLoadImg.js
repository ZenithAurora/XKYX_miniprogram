// 这个api是用来上传头像、收款码的
// 传入一个文件地址（可以是临时的url）  结果回返回一个字符串

export const getImgUrl = (tempFilePath) => {
  return new Promise((resolve, reject) => {
    const token = 'fjajfiajifahj';
    wx.uploadFile({
      filePath: tempFilePath,
      name: 'poster',
      url: 'http://47.109.145.128:8023/admin/activity/upload',
      header: {
        'Authorization': 'Bearer ' + token
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          const avatarImgUrl = data.data;
          resolve(avatarImgUrl);
        } catch (error) {
          reject('解析 JSON 错误: ' + error);
        }
      },
      fail: (err) => {
        reject('上传文件失败: ' + err);
      }
    });
  });
}