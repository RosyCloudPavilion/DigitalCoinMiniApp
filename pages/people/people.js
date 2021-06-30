import * as echarts from '../../ec-canvas/echarts';
let chart = null;
let chart2 = null;
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
  chart.on('click', function (params) {
      wx.navigateTo({
        url: '../link/link?source='+comp_id+'&target='+params.data.id
      })
  });
  return chart;
}
function initChart2(canvas2, width, height, dpr) {
  chart2 = echarts.init(canvas2, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 像素
  });
  canvas2.setChart(chart2);
  //当点击节点时进行跳转到其他企业或产品页面
  chart2.on('click', function (params) {
      wx.navigateTo({
        url: '../link/link?source='+comp_id+'&target='+params.data.id
      })
  });
  return chart2;
}

Page({
  data: {
    ec: {
      onInit: initChart
    },
    ec2: {
      onInit: initChart2
    },
    loading:true,
    loads: true,
    show:false,
    companys: [],
    projects: [],
    nodes:[],
    links:[],
    consensuses:[],
    activeNames: ['0'],
    credit:[],
    basic:[],
    activeBasic:['1','2'],
    active: 0,
    comp:{},
    desc:[],
  },


  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  onChangeBasic(event) {
    this.setData({
      activeBasic: event.detail
    });
  },

  onTab(event) {
    
  },

  getCorrelation(e){
    var name = e.currentTarget.dataset.name;
    var id;
    this.data.nodes.forEach(item=>{
      if(item.name==name){
        wx.navigateTo({
          url: '../link/link?source=' + comp_id + '&target=' + item.id
        })
      }
    })
  },

  report(){
    wx.navigateTo({
      url: '../report/report?id=' + comp_id
    })
  },

  onLoad: function (option) {
    var _this = this;
    comp_id  = option.id
    wx.getStorage({
      key: 'companyDetail',
      success: function (res) {
        res.data[option.index].basic = JSON.parse(res.data[option.index].basic);
        _this.setData({
          comp: res.data[option.index]
        })
      }
    })
    

      setTimeout(function(){
        wx.request({
          url: 'https://www.mylittlefox.art/api/EDU/getNodesAndLinksById?id=' + option.id,
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            const graph = res.data;
            options.series[0].data = graph.nodes;
            options.series[0].links = graph.links;
            chart.setOption(options);
            //chart2.setOption(options);
            res.data.riskComp.forEach(item=>{
              var desc = "该企业参与投标共计" + item[1][2] + "次，与" + _this.data.comp.short_name + "共同参与" + item[1][1] + "次。"
              item.push(desc);
            })

            var desc = [];
            desc.push({"type":"合作企业风险","label":"该企业与" + res.data.riskComp[0][0] + ", " + res.data.riskComp[1][0]+"在多个项目中共同投标"});
            desc.push({ "type": "参与项目风险", "label":"该企业参与的" + res.data.riskProject[0][0] + ", " + res.data.riskProject[1][0] + "项目中企业关联性较高"});
            _this.setData({
              companys: res.data.riskComp,
              projects: res.data.riskProject,
              nodes:res.data.nodes,
              links:res.data.links,
              loads:false,
              desc:desc,
            })
          }
        });
      },2000)
    this.getProjectByCompId(option.id);
    this.getConsensusData(option.id)
    if (option.recordNo!=0){
      this.getKexinData(option.recordNo);
    }
  },

  getProjectByCompId: function (id) {
    var _this = this;
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/getProjectByCompId?id='+id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        res.data.projects.forEach(project => {
          var relate = "";
          var relatestr = project.related_comp.replace(/'/g, '"');
          JSON.parse(relatestr).forEach(pro => {
            relate = relate + "\n" + pro.name;
          })
          project["relatedComp"] = relate;
        })
        _this.setData({
          historyProjects: res.data.projects,
        })
      }
    })
  },

  toVisible(){
    this.setData({
      loading: !this.data.loading,
    })
  },

  getConsensusData(id){
    var _this = this;
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/getConsensus?id='+id,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          consensuses: res.data.consensus,
        })
      }
    })
  },

  bindConsensusTap(e) {
    wx.setStorage({
      key: "consensusDetail",
      data: this.data.consensuses[e.currentTarget.dataset.index]
    })
    wx.navigateTo({
      url: '../consensus/consensus'
    })
  },

  getKexinData(recordNo){
    var _this=this;
    wx.request({
      url: 'https://www.mylittlefox.art/v1/enterpriseCredit/' + recordNo,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        _this.setData({
          show:true,
          credit: res.data[0]
        })
      }
    })
  },

  getProjectDetail(e){
    wx.request({
      url: 'https://www.mylittlefox.art/api/EDU/searchProject?keyword=' + e.currentTarget.dataset.title,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if(res.data.projects){
          console.log(res.data.projects)
          wx.setStorage({
            key: "projectDetail",
            data: res.data.projects[0]
          })
          wx.navigateTo({
            url: '../project/project'
          })
        }
      }
    })
  },

  toTourong(){
    wx.navigateTo({
      url: '../tourong/tourong?id=' + comp_id
    })
  },

  toHolder(){
    wx.navigateTo({
      url: '../holder/holder?id=' + comp_id
    })
  }
});