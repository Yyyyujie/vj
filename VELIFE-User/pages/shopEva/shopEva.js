// pages/shopEva/shopEva.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId:'',
    pageNo:1,
    pageSize:10,
    newList:[],
    evaList:[],
    ajax:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shopId:options.shopId
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
      
      this.init();
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
  init:function(){
    wx.showLoading({
      title: '加载中...',
    });
    let that = this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.shopEva, 'GET', {
      shopId: that.data.shopId,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize
    }, (ret) => {
      wx.hideLoading();
      if(ret.data.page.list.length<that.data.pageSize){
        that.setData({
          evaList: [...that.data.evaList, ...ret.data.page.list],
          newList: ret.data.top5Comment,
          ajax:false
        })
      }else{
        that.setData({
          evaList: [...that.data.evaList, ...ret.data.page.list],
          newList: ret.data.top5Comment,
          ajax:true
        })
      }
      
    });
  },
  //上拉加载
  lower:function(){
    if(this.data.ajax){
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({
        pageNo: this.data.pageNo + 1
      });
      this.init();
    }
      
  } 
})