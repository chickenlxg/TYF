var app = getApp();
Page({
  data: {
    address: [],
    cartList: [],
    freight: 0,
    totalPay: 0,
    wxPay: 0,
    ok: 1,
    loading: true,
    exec: false,
    userIntegral: null,
    orderSn: null
  },
  //页面刷新重新
  onLoad(options) {
    this.setData({ orderSn: options.orderSn });
    const orderSn = options.orderSn;
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/addressGet.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        orderSn: options.orderSn
      },
      success: function (res) {
        that.setData({ address: res.data })
      },
    });

    wx.request({
      url: app.serverURL + '/get/web/cart.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      data: {
        orderSn: options.orderSn
      },
      success: function (res) {
        var totalNumber = 0;
        var totalPrice = 0;
        res.data.forEach(item => {
          // 保留两位小数点
          // item.goods_price = item.goods_price.toFixed(2);
          // item.market_price = item.market_price.toFixed(2);
          totalNumber += item.PNUM;
          totalPrice += item.PNUM * item.goods_price;
        })
        that.setData({
          cartList: res.data,
          loading: false,
          totalNumber: totalNumber,
          totalPay: totalPrice,
          wxPay: totalPrice * 0.04
        });
      },
    });

    wx.request({
      url: app.serverURL + '/get/web/integral.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID
      },
      success: function (res) {
        that.setData({ userIntegral: res.data.integral })
      },
    });

  },



  postOrder(options) {
    this.setData({ exec: true });

    var that = this;
    if (this.data.totalPay > this.data.userIntegral) {
      that.setData({
        exec: false,

        toast: {
          toastClass: 'yatoast',
          toastMessage: '积分不足'
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
    } else {
      wx.request({
        url: app.serverURL + '/get/web/pay.php', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json'
        },
        data: {
          userID: app.globalData.userID,
          orderSn: this.data.orderSn,
          totalPay: this.data.totalPay,
          userIntegral: this.data.userIntegral
        },
        success: function (res) {
          if (res.statusCode == '200') {
            that.setData({ exec: false });
            wx.switchTab({
              url: '../user/user',
            });
          } else {
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
    }
  },
  wxpostOrder(options) {
    this.setData({ exec: true });

    var that = this;

    wx.request({
      url: app.serverURL + '/wxpay/payfee.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        orderSn: that.data.orderSn,
        wxPay: that.data.wxPay
      },
      success: function (res) {
        if (res.statusCode == '200') {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function (res) {
              wx.request({
                url: app.serverURL + '/wxpay/wxorder.php', //仅为示例，并非真实的接口地址
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  orderSn: that.data.orderSn
                },
                success: function (res) {
                  that.setData({ exec: false });
                  wx.switchTab({
                    url: '../user/user',
                  });
                },
              });
            },
            'fail': function (res) {
              that.setData({
                exec: false,

                toast: {
                  toastClass: 'yatoast',
                  toastMessage: '支付失败!'
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
            }
          })
        }
      }
    });
  },
  navigateToAddress() {
    wx.navigateTo({
      url: '../addresses/addresses?type=settlement&orderSn=' + this.data.orderSn,
    });
  }
});
