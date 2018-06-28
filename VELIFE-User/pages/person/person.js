var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:"",
    array: ['60后', '70后', '80后','90后','00后'],
    index: 3,
    array1: ['男', '女'],
    index1:0,
    send:'获取验证码',
    btnStatus:false,
    phone:'',
    code:'',
    zhiw:'',
    mask1:false,
    mask2:false,
    userInfo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    });
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.userInfo, 'GET', {
      token: wx.getStorageSync('userMsg').token,
    }, (ret) => {
      wx.hideLoading();
      this.setData({
        phone: ret.data.mobile,
        zhiw: ret.data.profession ? ret.data.profession : "未知",
        index: this.data.array.indexOf(ret.data.age) > -1 ? this.data.array.indexOf(ret.data.age) : 3,
        index1: ret.data.sex == 1 ? 0 : 1,
        userInfo: wx.getStorageSync('userMsg').userInfo
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
  //上传头像
  upTx:function(){
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        that.setData({
          img: res.tempFilePaths[0]
        })
      },
    })
  },
  bindPickerChange: function (e) {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      index: e.detail.value
    });
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.updateAge, 'GET', {
      age: that.data.array[e.detail.value],
      token: wx.getStorageSync('userMsg').token,
    }, (ret) => {
      if(ret.code==200){
        wx.hideLoading();
      }
    })
  },
  bindPickerChange1: function (e) {
    this.setData({
      index1: e.detail.value
    });
    let that = this;
    let sex;
    if (e.detail.value==0){
      sex=1
    }else{
      sex=2
    }
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.updateSex, 'GET', {
      sex: sex,
      token: wx.getStorageSync('userMsg').token,
    }, (ret) => {
      if (ret.code == 200) {
        wx.hideLoading();
      }
    })
  },
  //点击获取验证码
  sendCode: function () {
    wx.showLoading({
      title: '请稍等...',
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
          if (ret.code == 200) {
            wx.hideLoading();
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
  phoneNum:function(e){
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
  //职业输入
  zhiw:function(e){
    this.setData({
      zhiw: e.detail.value
    })
  },
  //点击手机号码  显示mask
  showMask1:function(){
    this.setData({
      mask1: true
    })
  },
  hideMask1: function () {
    this.setData({
      mask1: false
    })
  },
  showMask2: function () {
    this.setData({
      mask2: true
    })
  },
  hideMask2: function () {
    this.setData({
      mask2: false
    })
  },
  //绑定手机号码的确定按钮
  bindphone: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    let mobile = /^[1][3,4,5,7,8][0-9]{9}$/;
    let that = this;
    if (mobile.test(this.data.phone)) {
      if (that.data.code.length >= 4) {
        app.wxItools.wxItools.request(app.__config.InterfaceUrl.updateMoile, 'GET', {
          phone: that.data.phone,
          code: that.data.code,
          token: wx.getStorageSync('userMsg').token
        }, (ret) => {
          if (ret.code == 200) {
            wx.hideLoading();
            wx.showToast({
              title: '修改成功',
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
  zhiwSure:function(){
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.updateProfession, 'GET', {
      text:that.data.zhiw,
      token: wx.getStorageSync('userMsg').token
    }, (ret) => {
      if(ret.code==200){
        wx.showToast({
          title: '修改成功',
        })
        that.hideMask2()
      }
    })
  }
})