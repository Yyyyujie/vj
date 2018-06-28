var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img0:'',
    img1: '',
    img2: '',
    img11: '',
    showIndex:0,
    tab:["参考发型","发型历史"],
    checkIMg:'../../images/hair.png',
    mask:false,
    index:0,
    btnGroup:true,
    type:0,
    list:[]
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
    this.init();
  },
  init:function(){
    let that = this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.history, 'GET', {
      type: 0,
      token: wx.getStorageSync('userMsg').token,
    }, (ret) => {
      ret.data.forEach(function (item, index) {
        let str = 'img' + index;
        that.setData({
          [str]: app.renderImage(ret.data[index].image)
        })
      })
    })
  },
  init2:function(){
    let that = this;
    app.wxItools.wxItools.request(app.__config.InterfaceUrl.history, 'GET', {
      type: 1,
      token: wx.getStorageSync('userMsg').token,
    }, (ret) => {
      ret.data.forEach(function (item, index) {
        item.image = app.renderImage(ret.data[index].image);
      })
      that.setData({
        list:ret.data
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
  changeImg1:function(){

  },
  changeImg1:function(){
    let that=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        that.setData({
          img11:res.tempFilePaths[0]
        })
      },
    })
  },
  changeImg2: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          img22: res.tempFilePaths[0]
        })
      },
    })
  },
  changeImg3: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          img33: res.tempFilePaths[0]
        })
      },
    })
  },
  changeImg: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        that.setData({
          img11: res.tempFilePaths[0]
        })
      },
    })
  },
  tabToggle:function(e){
    this.setData({
      showIndex: e.target.dataset.index
    })
    if (e.target.dataset.index==0){
        this.init();
    }else{
      this.init2();
    }
  },
  upload:function(){
    let file = this.data.img11;
    let that=this;
    app.wxItools.wxItools.uploadFile(app.__config.basePath + app.__config.InterfaceUrl.uploadHair, file, 'files', {
      token: wx.getStorageSync('userMsg').token
    }, (ret) => {
        if(ret.code==200){
          wx.showToast({
            title: '上传成功',
          });
          that.hide1();
          that.init();
          // let imgStr="img"+that.data.index-1;
         
          // that.setData({
          //   [imgStr]: file
          // })
        }
    })
  },
  show:function(e){
    let index = e.currentTarget.dataset.index;
    if(index==1){
      this.setData({
        mask: true,
        img11: this.data.img0,
        index:index
      })
      if (this.data.img0!=''){
        this.setData({
          btnGroup:false
        })
      } else {
        this.setData({
          btnGroup: true
        })
      }
    }else if(index==2){
      this.setData({
        mask: true,
        img11: this.data.img1,
        index: index
      })
      if (this.data.img1!= '') {
        this.setData({
          btnGroup: false
        })
      }else{
        this.setData({
          btnGroup: true
        })
      }
    }else{
      this.setData({
        mask: true,
        img11: this.data.img2,
        index: index
      })
      if (this.data.img2 != '') {
        this.setData({
          btnGroup: false
        })
      } else {
        this.setData({
          btnGroup: true
        })
      }
    }
    
  },
  hide1:function(){
    this.setData({
      mask: false,
      img11: '../../images/hair.png'
    })
  }
  
})