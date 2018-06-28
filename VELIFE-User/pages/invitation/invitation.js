// pages/invitation.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      invitation:''
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
    let that = this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.invitation, 'GET', {
      token: wx.getStorageSync('userMsg').token
    }, (ret) => {
      if (ret.code == 200) {
        that.setData({
          invitation: ret.data
        })
      }
    })
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
      let openId=wx.getStorageSync('userMsg').userInfo.miniOpenId;
      return {
        title: '邀请好友领优惠券',
        path: '/pages/receive/receive?openId='+openId
      }
  },
  //查看适用门店
  gotoStores:function(){
    wx.navigateTo({
      url: '../storesLi/storesLi',
    })
  },
  //门店评价
  shopEva:function(){
    wx.navigateTo({
      url: '../shopEva/shopEva',
    })
  }
})