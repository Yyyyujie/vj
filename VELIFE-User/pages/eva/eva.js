var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      imgArr:[],
      barberId:'',
      barberName:'',
      shopId:'',
      shopName:'',
      con:'',
      level:0,
      imgPath:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      barberId: options.barberId,
      barberName: options.barberName,
      shopId: options.shopId,
      shopName: options.shopName,
      orderId:options.orderId
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
  choose:function(){
    let that=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let file = res.tempFilePaths[0].toString();
        app.wxItools.wxItools.uploadFile(app.__config.basePath + app.__config.InterfaceUrl.upload, file, 'files', {
          token: wx.getStorageSync('userMsg').token
        }, (ret) => {
            if(ret.code==200){
              that.setData({
                imgArr: [...that.data.imgArr, ...res.tempFilePaths],
                imgPath:that.data.imgPath+ret.data.imgPath
              });

            }
        })

        
      }
    })
  },
  //评分
  star:function(e){
    this.setData({
      level: e.currentTarget.dataset.index+1
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.imgArr // 需要预览的图片http链接列表  
    })
  },
  //绑定con
  con:function(e){
      this.setData({
        con: e.detail.value
      })
  },
   sub:function(){
     wx.showLoading({
       title: '提交中...',
     })
     let that=this;
     let con = that.data.con.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
     console.log(con);
     if(that.data.level!=0){
        if(that.data.con.length>=5){
          let barberId="barber.id";
          let shopVelifeId='shopVelife.id';
          app.wxItools.wxItools.request(app.__config.InterfaceUrl.commentAdd, 'POST', {
            [barberId]:that.data.barberId,
            [shopVelifeId]:that.data.shopId,
            starLevel:that.data.level,
            conten: con,
            imgPath: that.data.imgPath,
            token: wx.getStorageSync('userMsg').token,
            nickName:wx.getStorageSync('userMsg').userInfo.nickName,
            headImage: wx.getStorageSync('userMsg').userInfo.headImage,
            orderId:that.data.orderId
          }, (ret) => {
            if(ret.code==200){
              wx.hideLoading();
              wx.showToast({
                title: '评价成功',
              })
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }else{
          wx.showToast({
            title: '评价至少5个字符',
            icon: 'none'
          })
        }
     }else{
       wx.showToast({
         title: '评分至少为1分',
         icon:'none'
       })
     }
   }
})