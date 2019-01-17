const request=(url,method="GET",data) => {
    wx.showLoading({
      title: '加载中'
    });
    return new Promise(function (resolve, reject) {
        wx.request({
          url: url,
          method: method.toUpperCase(),
          data: {
              ...data
          },
          header: {
            'Content-Type': 'application/json'
          },
          success:(res)=>{
            if (res.statusCode != 200) {
              reject({ error: '服务器忙，请稍后重试', code: 500 });
              return;
            }
            resolve(res.data);
          },
          fail:(err)=>{
            // fail调用接口失败
            console.log(err);
            reject({ error: '网络错误', code: 0 });
          },
          complete:(res)=>{
             wx.hideLoading();
             wx.stopPullDownRefresh();
          }
        })
      })
  }
  module.exports = {
    request: request,
  }