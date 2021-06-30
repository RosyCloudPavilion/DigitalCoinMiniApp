import * as echarts from '../../ec-canvas/echarts';
let chart = null;
let comp_id = null;
let source = null;
let target =null;
var categories = [{ name: "企业" }, { name: "人" }, { name: "风险" }, { name: "招投标项目" }, { name: "产品" }];
let chart_option = {
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
      layout: 'force',
      data: [],
      links: [],
      categories: categories,
      roam: true,
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
      lineStyle: {
        color: 'source',
        curveness: 0.3
      },
      emphasis: {
        lineStyle: {
          width: 10
        }
      },
      force: {
        repulsion: 80,
        gravity: 0.01,
        edgeLength: [50, 200]
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
  //   console.log(params.data);
  //   wx.navigateTo({
  //     url: '../link/link?source=' + comp_id + '&target=' + params.data.id
  //   })
  // });
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    loading: true,
    show: false,
    projects: [],
    activeNames: [],
    source: ['','',''],
    target:{},
    hopIndex:'4',
    lineIndex:'ALL'
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  hop(e){
    this.setData({
      hopIndex: e.currentTarget.dataset.hop
    });
    this.getCorre(this.data.hopIndex,this.data.lineIndex)
  },

  line(e) {
    if (e.currentTarget.dataset.line == this.data.lineIndex){
      this.setData({
        lineIndex: 'ALL'
      });
    }else{
      this.setData({
        lineIndex: e.currentTarget.dataset.line
      });
    }
    this.getCorre(this.data.hopIndex, this.data.lineIndex)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getStorage({
      key: 'companyDetail',
      success: function (res) {
        console.log(res.data.basic)
        res.data.basic = JSON.parse(res.data.basic);
        _this.setData({
          comp: res.data
        })
      }
    })

    source = options.source;
    target = options.target;

    setTimeout(function () {
      _this.getCorre('4','ALL')
    }, 1000)
  },

  getCorre(hop,line){
    var _this=this;
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/getCorrelation?source=' + source + '&target=' + target + '&hop='+hop+'&line_type='+line,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        const graph = res.data;
        chart_option.series[0].data = graph.nodes;
        chart_option.series[0].links = graph.links;
        chart.setOption(chart_option);


        var pathsList = []
        res.data.pathsList.forEach(item => {
          pathsList.push({
            len: item.length - 1,
            path: item.join("--")
          })
        })
        console.log(pathsList)
        _this.setData({
          projects: res.data.riskProject,
          source: res.data.source,
          target: res.data.target,
          pathsLen: res.data.pathsList.length + '条',
          pathsList: pathsList,
          loading: false
        })
      }
    })
  },

  getProjectDetail(e) {
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/searchProject?keyword=' + e.currentTarget.dataset.title,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.projects) {
          console.log(res.data.projects)
          wx.setStorage({
            key: "projectDetail",
            data: res.data.projects[0]
          })
          wx.navigateTo({
            url: '../project/project'
          })
        }
      }})
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