var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      mask:false,
      id:'',
      store:'',
      info:'',
      showIndex:3,
      evaList:[],
      pageNo:1,
      pageSize:10,
      service:[],
      mask1: false,
      send: '获取验证码',
      btnStatus: false,
      phone:'',
      code:'',
      quanList:[],
      userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      evaList: [],
      userInfo:wx.getStorageSync('userMsg').userInfo
    });
    wx.showLoading({
      title: '加载中...',
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
  init: function () {
    let that = this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.shopDetail, 'GET', {
      shopId:that.data.id,
      // token:wx.getStorageSync('userMsg').token,
    }, (ret) => {
      ret.data.barberList.forEach(function (item, index) {
        item.headImage = app.renderImage(item.headImage)
      });
      ret.data.serviceItems.forEach(function (item, index) {
        item.imgUrl = app.renderImage(item.imgUrl)
      });
      ret.data.statisticsInfo[0].averageScore = ret.data.statisticsInfo[0].averageScore.toFixed(2);

      that.setData({
        info: ret.data
      })
      wx.hideLoading();
    
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
  //点击领取优惠券
  showMask:function(){
    wx.showLoading({
      title: '加载中...',
    })
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.shopCoupon, 'GET', {
      shopId: that.data.id,
      token: wx.getStorageSync('userMsg').token
    }, (ret) => {
        wx.hideLoading();
        that.setData({
          mask: true,
          quanList:ret.data
        })
    })
    
  },
  hide:function(){
    this.setData({
      mask: false
    })
  },
  //点击查看剪发师信息
  menShow:function(e){
    wx.navigateTo({
      url: '../men/men?id=' + e.currentTarget.dataset.id+'&shopId=' + this.data.id,
    })
  },
  //一键取号
  formSubmit:function(e){
    wx.showLoading({
      title: '取号中',
      mask:true
    });

    let that=this;
    let barber = e.detail.target.dataset.id;
    let name = e.detail.target.dataset.name;
    let person = e.detail.target.dataset.person;
    let hours=e.detail.target.dataset.hours;
    let headImg = e.detail.target.dataset.headimg;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.serviceItem, 'GET', {
      shopId: that.data.id,
      barberId: e.detail.target.dataset.id,
      token: wx.getStorageSync('userMsg').token,
      // formId: e.detail.formId,
    }, (ret) => {
        if(ret.data.length==1){
          app.wxItools.wxItools.request(app.__config.InterfaceUrl.order, 'GET', {
      shopId:that.data.id,
      barberId: e.detail.target.dataset.id,
      serviceItemId:ret.data[0].id,
      // formId: e.detail.formId, 
      token:wx.getStorageSync('userMsg').token
    }, (ret) => {
        wx.hideLoading();
        if(ret.code==100){
          wx.showToast({
            title: ret.msg,
            icon:'none'
          })
          that.setData({
            mask1:true
          })
        }else{
            wx.navigateTo({
              url: '../number/number?orderNo=' + ret.data.orderNo + "&itemName=" + ret.data.itemName + '&orderPrice=' + ret.data.orderPrice + "&waitCount=" + person + "&waitTime=" + hours,
          })
        }

    })
        }else{
            wx.navigateTo({
              url: '../serviceItem/serviceItem?shopId=' + that.data.id + '&barberId=' + barber + '&name=' + name + '&person=' + person + '&hours=' + hours + '&headImg=' + headImg,
            })
        }
    })
    // app.wxItools.wxItools.request(app.__config.InterfaceUrl.order, 'GET', {
    //   shopId:that.data.id,
    //   barberId: e.target.dataset.id,
    //   token:wx.getStorageSync('userMsg').token
    // }, (ret) => {
    //     console.log(ret);
    //     wx.hideLoading();
    //     if(ret.code==100){
    //       wx.showToast({
    //         title: ret.msg,
    //         icon:'none'
    //       })
    //       that.setData({
    //         mask1:true
    //       })
    //     }else{
    //         wx.navigateTo({
    //           url: '../number/number?orderNo=' + ret.data.orderNo + "&itemName=" + ret.data.itemName + '&orderPrice=' + ret.data.orderPrice,
    //       })
    //     }

    // })
    
  },

  evaMore: function () {
      wx.navigateTo({
        url: '../shopEva/shopEva?shopId=' + this.data.id,
      })
  },
  //点击获取验证码
  sendCode: function () {
    wx.showLoading({
      title: '发送中...',
      mask:true
    })
    let mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    if(mobile.test(this.data.phone)){
      let sendCon = this.data.send;
      let that = this;
      if (sendCon == "获取验证码") {
        app.wxItools.wxItools.request(app.__config.InterfaceUrl.sendCode, 'GET', {
          phone:that.data.phone,
          token: wx.getStorageSync('userMsg').token
        }, (ret) => {
            wx.hideLoading();
            if(ret.code==200){
              wx.showToast({
                title: '验证码已发送到'+that.data.phone+'请注意查收',
                icon:'none'
                
              })
              that.secondTime();
            }
        })
      }
    }else{
      wx.showToast({
        title: '请输入正确的手机号码',
        icon:'none'
      })
    }
    
  },
  //隐藏mask
  hideMask1: function () {
    this.setData({
      mask1: false
    })
  },
  //点击banner上的地址跳转到题图
  checkMap:function(){
    wx.openLocation({
      latitude: parseFloat(this.data.info.shopInfo.latitude),
      longitude: parseFloat(this.data.info.shopInfo.longitude),
      scale: 16
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
  //发送验证码的倒计时
  secondTime:function(){
    let that=this;
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
  //绑定手机号码的确定按钮
  bindphone:function(){
    let mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    let that=this;
    if(mobile.test(this.data.phone)){
        if(that.data.code.length>=4){
          app.wxItools.wxItools.request(app.__config.InterfaceUrl.bindPhone, 'GET', {
            phone: that.data.phone,
            code:that.data.code,
            token: wx.getStorageSync('userMsg').token
          }, (ret) => {
              if(ret.code==200){
                wx.showToast({
                  title: ret.msg,
                })
                that.hideMask1();
              }
          })
        }else{
          wx.showToast({
            title: '请输入正确的验证码',
            icon:'none'
          })
        }
    }else{
      wx.showToast({
        title: '请输入手机号码',
        icon:'none'
      })
    }
  },
  //领取优惠券
  lingqu:function(e){
    wx.showLoading({
      title: '领取中...',
      mask:false
    })
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.receiveCoupon, 'GET', {
      shopId:that.data.id,
      couponId:e.currentTarget.dataset.id,
      token: wx.getStorageSync('userMsg').token
    }, (ret) => {
      wx.hideLoading();
        if(ret.code==200){
          wx.showToast({
            title: '领取成功',
          });

        }
    })
  },
  bindGetUserInfo: function (e) {
    let that=this;
    var developer = (wx.getStorageSync('userMsg'));
    developer.userInfo.nickName = e.detail.userInfo.nickName;
    developer.userInfo.headImage = e.detail.userInfo.avatarUrl;
    wx.setStorageSync('userMsg', developer);
    this.init();
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.uploadWxInfo, 'POST', {
      nickName: e.detail.userInfo.nickName,
      headImage: e.detail.userInfo.avatarUrl,
      token: wx.getStorageSync('userMsg').token,
    }, (ret) => {
      if (ret.code == 200) {
        wx.showToast({
          title: '登录成功',
          duration:1500
        });
        that.setData({
          userInfo:wx.getStorageSync('userMsg').userInfo
        })
      }
    })
  }
})