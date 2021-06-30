// pages/choose/choose.js
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

  toApp(e){
    var index = e.currentTarget.dataset.id
    if(index==0){
      wx.navigateTo({
        url: '../index/index'
      })
    }
    else if(index==1){
      wx.navigateToMiniProgram({
        appId: 'wx5a7e18cbda07907e',
        success(res) {
          // 打开成功
        }
      })
    }
    else if(index==2){
      wx.navigateToMiniProgram({
        appId: 'wx5a7e18cbda07907e',
        success(res) {
          // 打开成功
        }
      })
    }
    else if(index==3){
      wx.navigateToMiniProgram({
        appId: 'wx5a7e18cbda07907e',
        success(res) {
          // 打开成功
        }
      })
    }
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

  }
})