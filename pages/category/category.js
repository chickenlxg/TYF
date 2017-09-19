var app = getApp();
Page({
  data: {
    categories: []
  },
  navigateToCategoryProduct(event) {
    var categoryId = event.currentTarget.dataset.cateId;
    wx.navigateTo({
      url: '../category-product/category-product?id=' + categoryId,
    })
  },
  onLoad() {
    var that = this;
    wx.request({
      url: app.serverURL + '/get/cateData.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          categories: res.data
        })
      },
    })
  }
});
