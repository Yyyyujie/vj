var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      phone:'',
      name:''
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
  phone:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  name: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  join:function(){
    wx.showLoading({
      title: '提交中...',
    })
    let mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    let names = /([\u4E00-\u9FA5]{2,4})/;
    let that=this;
    if(mobile.test(that.data.phone)){
        if(names.test(that.data.name)){
          app.wxItools.wxItools.request(app.__config.InterfaceUrl.join, 'GET', {
            name: that.data.name,
            phone: that.data.phone,
            token: wx.getStorageSync('userMsg').token,
          }, (ret) => {
            wx.hideLoading();
            if(ret.code==200){
              wx.showToast({
                title: '您信息提交成功',
                
              });
              setTimeout(function(){
                wx.navigateBack({
                  delta: 1
                });
              },1000);
            }
          })
        }else{
          wx.showToast({
            title: '请输入正确的姓名格式',
            icon:'none'
          })
        }
    }else{
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
    }
  }
})