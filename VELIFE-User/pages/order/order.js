var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      tab:[{
        name:'待消费',
        index:0
      },
        {
          name: '服务中',
          index: 1
        },
        {
          name: '已完成',
          index: 2
        },
        {
          name: '已取消',
          index: 3
        }],
        activeIndex:0,
        pageNo:1,
        pageSize:10,
        list:[],
        scrollHeight:0,
        status:'',
        mask:false,
        orderId:'',
        quanList:[],
        couponId:'',
        select:-1,
        money:0,
        newMoney:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let status = app.__config.OrderStatus.UNDOSTATUS;
    this.setData({
      list: [],
      scrollHeight: wx.getSystemInfoSync().windowHeight - 50 / 2,
      status: status,
      pageNo: 1
    });

   
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
    this.setData({
      list: [],
      scrollHeight: wx.getSystemInfoSync().windowHeight - 50 / 2,
      pageNo: 1,
      couponId: '',
      select: -1,
    });
    this.init();
  },
  init:function(){
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.orderList, 'GET', {
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      token: wx.getStorageSync('userMsg').token,
      orderStatus: that.data.status
    }, (ret) => {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        that.setData({
          list:[...that.data.list,...ret.data]
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
    this.setData({
      pageNo: 1,
      list: [],
      mask:false
    })
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中...',
    })
    // this.data.loading = true;
    this.setData({
      loading: true,
      pageNo: this.data.pageNo + 1
    })
    // this.data.pageNo++;
    this.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  toggle:function(e){
    console.log(e)
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    let status;
    if (e.currentTarget.dataset.id == 0) {
      status = app.__config.OrderStatus.UNDOSTATUS
    } else if (e.currentTarget.dataset.id == 1) {
      status = app.__config.OrderStatus.DOINGSTATUS
    } else if (e.currentTarget.dataset.id == 2) {
      status = app.__config.OrderStatus.DONESTATUS
    } else {
      status = app.__config.OrderStatus.CANCELSTATUS
    };
    this.setData({
      activeIndex:e.target.dataset.id,
      list:[],
      status:status,
      pageNo:1
    });
    
    this.init();
  },
  eva:function(e){
    console.log(e);
    let barberId=this.data.list[e.target.dataset.index].barber.id;
    let shopId = this.data.list[e.target.dataset.index].shopVelife.id;
    let shopName = this.data.list[e.target.dataset.index].shopVelife.shopName;
    let barberName = this.data.list[e.target.dataset.index].barber.name;
    let orderId = this.data.list[e.target.dataset.index].id;
    wx.navigateTo({
      url: '../eva/eva?barberId=' + barberId + '&shopId=' + shopId + "&barberName=" + barberName + "&shopName=" + shopName + "&orderId=" + orderId
    })
  },
  //取消订单
  cancel: function (e) {
    wx.showLoading({
      title: '取消中...',
    })
    let that=this;
    let orderId = e.target.dataset.order;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.cancelOrder, 'GET', {
      orderId: orderId,
      token: wx.getStorageSync('userMsg').token,
    }, (ret) => {
      console.log(ret);
      wx.hideLoading();
      if(ret.code==200){
        let status = app.__config.OrderStatus.UNDOSTATUS;
        that.setData({
          list: [],
          scrollHeight: wx.getSystemInfoSync().windowHeight - 50 / 2,
          status: status,
          pageNo: 1
        });
        if (ret.msg){
          wx.showToast({
            title: ret.msg,
            icon:'none'
          })
        }
        setTimeout(function(){
          that.init();
        },500)
        
      }
    })
  },
  //去支付
  pay:function(e){
    wx.showLoading({
      title: '加载中...',
      mask:false
    })
    console.log(e);
    let orderId = e.target.dataset.order;
    let money = e.target.dataset.money;
    let that=this;
    this.setData({
      orderId: orderId,
      money: money,
      newMoney:money,
      mask:true,
      couponId: '',
      select: -1,
    });
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.userCoupon, 'GET', {
      token: wx.getStorageSync('userMsg').token,
    }, (ret) => {
        console.log(ret);
        wx.hideLoading();
        that.setData({
          quanList:ret.data
        })
    })

  },
  //隐藏mask
  hide: function () {
    this.setData({
      mask: false
    })
  },
  paySure:function(){
    wx.showLoading({
      title: '加载中...',
    })
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.pay, 'GET', {
      orderId: that.data.orderId,
      token: wx.getStorageSync('userMsg').token,
      couponId: that.data.couponId
    }, (ret) => {
      wx.hideLoading();
      if (ret.code == 200) {
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
            that.hide();
            that.init();
          },
          'fail': function (res) {
            console.log(res)
          },
          'complete':function(res){
            that.hide();
          }
        })
      }
    })
  },
  //选择优惠券
  choose:function(e){
    console.log(e)
    let type = e.currentTarget.dataset.type;
    let num = e.currentTarget.dataset.num;
    if(num>this.data.money){
      num=this.data.money
    }
    console.log(num)
    if (e.currentTarget.dataset.index==this.data.select){
      this.setData({
        couponId: '',
        select: -1,
        newMoney:this.data.money
      })
    }else{
      this.setData({
        couponId: e.currentTarget.dataset.id,
        select: e.currentTarget.dataset.index,
        newMoney: type == 1 ? this.data.money * num : this.data.money - num
      })
    }
    
  }
})