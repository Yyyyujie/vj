// pages/receive.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      sendId:'',
      receiveId:'',
      token:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        sendId: options.openId
      })
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
    let that = this;
    wx.login({
      success: function (res) {
        wx.setStorageSync('userMsg', {
          code: res.code
        });
        app.wxItools.wxItools.request(app.__config.InterfaceUrl.login, 'POST', {
          code: res.code
        }, (ret) => {
          that.setData({
            receiveId: ret.data.userInfo.miniOpenId,
            token:ret.data.token
          });
          
        })
      }
    });
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
  receive:function(){
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.shareCoupon, 'POST', {
      sendOpenId: that.data.sendId,
      recieveOpenId: that.data.receiveId,
      recievePhone: '',
      couponId: '',
      token: that.data.token
    }, (ret) => {
      if(ret.code==200){
        wx.showToast({
          title: '领取成功',
        }),
        wx.switchTab({
          url: '../index/index',
        })
      }
    })
  }
})