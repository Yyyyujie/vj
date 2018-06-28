var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      pageNo:1,
      pageSize:10,
      list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
      this.init();
  },
  init:function(){
    let userId ="member.id";
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.commentList, 'POST', {
      token: wx.getStorageSync('userMsg').token,
      [userId]: wx.getStorageSync('userMsg').userInfo.id,
      pageNo:that.data.pageNo,
      pageSize:that.data.pageSize
   }, (ret) => {
     wx.hideLoading();
     wx.stopPullDownRefresh();
      ret.data.forEach(function(item,index){
          if(item.pics){
            item.pics.forEach(function (v, i) {
              item.pics[i] = app.renderImage(v);
            })
          }
          
      });
      that.setData({
        list:[...that.data.list,...ret.data],
        loading: false,
        ajax: ret.data.length < that.data.pageSize ? false : true
      });
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
    this.setData({
      list: [],
      loading: true,
      ajax: true,
      pageNo: 1
    })
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.ajax) {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({
        loading: true,
        pageNo: this.data.pageNo + 1
      })
      this.init();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var index = e.target.dataset.index
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.list[index].pics // 需要预览的图片http链接列表  
    })
  },
})