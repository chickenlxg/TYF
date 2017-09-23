var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    activities: [],
    shop_info: [],
    features: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;    
    wx.request({
      url: app.serverURL + '/get/web/swiper.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          banners: res.data
        })
      },
    })
    wx.request({
      url: app.serverURL + '/get/web/activity.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          activities: res.data
        })
      },
    })
    wx.request({
      url: app.serverURL + '/get/configdata.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          shop_info: res.data
        })
      },
    })
    wx.request({
      url: app.serverURL + '/get/web/features.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          features: res.data
        })
      },
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

  navigateToActivity(event) {
    var activityType = event.currentTarget.dataset.activityType;
    var activityId = event.currentTarget.dataset.activityId;
    var activityTitle = event.currentTarget.dataset.activityTitle;
    var productId = event.currentTarget.dataset.productId;
    var activityUrl;
    switch (activityType) {
      case '1':
        activityUrl = "../category-product/category-product?id=" + activityId + '&title=' + activityTitle;
        break;
      case '2':
        activityUrl = "../products/products?id=" + activityId;
        break;
      case '3':
        activityUrl = event.currentTarget.dataset.activityUrl;
        break;
      default:
        break;
    }
    wx.navigateTo({
      url: activityUrl
    });
  },

  navigateToProduct(event) {
    var productId = event.currentTarget.dataset.productId;
    var productUrl = "../products/products?id=" + productId;
    wx.navigateTo({
      url: productUrl
    });
  }

})