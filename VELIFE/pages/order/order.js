var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:1,//用于tab切换的显示
    scrollHeight:0,
    list:[],
    pageNo:1,
    pageSize:5,
    status:'',  //待服务 0000
    loading:false,
    ajax:true,
    payStatus:''
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
    
    this.setData({
      status: app.__config.OrderStatus.UNDOSTATUS,
      scrollHeight: wx.getSystemInfoSync().windowHeight - (96 / 2),
      list: [],
      pageNo:1,
      num:1,
      ajax:true
    });
    wx.showLoading({
      title: '加载中...',
    })
    this.init();
    
  },
  init:function(){
    let that = this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.orderList, 'GET', {
      token: wx.getStorageSync('userInfo').token,
      type: 'barber',
      id: wx.getStorageSync('userInfo').userInfo.id,
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      status: that.data.status,
      payStatus:that.data.payStatus
    }, (ret) => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      console.log(ret);
      if (ret.code == 200) {
        ret.data.list.forEach(function(item,index){
          item.member.headImage = app.renderImage(item.member.headImage);
        })
        that.setData({
          list: [...that.data.list, ...ret.data.list],
          loading: false,
          ajax: ret.data.list.length < that.data.pageSize ? false : true
        })
      } else {
        wx.showToast({
          title: ret.data.msg,
          icon: 'none'
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
    this.setData({
      status: this.data.status,
      scrollHeight: wx.getSystemInfoSync().windowHeight - (96 / 2),
      list: [],
      pageNo: 1,
    });
    this.init();
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
  toggle:function(e){
    wx.showLoading({
      title: '加载中...'
    })
    if (e.currentTarget.dataset.num==1){
      this.setData({
        status: app.__config.OrderStatus.UNDOSTATUS,
        num: e.currentTarget.dataset.num,
        list:[],
        pageNo:1,
        payStatus: ''
      })
    } else if (e.currentTarget.dataset.num == 0){
      this.setData({
        status: app.__config.OrderStatus.DONESTATUS,
        num: e.currentTarget.dataset.num,
        list:[],
        pageNo: 1,
        payStatus: ''
      })
    }
    else{
      this.setData({
        status: app.__config.OrderStatus.DONESTATUS,
        num: e.currentTarget.dataset.num,
        list: [],
        pageNo: 1,
        payStatus:0
      })
    }
    this.init();
  },
  //上拉加载
  lower: function () {
    if(this.data.ajax){
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

  //线下支付
  underline:function(e){
    wx.showLoading({
      title: '正在支付...',
    })
    let that = this;
    wx.showActionSheet({
      itemList: ['现金', '支付宝'],
      success: function (res) {
        // console.log(res.tapIndex);
        app.wxItools.wxItools.request(app.__config.InterfaceUrl.orderPay, 'GET', {
          token: wx.getStorageSync('userInfo').token,
          orderId: e.target.dataset.id,
          payType: res.tapIndex+1
        }, (ret) => {
          console.log(ret);

          wx.requestPayment({
            'timeStamp': ret.data.timeStamp,
            'nonceStr': ret.data.nonceStr,
            'package': ret.data.package,
            'signType': ret.data.signType,
            'paySign': ret.data.paySign,
            'success': function (res) {
              that.setData({
                list: [],
                pageNo: 1
              });
              that.init();
            },
            'fail': function (res) {
              console.log(res)
            },
            'complete': function (res) {
              that.hide();
            }
          })



          // if (ret.code == 200) {
          //   wx.hideLoading();
          //   wx.showToast({
          //     title: '该订单已线下支付',
          //   });
          //   that.setData({
          //     list: []
          //   })
          //   that.init();
          // }
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
    
  }
})