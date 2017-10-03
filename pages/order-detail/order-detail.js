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
    userIntegral: null,
    orderSn: null,
    order: []
  },
  //页面刷新重新
  onLoad(options) {
    this.setData({ orderSn: options.subOrderSn });
    const orderSn = options.subOrderSn;
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/addressGet.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        orderSn: options.subOrderSn
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
        orderSn: options.subOrderSn
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
          totalPay: totalPrice
        });
      },
    });

    wx.request({
      url: app.serverURL + '/get/web/orderStatus.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      data: {
        orderSn: options.subOrderSn
      },
      success: function (res) {


        that.setData({
          order: {
            orderStatus: res.data.status,
            refund_status: res.data.refund_status,
            orderSn: res.data.orderSn,
            isButtonHidden: res.data.status == "待付款" ? true : false,
            creatTime: res.data.creatTime
          }
        });
        console.log(that.data.order);
      }
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
  navigateToAddress() {
    var url = this.data.order.orderStatus == '待付款' ? '../addresses/addresses?type=order-detail&orderSn=' + this.data.orderSn : '';
    if (url) {
      wx.navigateTo({
        url: url,
      });
    }
  },
  payOrder(e) {
    const orderSn = e.target.dataset.orderSn;
    wx.navigateTo({
      url: '../settlement/settlement?orderSn=' + orderSn,
    });
  },
  cancelOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
      content: '你是否需要取消订单',
      showCancel: true,
      success: (res) => {
        console.log(res);
        if (res.confirm == 0) {
          return;
        }

        wx.request({
          url: app.serverURL + '/get/web/cancalOrder.php', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json'
          },
          data: {
            orderSn: orderSn
          },
          success: function (res) {
            that.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '订单已取消！'
              }
            });
            setTimeout(() => {
              that.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                },
              });
              wx.switchTab({
                url: '../user/user',
              });
            }, 1000);
          }
        })
      }
    });
  },
  drawbackOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
      content: '亲，你是否确定退款',
      showCancel: true,
      success: (res) => {
        if (res.confirm == 0) {
          return;
        }

        wx.request({
          url: app.serverURL + '/get/web/drawbackOrder.php', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json'
          },
          data: {
            orderSn: orderSn
          },
          success: function (res) {
            that.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '申请已提交！'
              }
            });
            setTimeout(() => {
              that.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                },
              });
              wx.switchTab({
                url: '../user/user',
              });
            }, 1000);
          }
        })
      }
    });
  },
  confirmOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
      content: '确定收货',
      showCancel: true,
      success: (res) => {
        if (res.confirm == 0) {
          return;
        }
        wx.request({
          url: app.serverURL + '/get/web/confirmOrder.php', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json'
          },
          data: {
            orderSn: orderSn
          },
          success: function (res) {
            that.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '交易成功！'
              }
            });
            setTimeout(() => {
              that.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                },
              });
              wx.switchTab({
                url: '../user/user',
              });
            }, 1000);
          }
        })
      }
    });
  },
  deleteOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
      content: '你是否要删除订单',
      showCancel: true,
      success: (res) => {
        console.log(res);
        if (res.confirm == 0) {
          return;
        }

        wx.request({
          url: app.serverURL + '/get/web/deleteOrder.php', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json'
          },
          data: {
            orderSn: orderSn
          },
          success: function (res) {
            that.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '订单已删除！'
              }
            });
            setTimeout(() => {
              that.setData({
                toast: {
                  toastClass: '',
                  toastMessage: ''
                },
              });
            }, 1000);
            wx.switchTab({
              url: '../user/user',
            });
          }
        })

      }
    });
  }

});
