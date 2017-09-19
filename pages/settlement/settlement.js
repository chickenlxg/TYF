var app = getApp();
Page({
  data: {
    address: [],
    cartList: [],
    freight: 0,
    totalPay: 0,
    ok: 1,
    loading: true,
    exec: false,
  },
  //页面刷新重新
  onShow() {
    var that = this;
    wx.request({
      url: app.serverURL + '/get/address.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        res.data.forEach(item => {
          if (item.is_default) {
            that.setData({ address: item })
          }
        });
      },
    });

    wx.request({
      url: app.serverURL + '/get/cart.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var totalNumber = 0;
        var totalPrice = 0;
        var buyNumber = 0;
        var buyPrice = 0;
        res.data.forEach(item => {
          // 保留两位小数点
          item.real_price = item.real_price.toFixed(2);
          item.market_price = item.market_price.toFixed(2);
          if (!item.status) {
            that.setData({ checkedStatus: false });
          } else {
            buyNumber += item.goods_number;
            buyPrice += item.goods_number * item.real_price;
          }
          totalNumber += item.goods_number;
          totalPrice += item.goods_number * item.real_price;
        })
        that.setData({
          cartList: res.data,
          loading: false,
          totalNumber: totalNumber,
          totalPay: totalPrice.toFixed(2),
          buyNumber: buyNumber,
          buyPrice: buyPrice.toFixed(2)
        });
      },
    })

  },
  postOrder() {
    this.setData({ exec: true });

    var that = this;
    wx.request({
      url: app.serverURL + '/get/pay.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.paystatus == 'true' ){
          that.setData({ exec: false });
        }else{
          that.navigateToAddress();
          console.log('false');
          that.setData({
            exec: false,
            
            toast: {
              toastClass: 'yatoast',
              toastMessage: '获取支付验证错误!'
            }
          });
          setTimeout(() => {
            that.setData({
              toast: {
                toastClass: '',
                toastMessage: ''
              }
            });
          }, 2000);
        };    
      }
    });
  },

  navigateToAddress() {
    wx.navigateTo({
      url: '../addresses/addresses',
    });
  }
});
