var app = getApp();
Page({
  data: {
    userInfo: {},
    date: '2016-11-08'
  },
  onShow() {

  },
  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo,
    });
  },

  formSubmit: function (e) {
    var uionid = app.globalData.userID;
    wx.request({
      url: app.serverURL + '/get/web/user-register.php', //仅为示例，并非真实的接口地址
      data: {
        userid: uionid,
        name: app.globalData.userInfo.nickName,
        gender: app.globalData.userInfo.gender,
        real_name: e.detail.value.name,
        tel: e.detail.value.tel,
        age: e.detail.value.age
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.navigateBack({
          delta:1
        })
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 1200
        }) 

      },
    });
  },

  bindDateChange: function (e) { 
    this.setData({ date: e.detail.value }) 
  }

});
