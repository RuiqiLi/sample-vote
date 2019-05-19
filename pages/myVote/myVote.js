
Page({
  data: {
    voteList: [] // 用户创建的投票列表，包含投票的ID和标题等信息
  },
  onLoad(options) {
    this.getMyVoteListFromServer() // 从服务端获取数据
  },
  getMyVoteListFromServer() {
    // TODO 当前使用伪造的数据，后面使用云开发技术从服务端获取数据
    const voteList = [{
      id: 'test',
      title: '测试投票1',
    }, {
      id: 'test',
      title: '测试投票2',
    }, {
      id: 'test',
      title: '测试投票3',
    }]
    this.setData({
      voteList
    })
  },
  onTapVote(e) {
    const voteID = e.currentTarget.dataset.voteId
    wx.navigateTo({
      url: '/pages/vote/vote?voteID=' + voteID,
    })
  }
})