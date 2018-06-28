var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      button:true,
      useerInfo:''
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
    let that=this;
    this.init();
  },
  init:function(){
    console.log(wx.getStorageSync('userMsg').userInfo);
     this.setData({
       userInfo: wx.getStorageSync('userMsg').userInfo
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
  person:function(){
    wx.navigateTo({
      url: '../person/person',
    })
  },
  faxing:function(){
    wx.navigateTo({
      url: '../hair/hair',
    })
  },
  eva:function(){
    wx.navigateTo({
      url: '../evaList/evaList',
    })
  },
  quan:function(){
    wx.navigateTo({
      url: '../Coupon/Coupon',
    })
  },
  call:function(){
    wx.showModal({
      title: '投诉建议',
      content: '是否确认拨打投诉电话',
      success:function(res){
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '1340000'
          })
        } 
      }
    })
    
  },
  //招商加盟
  ad:function(){
    wx.navigateTo({
      url: '../join/join',
    })
  },
  order:function(){
    wx.navigateTo({
      url: '../myOrder/myOrder',
    })
  },

  bindGetUserInfo: function (e) {
    let that=this;
    wx.showLoading({
      title: '登录中...',
    })
    console.log(e)
    
    wx.login({
      success: function (res) {
        
        // wx.setStorageSync('userMsg', developer);

        app.wxItools.wxItools.request(app.__config.InterfaceUrl.uploadWxInfo, 'POST', {
          nickName: e.detail.userInfo.nickName,
          headImage: e.detail.userInfo.avatarUrl,
          token:wx.getStorageSync('userMsg').token
        }, (ret) => {
          console.log(ret);
          if (ret.code == 200) {
            wx.hideLoading();
            var developer = (wx.getStorageSync('userMsg'));
            developer.code = res.code;
            developer.userInfo.nickName = e.detail.userInfo.nickName;
            developer.userInfo.headImage = e.detail.userInfo.avatarUrl;
            wx.setStorageSync('userMsg', developer);
            that.init();
            wx.showToast({
              title: '登录成功',
            });
          }
        })



        // app.wxItools.wxItools.request(app.__config.InterfaceUrl.login, 'POST', {
        //   encryptedData: e.detail.encryptedData,
        //   code: res.code,
        //   ivStr: e.detail.iv
        // }, (ret) => {
        //   console.log(ret);
        //   if (ret.code == 200) {
        //     wx.showToast({
        //       title: '登录成功',
        //     });
        //     wx.setStorage({
        //       key: 'userMsg',
        //       data: ret.data,
        //     });
        //     wx.navigateBack({
        //       delta: 1
        //     })
        //   }
        // })
      }
    })

  }
})