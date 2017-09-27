var app = getApp();
Page({
  data: {
    loading: false,
    activeNav: 'all',
    navs: [{
      text: '全部',
      alias: 'all'
    }, {
      text: '待付款',
      alias: 'unpaid'
    }, {
      text: '待发货',
      alias: 'undelivered'
    }, {
      text: '待收货',
      alias: 'unreceived'
    }],
    orderList: []
  },
  onLoad(options) {
    const that = this;
    if (options.t) {
      this.setData({
        activeNav: options.t
      });
    }

    wx.request({
      url: app.serverURL + '/get/web/olderdata.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        activeNav: this.data.activeNav
      },
      success: function (res) {
        that.setOrderData(res.data);
        that.setData({
          orderList: res.data,
          loading: false
        });
        console.log(that.data.orderList);
        
      },
    })
  },
  setOrderData(data) {
    data.forEach((itm) => {
      var totalNumber = 0;
      var totalPrice = 0;
      itm.goods.forEach(item => {
        // 保留两位小数点
        // item.goods_price = item.goods_price.toFixed(2);
        // item.market_price = item.market_price.toFixed(2);
        item.PNUM *= 1;
        totalNumber += item.PNUM;
        totalPrice += item.PNUM * item.goods_price;
      })

      itm.totalNumber = totalNumber;
      itm.totalPay = totalPrice;
      itm.order = {
        orderStatus: itm.status,
        orderSn: itm.orderSn,
        subOrderSn : itm.sub_order_sn,
        isButtonHidden: itm.status == "未付款" ? true: false,
      };
    });
    return data;
  },
  changeList(e) {
    const that = this;
    const alias = e.target.dataset.text;

    if (alias !== this.data.activeNav) {
      this.setData({
        activeNav: e.target.dataset.text,
        loading: true
      });

      wx.request({
        url: app.serverURL + '/get/web/olderdata.php', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json'
        },
        data: {
          userID: app.globalData.userID,
          activeNav: e.target.dataset.text
        },
        success: function (res) {
          that.setOrderData(res.data);
          that.setData({
            orderList: res.data,
            loading: false
          });

        },
      })
    }
  },
  // getList() {
  //   const data = {
  //     type: this.data.activeNav,
  //     per_page: 10
  //   };
  //     //模拟请求数据
  //     var $promise = new Promise(function(resolve,reject) {
  //         resolve({statusCode:200, data:serviceData.orderData});
  //     });
  //     return $promise;
  //   return request({ path: '/clientOrder', data });
  // },
  cancelOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
    content: '你是否需要取消订单',
    showCancel: true,
    success: (res) => {
       if(res.confirm == 0) {
          return;
        }
        resource.cancalOrder(orderSn).then((res) => {
           if (res.statusCode === 200 ) {
              this.data.orderList.forEach((item,key) => {
              if(item.order_sn == orderSn && that.data.activeNav != "all") {
                  this.data.orderList.splice(key, 1);
              } else {
                 item.order_status = '订单取消';
              }
             })
              resource.showTips(that, '订单取消成功');
              this.setData({orderList :this.setOrderData(this.data.orderList)});

           } else {
              resource.showTips(that, '订单取消失败');
           }
        });
      }
    });
    // resource.cancalOrder(orderSn).then((res) => {
    //   if (res.statusCode === 200) {
    //     resource.successToast(() => {
    //       that.setOrderData(res.data);
    //       that.setData({
    //         orderList: res.data
    //       });
    //     });
    //   }
    // });
  },
  drawbackOrder(e) {
    const that = this;
    const orderSn = e.target.dataset.orderSn;
    wx.showModal({
    content: '亲，你是否确定退款',
    showCancel: true,
    success: (res) => {
       if(res.confirm == 0) {
          return;
        }
        resource.drawbackOrder(orderSn).then((res) => {
          if (res.statusCode === 200) {
            this.data.orderList.forEach((item,key) => {
              if(item.order_sn == orderSn) {
                  item.refund_status = "待审核";
              }
            })
            resource.showTips(that, '退款操作成功');
            this.setData({orderList :  this.data.orderList});
          } else {
             resource.showTips(that, '退款操作失败');
          }
        });
        
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
       if(res.confirm == 0) {
          return;
        }
        resource.confirmOrder(orderSn).then((res) => {
           if (res.statusCode === 200 ) {
              this.data.orderList.forEach((item,key) => {
              if(item.order_sn == orderSn && that.data.activeNav != "all") {
                  this.data.orderList.splice(key, 1);
              } else {
                 item.order_status = '交易成功';
              }
             })
              resource.showTips(that, '确认收货成功');
              this.setData({orderList :this.setOrderData(this.data.orderList)});

           } else {
              resource.showTips(that, '确认收货失败');
           }
        });
      }
    });
   },
  payOrder(e) {
    const orderSn = e.target.dataset.orderSn;
    resource.getPaySign({ out_trade_no: orderSn, AppID: app.globalData.appId })
      .then((payRes) => {
        if (Number(payRes.statusCode) === 200) {
          const wechatData = payRes.data.payment;
          wx.requestPayment({
            appId: wechatData.appId,
            timeStamp: wechatData.timeStamp,
            nonceStr: wechatData.nonceStr,
            package: wechatData.package,
            signType: 'MD5',
            paySign: wechatData.paySign,
            success(res) {
              if (res.errMsg === 'requestPayment:ok') {
                app.globalData.type = 'success';
                wx.navigateTo({
                  url: '../result/result'
                });
              } else if (res.errMsg === 'requestPayment:cancel') {
                app.globalData.type = 'fail';
                wx.navigateTo({
                  url: '../orders/orders?t=unpaid'
                });
              }
            },
            fail() {
            },
            complete(res) {
              console.log(res);
            }
          });
        } else {
          this.setData({
            toast: {
              toastClass: 'yatoast',
              toastMessage: '获取支付验证错误!'
            }
          });
          setTimeout(() => {
            this.setData({
              toast: {
                toastClass: '',
                toastMessage: ''
              }
            });
          }, 2000);
        }
      });
  }
});
