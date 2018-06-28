var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    shopId:'',
    barberId:'',
    info:"",
    arr1:['多','正常','少'],
    arr2:['软','普通','硬'],
    arr3:['圆形','椭圆','四角','逆三角','菱形','正三角'],
    indexGroup:[],
    commentList:[],
    km:0,
    mask1:false,
    send: '获取验证码',
    btnStatus: false,
    phone: '',
    code: '',
    toView:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     barberId:options.id,
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
    wx.showLoading({
      title: '加载中...',
    })
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
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.barberInfo, 'GET', {
      token: wx.getStorageSync('userMsg').token,
      barberId:that.data.barberId,
      shopId:that.data.shopId
    }, (ret) => {
      wx.hideLoading();
      ret.data.barberInfo.headImage = app.renderImage(ret.data.barberInfo.headImage);
      that.setData({
        info:ret.data,
        km: app.renderMel(ret.data.shopInfo.distance)
      })
     
      ret.data.productionList.forEach(function(item,index){
        that.data.arr1.forEach(function(aa,bb){
          if (aa == item.hairNumber){
            let str = "indexGroup[" + index +"].actIndex1";
            that.setData({
              [str]:bb
            })
          }
        });
        that.data.arr2.forEach(function (aa, bb) {
          if (aa == item.hairQuality) {
            let str = "indexGroup[" + index + "].actIndex2";
            that.setData({
              [str]: bb
            })
          }
        });
        that.data.arr3.forEach(function (aa, bb) {
          if (aa == item.faceType) {
            let str = "indexGroup[" + index + "].actIndex3";
            that.setData({
              [str]: bb
            })
          }
        })
      })
    })
    this.commentLit();
  },
  commentLit:function(){
    let str ='barber.id';
    let that=this;
    let shopId = 'shopVelife.id'
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.barberCommon, 'GET', {
      token: wx.getStorageSync('userMsg').token,
      [str]: that.data.barberId,
      [shopId]: that.data.shopId,
      pageNo:1,
      pageSize:3
    }, (ret) => {
        that.setData({
          // commentList: [...that.data.commentList,...ret.data],
          commentList: ret.data.list
        })
    })
  },
  quhao: function () {
    wx.showLoading({
      title: '取号中',
    })
    let that = this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.order, 'GET', {
      shopId: that.data.info.shopInfo.id,
      barberId: that.data.barberId,
      token: wx.getStorageSync('userMsg').token
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
      } else if(ret.code==202){
        wx.showToast({
          title: ret.msg,
          icon: 'none'
        })
      }else {
        wx.navigateTo({
          url: '../number/number',
        })
      }

    })
  },
  formSubmit:function(e){
    wx.showLoading({
      title: '取号中',
      mask: true
    })
    let that = this;
    let barber = that.data.info.barberInfo.id;
    let name = that.data.info.barberInfo.name;
    let person = that.data.info.barberInfo.waitPersons;
    let hours = that.data.info.barberInfo.waitHours;
    let headImg = that.data.info.barberInfo.headImage;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.serviceItem, 'GET', {
      shopId: that.data.info.shopInfo.id,
      token: wx.getStorageSync('userMsg').token
    }, (ret) => {
      if (ret.data.length == 1) {
        app.wxItools.wxItools.request(app.__config.InterfaceUrl.order, 'GET', {
          shopId: that.data.info.shopInfo.id,
          barberId: e.detail.target.dataset.id,
          serviceItemId: ret.data[0].id,
          // formId: e.detail.formId,
          token: wx.getStorageSync('userMsg').token
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
          } else {
            wx.navigateTo({
              url: '../number/number?orderNo=' + ret.data.orderNo + "&itemName=" + ret.data.itemName + '&orderPrice=' + ret.data.orderPrice + "&waitCount=" + person + "&waitTime=" + hours,
          })
          }

        })
      } else {
        wx.navigateTo({
          url: '../serviceItem/serviceItem?shopId=' + that.data.info.shopInfo.id + '&barberId=' + barber + '&name=' + name + '&person=' + person + '&hours=' + hours + '&headImg=' + headImg,
        })
      }
    })
  },
  //图片预览
  previewImage:function(e){
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: current // 需要预览的图片http链接列表  
    })  
  },
  //点击获取验证码
  sendCode: function () {
    wx.showLoading({
      title: '发送中...',
      mask: true
    })
    let mobile = /^[1][3,4,5,7,8,9][0-9]{9}$/;
    if (mobile.test(this.data.phone)) {
      let sendCon = this.data.send;
      let that = this;
      if (sendCon == "获取验证码") {
        app.wxItools.wxItools.request(app.__config.InterfaceUrl.sendCode, 'GET', {
          phone: that.data.phone,
          token: wx.getStorageSync('userMsg').token
        }, (ret) => {
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
  //隐藏mask
  hideMask1: function () {
    this.setData({
      mask1: false
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
  scrollToViewFn:function(e){
    var _id = e.target.dataset.id;
    this.setData({
      toView: 'inToView' + _id
    }) 
  },
  seeMore:function(){
    wx.navigateTo({
      url: '../menEvaList/menEvaList?shopId=' + this.data.shopId + '&barberId=' + this.data.barberId + '&starLevel=5',
    })
  },
  evaList:function(e){
    wx.navigateTo({
      url: '../menEvaList/menEvaList?shopId=' + this.data.shopId + '&barberId=' + this.data.barberId +'&starLevel='+e.currentTarget.dataset.score,
    })
  }
})