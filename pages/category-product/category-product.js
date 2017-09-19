var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    products: [],
    currentPage: 1,
    perPage: 6
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var categoryId = options.id;
    var pageData = new Object();
    pageData.page = this.data.currentPage;    //下拉显示产品
    pageData.per_page = this.data.perPage;    //下拉显示产品
    wx.request({
      url: app.serverURL + '/get/products.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          products: res.data
        })
      },
    })
  },
  navigateToProduct(event) {
    var productId = event.currentTarget.dataset.goodsId;
    wx.navigateTo({
      url: '../products/products?id=' + productId
    });
  }
  // ,lower : function (option) {                                 //下拉加载数据
  //   var categoryId = option.id;
  //   console.log('lower more products data');
  //   wx.showNavigationBarLoading();
  //   var that = this;
  //   setTimeout(() => {
  //     wx.hideNavigationBarLoading();
  //     var nextPageData = new Object();
  //     nextPageData.per_page = this.data.perPage;
  //     nextPageData.page = this.data.currentPage + 1;
  //     var products = serviceData.categoryData;
  //     this.setData({ currentPage: ++this.data.currentPage });
  //     this.setData({ products: this.data.products.concat(products) });//concat 拼接在一起

  //   }, 1000);
  // }
})