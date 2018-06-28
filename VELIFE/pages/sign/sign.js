var util = require('../../utils/util.js');
var QQMapWX  = require('../../utils/qqmap-wx-jssdk.min.js');
var app = getApp();

var demo = new QQMapWX({

  key: '3GMBZ-H4WC6-4RFSR-MWX4F-46VDS-5EBFI' // 必填
});
Page({

  /**
   * 页面的初始数据
   * status  0 未上班
   *         1 正在上班 未下班
   *         2 已下班
   */
  data: {
      status:0,
      array: ['08:00 - 09:00', '09:00 - 10:00','10:00 - 11:00'],
      index:1,
      start:'',
      end:'',
      startAddress:'',
      endAddress:'',
      address:'',
      latitude:null,
      longitude:null,
      week:'',
      time:'',
      name:'',
      info:'',
      date: '2016-09-01',//开始时间
      start: '',
      end: ''
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
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    let date = Date.now() ;
    let that=this;
    var str = "星期" + "日一二三四五六".charAt(new Date().getDay());
    var time = util.formatTime(new Date());
    time=time.substring(0,time.indexOf(" "));
    let name=wx.getStorageSync('userInfo').userInfo.name
    
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.checkClock, 'POST', {
      token: wx.getStorageSync('userInfo').token,
    }, (ret) => {
      console.log(ret)
      wx.hideLoading();
      let status=0;
      if(ret.data){
        if (ret.data.upWorkTime == null && ret.data.downWorkTime == null) {
          status = 0;//未打卡 
        } else if (ret.data.upWorkTime && ret.data.downWorkTime == null) {
          status = 1;//上班  未下班
        } else {
          status = 2;//已下班
        }
      }
      console.log(status)
      that.setData({
        week: str,
        time: time,
        name: name,
        status:status,
        info:ret.data
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
  //打卡
  sign:function(){
    wx.showLoading({
      title: '打卡中',
    })


    
    let that=this;
    let time = util.formatTime(new Date).substring((util.formatTime(new Date)).indexOf(" ") + 1, util.formatTime(new Date).length);
    let address;
    //获取当前的经纬度
    wx.getLocation({
      type: 'wgs84',
      success: function (ret) {
        let location={
          latitude:ret.latitude,
          longitude:ret.longitude
        };
        that.setData({
          latitude: ret.latitude,
          longitude: ret.longitude,
        })
        
        //腾讯地图 经纬度转地址
        demo.reverseGeocoder({
          location: location ,
          success: function (res) {
            wx.hideLoading();
            address = res.result.address;


            app.wxItools.wxItools.request(app.__config.InterfaceUrl.clock, 'GET', {
              token: wx.getStorageSync('userInfo').token,
              latitude: that.data.latitude,
              longitude: that.data.longitude,
              address: address
            }, (ret) => {
              console.log(ret)
              let downWorkTime ='info.downWorkTime';
              let add='info.address';
              let upWorkTime ='info.upWorkTime'
              if (that.data.status == 0) {
                that.setData({
                  status: 1,
                  [add]: address,
                  [upWorkTime]:ret.data
                });
              } else if (that.data.status == 1) {
                that.setData({
                  status: 2,
                  [add]: address,
                  [downWorkTime]: ret.data
                });

              }
            })
          },
          // fail: function (res) {
          //   console.log(res);
          // },
          // complete: function (res) {
          //   console.log(res);
          // }
        });
      },
      fail: function (res) {
           wx.showToast({
             title: '打卡失败,请位置授权',
             icon:'none'
           }),
           wx.hideLoading();
          },
    })
    
    
      
  },
  bindPickerChange: function (e) {
    console.log(111);
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    let that = this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.clock, 'GET', {
      token: wx.getStorageSync('userInfo').token,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
      address: that.data.address
    }, (ret) => {

    })
    
  },
  clock:function(){
    let that = this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.clock, 'GET', {
      token: wx.getStorageSync('userInfo').token,
      longitude: that.data.longitude,
      latitude: that.data.latitude,
      address: that.data.address
    }, (ret) => {
      wx.hideLoading();
      console.log(ret)
    })
  }
})