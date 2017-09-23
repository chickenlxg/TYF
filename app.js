App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.login({
      success: res => {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: this.serverURL + '/get/web/userinfo.php',
            data: {
              code: res.code
            },
            success: res => {
              this.globalData.userID = res.data;
              wx.request({
                url: this.serverURL + '/get/web/isUser.php',
                data: {
                  code: res.data
                },
                success: e => {
                  this.globalData.isUser = e.data;
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

    wx.getUserInfo({
      success: res => {
        console.log(res);
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })

    

    // var that = this;
    // wx.request({
    //   url: that.serverURL + '/get/userinfo.php', //仅为示例，并非真实的接口地址
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     that.globalData.userInfo = res.data
    //   },
    // })
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  serverURL:'https://www.jntyfjk.com',
  globalData: {
    userInfo: null,
    userID: null,
    isUser:null
    // token: null,
    // shop_id: 1,
    // shopInfo: null,
    // appId: 'wx3bce24d137585996',
    // appSecret: '09ca5f5b8610ea7d79f5870499b368c0'
  }
})
