// pages/shopEva/shopEva.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: '',
    pageNo: 1,
    pageSize: 10,
    newList:[],
    evaList: [],
    ajax: true,
    active:0,
    fiveGroup:'',
    scrollHeight:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      shopId: options.shopId,
      barberId: options.barberId,
      starLevel: options.starLevel,
      scrollHeight: wx.getSystemInfoSync().windowHeight - 100 / 2
    });
    wx.showLoading({
      title: '加载中...',
    });
    this.setData({
      evaList: []
    })
    this.init();
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
  init: function () {
    let that = this;
    let str = 'barber.id';
    let shopId ='shopVelife.id'
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.barberCommon, 'GET', {
      token:wx.getStorageSync('userMsg').token,
      [shopId]: that.data.shopId,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      [str]:that.data.barberId,
      starLevel: that.data.starLevel
    }, (ret) => {
      wx.hideLoading();
      ret.data.list.forEach(function (item, index) {
        if (item.pics) {
          item.pics.forEach(function (v, i) {
            item.pics[i] = app.renderImage(v);
          })
        }

      })
      that.setData({
        evaList: [...that.data.evaList, ...ret.data.list],
        newList: ret.data.top5Comment,
        fiveGroup:ret.data.dataMap,
        ajax: ret.data.list.length < that.data.pageSize?false:true
      })
      // if (ret.data.list.length < that.data.pageSize) {
        
      // } else {
      //   that.setData({
      //     evaList: [...that.data.evaList, ...ret.data.list],
      //     newList: ret.data.top5Comment,
      //     ajax: true
      //   })
      // }

    });
  },
  //上拉加载
  lower: function () {
    if (this.data.ajax) {
      wx.showLoading({
        title: '加载中...',
      })
      this.setData({
        pageNo: this.data.pageNo + 1
      });
      this.init();
    }

  },
  toggle:function(e){
    wx.showLoading({
      title: '加载中...',
    })
    console.log(e)
      this.setData({
        active: e.currentTarget.dataset.index,
        starLevel: e.currentTarget.dataset.num,
        evaList:[]
      });
      this.init();
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var index = e.target.dataset.index
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.evaList[index].pics, // 需要预览的图片http链接列表  
      success:function(){
        console.log(1)
      }
    })
  },
})