//game.js
//获取应用实例
var app = getApp()
var utils = require('../../utils/util.js')
Page({
  data: {
    maxCount: 0,
    maxValue: 128,
    minValue: 0,
    data: 0,
    maxG: 0,
    minG: 0,
	gap: 0,
	checkReult: 99,  //检查结果，0匹配，1偏大，-1 偏小，99 初始值
	index:1, //当前次数
	gapRate:0.05 //随机调整差的比例
	
  },
  //事件处理函数
  bindViewTap(e) {
    wx.navigateTo({
      url: '../detail/detail?id=' + e.target.dataset.id
    })
  },
  loadMore (e) {
    if (this.data.list.length === 0) return
    var date = this.getNextDate()
    var that = this
    that.setData({ loading: true })
    wx.request({
      url: 'https://news.at.zhihu.com/api/4/news/before/' + (Number(utils.formatDate(date)) + 1),
      headers: {
        'Content-Type': 'application/json'
      },
      success (res) {
         that.setData({
           loading: false,
           list: that.data.list.concat([{ header: utils.formatDate(date, '-') }]).concat(res.data.stories)
         })
      }
    })
  },
  getNextDate (){
    const now = new Date()
    now.setDate(now.getDate() - this.index++)
    return now
  },
  onLoad () {
    let that = this
	let maxCount = (int) Math.ceil(Math.log(maxValue-minValue)/(Math.log(2)))-1 ;
	
    wx.request({
      url: 'https://news-at.zhihu.com/api/4/news/latest',
      headers: {
        'Content-Type': 'application/json'
      },
      success (res) {
         that.setData({
           banner: res.data.top_stories,
           list: [{ header: '今日热闻' }].concat(res.data.stories)
         })
      }
    })
    this.index = 1
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    
  }
})
