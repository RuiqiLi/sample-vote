Page({
  onLoad() {
    // 页面生命周期函数onLoad，进入页面的时候会调用它
  },
  onTapCreateRadioVote() {
    wx.navigateTo({
      url: '/pages/createVote/createVote?type=radio'
    })
  },
  onTapCreateMultiChoiceVote() {
    wx.navigateTo({
      url: '/pages/createVote/createVote?type=multiple'
    })
  }
})