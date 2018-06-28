var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    map: false,
    longitude:'',
    latitude:'',
    markStatus:false,
    markIndex:'',
    index:0,
    markers: [],
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ], 
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular:true,
    list:[],
    pageNo:1,
    pageSize:10,
    scrollHeight:0,
    loading:false,
    ajax:false,
    imgalist: ['http://panlqe4r5.bkt.clouddn.com/qrcode.jpg']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    let that=this;
      wx.login({
        success:function(res){
          wx.setStorageSync('userMsg', {
            code:res.code
          });
          console.log(res)
          app.wxItools.wxItools.request(app.__config.InterfaceUrl.login, 'POST', {
            code:res.code
          }, (ret) => {
            console.log(ret);
                let tokenStr ='userMsg.token';
                wx.setStorageSync('userMsg', {
                  code: res.code,
                  token: ret.data.token,
                  userInfo:ret.data.userInfo
                });
                wx.getLocation({
                  type: 'wgs84',
                  success: function (res) {
                    
                    that.setData({
                      longitude: res.longitude,
                      latitude: res.latitude,
                      list: [],
                      pageNo: 1
                      // markers:[]
                      //  markers: that.data.markers
                    })
                    that.map();
                    that.init();
                  }
                })
                
          })
        }
      });
     
      
     
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this;
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
   * 页面上拉触底事件的处理函数
   */
map:function(){
  let that=this;
  app.wxItools.wxItools.request(app.__config.InterfaceUrl.mapShops, 'GET', {
    longitude: that.data.longitude,
    latitude: that.data.latitude,
    // token: wx.getStorageSync('userMsg').token
  }, (ret) => {
    ret.data.forEach(function (item, index) {
      item.distance = app.renderMel(item.distance);
      let str = {
        iconPath: "../../images/mark.png",
        id: index,
        markId: item.id,
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        width: 30,
        height: 30,
        store: item.shopName,
        selectIconPath: '../../images/mark_selected.png',
        waitPerson: item.serviceCount,
        distance: item.distance,
        address: item.address,
        status: false
      }
      that.data.markers.push(str);
      that.setData({
        map: true,
        index: that.data.index + 1,
        markers: that.data.markers,
      })
    })
  })
},
  // check: function () {
  //   wx.getSetting({
  //     success:function(res){
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称
  //         wx.getUserInfo({
  //           success: function (res) {
  //           }
  //         })
  //       }else{
  //         wx.getUserInfo({
  //           success: function (res) {
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  init:function(){
    let that=this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.nearbyStore, 'GET', {
      longitude: that.data.longitude,
      latitude: that.data.latitude,
      pageNo:that.data.pageNo,
      pageSize:that.data.pageSize
    }, (ret) => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      ret.data.forEach(function (item, index) {
        item.distance = app.renderMel(item.distance);
        })
      that.setData({
        list: [...that.data.list, ...ret.data],
        loading: false,
        
         ajax:ret.data.length<that.data.pageSize?false:true
      })
    })
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
      pageNo:1,
      list:[]
    })
    this.init();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.ajax){
      wx.showLoading({
        title: '加载中...',
      })
       this.data.loading = true;
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
  //点击地图上的标记
  markertap(e) {
    let str = "markers[" + e.markerId +"].status";
    let icon = "markers[" + e.markerId +"].iconPath"
    let that=this;
    this.data.markers.forEach(function(item,index){
      if (index != e.markerId){
        let status="markers["+index+"].status";
        let iconpath = "markers[" + index +"].iconPath";
        that.setData({
          [status] :false,
          [iconpath] : '../../images/mark.png'
        })
      }
    });
    this.setData({
      markStatus: !this.data.markers[e.markerId].status,
      [str]: !this.data.markers[e.markerId].status,
      markIndex: e.markerId,
      [icon]: this.data.markers[e.markerId].status ? '../../images/mark.png' : this.data.markers[e.markerId].selectIconPath
    });
    // this.data.list[e.markerId]
  },
  //点击去剪发 进入店铺查看信息
  goto:function(e){
    console.log(JSON.stringify(e))
     wx.navigateTo({
       url: '../store/store?id=' + e.currentTarget.dataset.id
     })
    
  },
  seenPic(e){
    wx.previewImage({
      current: 'http://panlqe4r5.bkt.clouddn.com/qrcode.jpg', // 当前显示图片的http链接   
      urls: this.data.imgalist // 需要预览的图片http链接列表   
    }) 
  }
})
