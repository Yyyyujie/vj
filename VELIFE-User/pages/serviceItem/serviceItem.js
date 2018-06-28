var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      itemId:'',
      barberId:'',
      shopId:'',
      list:[],
      msg:'',
      price:'',
      index:0,
      mask1:false,
      send: '获取验证码',
      btnStatus: false,
      phone: '',
      code: '',
      person:'',
      hours:'',
      name:'',
      headImg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        barberId: options.barberId,
        shopId: options.shopId,
        person:options.person,
        hours:options.hours,
        name:options.name,
        headImg: options.headImg
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
    wx.showLoading({
      title: '加载中...',
    })
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.serviceItem, 'GET', {
      shopId: that.data.shopId,
      barberId: that.data.barberId,
      token: wx.getStorageSync('userMsg').token
    }, (ret) => {
      wx.hideLoading();
      that.setData({
        list: ret.data,
        itemId: ret.data[0].id,
        index: 0,
        price: ret.data[0].price
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
  radioChange: function (e) {
    this.setData({
      index: e.detail.value,
      price: this.data.list[e.detail.value].price,
      itemId:this.data.list[e.detail.value].id
    });

  },
  formSubmit: function (e) {

    wx.showLoading({
      title: '取号中',
    })
    let that = this;

    app.wxItools.wxItools.request(app.__config.InterfaceUrl.order, 'GET', {
      shopId: that.data.shopId,
      barberId: that.data.barberId,
      serviceItemId:that.data.itemId,
      token: wx.getStorageSync('userMsg').token,
      // formId: e.detail.formId
    }, (ret) => {
      wx.hideLoading();
      if (ret.code == 100) {
        wx.showToast({
          title: ret.msg,
          icon: 'none'
        })
        that.setData({
          mask1: true
        })
      } else if (ret.code == 202) {
        wx.showToast({
          title: ret.msg,
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: '../number/number?orderNo=' + ret.data.orderNo + "&itemName=" + ret.data.itemName + '&orderPrice=' + ret.data.orderPrice + "&waitCount=" + that.data.person + "&waitTime=" + that.data.hours,
        })
      }

    })
  },
  //隐藏mask
  hideMask1: function () {
    this.setData({
      mask1: false
    })
  },
  //绑定手机号码的确定按钮
  bindphone: function () {
    let mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    let that = this;
    if (mobile.test(this.data.phone)) {
      if (that.data.code.length >= 4) {
        app.wxItools.wxItools.request(app.__config.InterfaceUrl.bindPhone, 'GET', {
          phone: that.data.phone,
          code: that.data.code,
          token: wx.getStorageSync('userMsg').token
        }, (ret) => {
          if (ret.code == 200) {
            wx.showToast({
              title: ret.msg,
            })
            that.hideMask1();
          }
        })
      } else {
        wx.showToast({
          title: '请输入正确的验证码',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
    }
  },
  //点击获取验证码
  sendCode: function () {
    wx.showLoading({
      title: '发送中...',
      mask: true
    })
    let mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (mobile.test(this.data.phone)) {
      let sendCon = this.data.send;
      let that = this;
      if (sendCon == "获取验证码") {
        app.wxItools.wxItools.request(app.__config.InterfaceUrl.sendCode, 'GET', {
          phone: that.data.phone,
          token: wx.getStorageSync('userMsg').token
        }, (ret) => {
          console.log(ret)
          wx.hideLoading();
          if (ret.code == 200) {
            wx.showToast({
              title: '验证码已发送到' + that.data.phone + '请注意查收',
              icon: 'none'

            })
            that.secondTime();
          }
        })
      }
    } else {
      wx.showToast({
        title: '请输入正确的手机号码',
        icon: 'none'
      })
    }

  },
  //发送验证码的倒计时
  secondTime: function () {
    let that = this;
    let second = 60;
    that.setData({
      send: second + "S后重发"
    })
    let inter = setInterval(function () {
      second--;
      that.setData({
        send: second + "S后重发"
      })
      if (second == 0) {
        clearInterval(inter);
        that.setData({
          send: "获取验证码",
          btnStatus: false
        })
      }
    }, 1000);
    that.setData({
      btnStatus: true
    })
  },
  //手机号码输入
  phoneNum: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //验证码输入
  codeNum: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
})