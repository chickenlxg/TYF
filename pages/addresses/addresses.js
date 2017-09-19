var app = getApp();
Page({
  data: {
    // 设置菊花初始状态
    loading: true,
    addressesList: [],
    defaultId: 0,
    tipsData: {
      title: ''
    }
  },
  setDefaultStyle(list, id) {
    list.forEach((itm) => {
      if (itm) {
        itm.items.is_default = +itm.address_id === id;
        itm.items.iconType = itm.items.is_default ? 'success' : 'circle';
        itm.items.iconColor = itm.items.iconType === 'success' ? '#FF2D4B' : '';
      }
    });
  },
  goEdit(event) {
    const id = event.target.dataset.addressId;
    wx.navigateTo({
      url: `../address-edit/address-edit?id=${id}`
    });
  },
  delete(event) {
    const id = event.target.dataset.addressId;
    let addressList = this.data.addressesList;

    this.confirmToast(() => {

      var that = this;
      wx.request({
        url: app.serverURL + '/get/deleteAddress.php', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.statusCode === 200) {
            console.log('111111');
              const defaultData = addressList.find(itm => itm.items.is_default === true);
              if (+defaultData.address_id === +id && addressList.length > 0) {
                addressList = addressList.filter(itm => +itm.address_id !== +id);
                // addressList.forEach((itm) => {

                // });
                // addressList[0].items.is_default = true;
                // addressList[0].items.iconType = 'success';
                // addressList[0].items.iconColor = '#FF2D4B';
              }
              that.setData({
                defaultId: defaultData.address_id,
                addressesList: addressList.filter(itm => +itm.address_id !== +id)
              });
              wx.showToast({
                title: '成功',
                icon: 'success',
                duartion: '80000',
              });
          }
        },
      })
    });
  },
  setDefault(event) {
    const checkedId = +event.currentTarget.dataset.valueId || +event.detail.value;
    let setFlag = false;
    this.loadingToast();

    var that = this;
    wx.request({
      url: app.serverURL + '/get/setDefaultAddress.php', //仅为示例，并非真实的接口地址
      data: {
        x: checkedId,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode === 200) {
          setFlag = true;
          // this.setDefaultStyle(this.data.addressesList, checkedId);   设置默认地址
          // this.setData({ addressesList: this.data.addressesList });
        } else {
          setFlag = false;
        }
        if (setFlag) {
          wx.showToast({
            title: '默认地址设置成功',
            icon: 'success'
          });
        } else {
          // wx.failToast();
        }
      },
    })
  },
  onLoad() {
    // tips.toast(this.data.tipsData);
    // const tipsData = {
    //   title: 'sku不足zz',
    //   duration: 2000,
    //   isHidden: false
    // };
    // this.setData({
    //   tipsData
    // });
    // setTimeout(() => {
    //   tipsData.isHidden = true;
    //   this.setData({
    //     tipsData
    //   });
    // }, 3000);


    var that = this;
    wx.request({
      url: app.serverURL + '/get/address.php', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data) {
          res.data.forEach((itm) => {
            itm.overlayConfirm = false;
            itm.items = {
              id: itm.address_id,
              is_default: itm.is_default,
              isgroup: true,
              labelText: '设置为默认',
              iconType: itm.is_default ? 'success' : 'circle'
            };
            itm.items.iconColor = itm.items.iconType === 'success' ? '#FF2D4B' : '';
          });
          console.log(res);
          that.setData({
            addressesList: res.data,
            loading: false
          });
        } else {
          that.setData({
            addressesList: [],
            loading: false
          });
        }
      },
    })
  },
  confirmToast(callback) {
    wx.showModal({
      title: '提示框',
      content: '确定要删除吗？',
      showCancel: true,
      success: (res) => {
        if (res.confirm) callback();
      }
    });
  },
  loadingToast() {
    wx.showToast({
      title: '设置中，请稍后',
      icon: 'loading'
    });
  }
});
