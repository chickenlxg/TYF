// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  pay:function(){
    wx.requestPayment({
      'timeStamp': '1509540799',
      'nonceStr': 'qdpc5gsictldgx0xa9ldj08rp2b4u3jd',
      'package': 'prepay_id=wx201711012053196820e81a260894988653',
      'signType': 'MD5',
      'paySign': 'B21A60D330A5871C10D75DD69A0F1A8D',
      'success': function (res) {
      },
      'fail': function (res) {
      }
    })
  }
})