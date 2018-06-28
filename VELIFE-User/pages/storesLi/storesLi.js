// pages/storesLi/storesLi.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
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
    wx.showLoading({
      title: '加载中...',
    })
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.shopList, 'GET', {
      token:wx.getStorageSync('userMsg').token
    }, (ret) => {
        wx.hideLoading();
        that.setData({
          list:ret.data
        })
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
  
  },
  map:function(e){
    wx.openLocation({
      latitude: parseFloat(e.currentTarget.dataset.latitude),
      longitude: parseFloat(e.currentTarget.dataset.longitude),
      scale: 12
    })
  },
  store:function(e){
    wx.showLoading({
      title: '加载中...',
    })
    wx.navigateTo({
      url: '../store/store?id=' + e.currentTarget.dataset.id,
    })
  },
  call:function(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  }
})