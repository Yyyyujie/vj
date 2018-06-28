// pages/war/war.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  bindGetUserInfo: function (e) {
    wx.showLoading({
      title: '登录中...',
    })
    console.log(e)
    // var developer = (wx.getStorageSync('userMsg'));
    // developer.userInfo.nickName = e.detail.userInfo.nickName;
    // developer.userInfo.headImage = e.detail.userInfo.avatarUrl;
    // wx.setStorageSync('userMsg', developer);
    wx.login({
      success:function(ret){
        console.log(ret)
      }
    })
    wx.login({
      success: function (res) {
        console.log(res);
        // developer.code = res.code;
        // wx.setStorageSync('userMsg', developer);
        app.wxItools.wxItools.request(app.__config.InterfaceUrl.login, 'POST', {
          encryptedData: e.detail.encryptedData,
          code: res.code,
          ivStr: e.detail.iv
        }, (ret) => {
          console.log(ret);
          if (ret.code == 200) {
            wx.showToast({
              title: '登录成功',
            });
            var developer = (wx.getStorageSync('userMsg'));
            developer.code = res.code;
            developer.userInfo.nickName = e.detail.userInfo.nickName;
            developer.userInfo.headImage = e.detail.userInfo.avatarUrl;
            wx.setStorageSync('userMsg', developer);
            // wx.setStorage({
            //   key: 'userMsg',
            //   data: ret.data,
            // });
            wx.navigateBack({
              delta:1
            })
          }
        })
      }
    })

  }
})