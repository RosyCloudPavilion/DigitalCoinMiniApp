// pages/project/project.js
import * as echarts from '../../ec-canvas/echarts';
let chart = null;
let comp_id = null;
var categories = [{ name: "企业" }, { name: "人" }, { name: "风险" }, { name: "招投标项目" }, { name: "产品" }];
let options = {
  title: {
    text: '风险知识图谱',
    top: 'bottom',
    left: 'right'
  },
  roam: true,
  tooltip: {},
  legend: [{
    // selectedMode: 'single',
    data: categories.map(function (a) {
      return a.name;
    })
  }],
  animationDuration: 1500,
  animationEasingUpdate: 'quinticInOut',
  series: [
    {
      name: 'risk graph',
      type: 'graph',
      layout: 'circular',
      data: [],
      links: [],
      categories: categories,
      roam: true,
      focusNodeAdjacency:true, 
      itemStyle: {
        normal: {
          borderColor: '#fff',
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      label: {
        position: '',
        formatter: '{b}'
      },
      // lineStyle: {
      //   color: 'source',
      // },
      emphasis: {
        lineStyle: {
          width: 5
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return params.name;
        }
      }
    }
  ]
};
function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas.setChart(chart);
  //当点击节点时进行跳转到其他企业或产品页面
  // chart.on('click', function (params) {
  //   wx.navigateTo({
  //     url: '../link/link?source=' + comp_id + '&target=' + params.data.id
  //   })
  // });
  return chart;
}

var util = require('../../utils/util.js');  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    loading: true,
    project:{},
    activeNames: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getStorage({
      key: 'projectDetail',
      success: function (res) {
        console.log(res.data)
        if (res.data.publishTime){
          var time = new Date();
          time.setTime(Number(res.data.publishTime))
          res.data.publishTime = util.formatTime(time)
        }else{
          res.data.publishTime = "无"
        }
        var relatestr = res.data.related_comp.replace(/'/g, '"');
        res.data.related_comp = JSON.parse(relatestr);
        _this.setData({
          project: res.data
        })
      }
    })
    setTimeout(function () {
      _this.getGraph(options.id)},1000);
  },

  getGraph: function (id) {
    var _this = this;
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/getProjectById?id='+id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        const graph = res.data;
        options.series[0].data = graph.nodesList;
        options.series[0].links = graph.linksList;
        chart.setOption(options);
      }
    })
  },

  toVisible() {
    this.setData({
      loading: !this.data.loading,
    })
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
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

  }
})