Page({
    data: {
      list: []
    },
    onLoad: function () {
      var that = this
      wx.request({
        url: 'https://news-at.zhihu.com/api/4/themes',
        headers: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          that.setData({
            list: res.data.others
          })
        }
      })
    }
})