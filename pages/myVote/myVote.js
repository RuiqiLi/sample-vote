
Page({
  data: {
    voteList: [] // 用户创建的投票列表，包含投票的ID和标题等信息
  },
  onLoad(options) {
    this.getMyVoteListFromServer() // 从服务端获取数据
  },
  getMyVoteListFromServer() {
    wx.cloud.callFunction({
      name: 'myVoteList'
    }).then(res => {
      console.log(res)
      this.setData({
        voteList: res.result.data
      })
    }).catch(res => {
      console.error(res)
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      })
    })
  },
  onTapVote(e) {
    const voteID = e.currentTarget.dataset.voteId
    wx.navigateTo({
      url: '/pages/vote/vote?voteID=' + voteID,
    })
  }
})