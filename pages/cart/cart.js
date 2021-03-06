var app = getApp();

Page({
  data: {
    loading: true,
    cartList: [],
    totalNumber: 0,
    totalPrice: 0,
    checkedStatus: true,
    buyNumber: 0,
    buyPrice: 0,
    orderSn:null
  },
  onShow() {
    if (app.globalData.isUser == '0'){
      wx.navigateTo({
        url: '../user-register/user-register'
      });
    }
    var that = this;
    wx.request({
      url: app.serverURL + '/get/web/cart.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      data: {
        userID: app.globalData.userID,
        orderSn:'no'
      },
      success: function (res) {
        var totalNumber = 0;
        var totalPrice = 0;
        var buyNumber = 0;
        var buyPrice = 0;
        res.data.forEach(item => {
          item.PNUM = 1 * item.PNUM;
          item.status = 1 * item.status;
          // 保留两位小数点
          // item.goods_price = item.goods_price.toFixed(2);
          // item.market_price = item.market_price.toFixed(2);
          if (!item.status) {
            that.setData({ checkedStatus: false });
          } else {
            buyNumber += item.PNUM;
            buyPrice += item.PNUM * item.goods_price;
          }
          totalNumber += item.PNUM;
          totalPrice += item.PNUM * item.goods_price;
          if (item.PNUM == item.total_stock) {
            item.plus_class = "disabled";
          } else {
            item.plus_class = "";
          }
          if (item.PNUM == 1) {
            item.decr_class = "disabled";
          } else {
            item.decr_class = "";
          }
        })
        that.setData({
          cartList: res.data,
          loading: false,
          totalNumber: totalNumber,
          // totalPrice: totalPrice.toFixed(2),
          totalPrice: totalPrice,
          buyNumber: buyNumber,
          // buyPrice: buyPrice.toFixed(2),
          buyPrice: buyPrice
        });
      },
    })

  },
  // 选择商品
  selectProduct(event) {
    var cartId = event.currentTarget.dataset.id;
    var checkedStatus = event.currentTarget.dataset.checkedStatus;
    var totalNumber = 0;
    var totalPrice = 0;
    var buyNumber = 0;
    var buyPrice = 0;
    var id = [];
    checkedStatus = checkedStatus === true;
    var changeStatus = true;
    this.data.cartList.forEach(item => {
      if (item.pid == cartId || cartId == 0) {
        if (item.status != !checkedStatus) {
          id.push(item.pid);
        }
        item.status = cartId == 0 ? !checkedStatus : !item.status;
        wx.request({
          url: app.serverURL + '/get/web/changeSelect.php', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json'
          },
          data: {
            id: item.pid,
            status: item.status
          }
        })
      }
      if (!item.status) {
        changeStatus = false;
      } else {
        buyNumber += item.PNUM;
        buyPrice += item.PNUM * item.goods_price;
      }
      totalNumber += item.PNUM;
      totalPrice += item.PNUM * item.goods_price;
    });
    // resource.updCartStatus(id.join()).then(res => {});
    changeStatus = cartId == 0 ? !checkedStatus : changeStatus;
    this.setData({
      cartList: this.data.cartList,
      checkedStatus: changeStatus,
      totalNumber: totalNumber,
      totalPrice: totalPrice.toFixed(2),
      buyNumber: buyNumber,
      buyPrice: buyPrice.toFixed(2)
    });
  },
  // 改变商品数量
  changeNumber(event) {
    var cartId = event.currentTarget.dataset.id;
    var optType = event.currentTarget.dataset.type;
    var totalNumber = 0;
    var totalPrice = 0;
    var buyNumber = 0;
    var buyPrice = 0;
    this.data.cartList.forEach(item => {
      if (item.pid == cartId) {
        if (optType == 'plus') {
          if (item.total_stock == item.PNUM) {
            this.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '该宝贝不能购买更多哦'
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
          } else {
            item.PNUM++;
            // resource.updCartNumber(cartId, optType);
          }

        } else {

          if (item.PNUM <= 1) {
            this.setData({
              toast: {
                toastClass: 'yatoast',
                toastMessage: '亲，不能再减少了哦'
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
          } else {
            item.PNUM--;
            // resource.updCartNumber(cartId, optType);
          }
        }
        if (item.PNUM == item.total_stock) {
          item.plus_class = "disabled";
        } else {
          item.plus_class = "";
        }
        if (item.PNUM == 1) {
          item.decr_class = "disabled";
        } else {
          item.decr_class = "";
        }
        wx.request({
          url: app.serverURL + '/get/web/productNumChange.php', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json'
          },
          data: {
            id: cartId,
            productNum: item.PNUM
          }
        })
      }

      if (!item.status) {

      } else {
        buyNumber += item.PNUM;
        buyPrice += item.PNUM * item.goods_price;
      }
      totalNumber += item.PNUM;
      totalPrice += item.PNUM * item.goods_price;
    });
    this.setData({
      cartList: this.data.cartList,
      totalNumber: totalNumber,
      totalPrice: totalPrice.toFixed(2),
      buyNumber: buyNumber,
      buyPrice: buyPrice.toFixed(2)
    });
  },
  // 去结算页面
  toSettlement() {
    if(this.data.buyNumber == 0) {
      this.setData({
        toast: {
          toastClass: 'yatoast',
          toastMessage: '亲，您还未勾选商品'
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
    }else{
      var that = this;
      wx.request({
        url: app.serverURL + '/get/web/orders.php', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json'
        },
        data: {
          userID: app.globalData.userID,
          totalPrice: this.data.buyPrice
        },
        success: function (res) {
          //添加订单号
          that.data.cartList.forEach(item => {
            if (item.status == 1) {
              wx.request({
                url: app.serverURL + '/get/web/cartOrderSnAdd.php', //仅为示例，并非真实的接口地址
                header: {
                  'content-type': 'application/json'
                },
                data: {
                  id: item.pid,
                  orderSn: res.data
                }
              })
            }
          });

          wx.navigateTo({
            url: '../settlement/settlement?orderSn=' + res.data
          });
        }
      })
    }
  },
  // 去除购物车物品
  delProduct(event) {
    var that = this;
    wx.showModal({
      content: '你确定在购物车中删除该商品',
      showCancel: true,
      success: (res) => {
        if(res.confirm == 0) {
          return;
        }
        var id = event.currentTarget.dataset.id;
        var cartList = this.data.cartList;
        var totalNumber = 0;
        var totalPrice = 0;
        var buyNumber = 0;
        var buyPrice = 0;
        var delKey = 0;
        cartList.forEach((item, key) => {
          if (item.pid == id) {
            delKey = key;
          } else {
            if (!item.status) {

            } else {
              buyNumber += item.PNUM;
              buyPrice += item.PNUM * item.goods_price;
            }
            totalNumber += item.PNUM;
            totalPrice += item.PNUM * item.goods_price;
          }
        });
        cartList.splice(delKey, 1);

        //删除购物车信息
        wx.request({
          url: app.serverURL + '/get/web/cartDel.php', //仅为示例，并非真实的接口地址
          header: {
            'content-type': 'application/json'
          },
          data: {
            id: id
          },
          success: function (res) {
            if (res.statusCode == 200) {
              that.setData({
                cartList: cartList,
                totalNumber: totalNumber,
                totalPrice: totalPrice.toFixed(2),
                buyNumber: buyNumber,
                buyPrice: buyPrice.toFixed(2)
              });
            }
          }
        })
      }
    });
  },
  navigateTo() {
    wx.switchTab({
      url: '../home/home'
    });
  }
});
