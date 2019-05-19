Page({
  data: {
    voteID: '', // 当前投票的ID
    multiple: false, // 当前投票的类型
    voteTitle: '', // 当前投票的标题
    voteDesc: '', // 当前投票的补充描述
    optionList: [], // 当前投票的选项列表
    endDate: '', // 当前投票的截止日期
    isAnonymous: false, // 当前投票是否匿名
    isExpired: false, // 当前投票是否已过期
    pickedOption: [], // 当前用户选择的选项
    voteStatus: { // 当前的投票情况
      alreadyVoted: false, // 当前用户是否已经投票
      totalVoteCount: 0, // 总投票数量
      optionStatus: [] // 每个选项的投票情况
    }
  },
  onLoad(options) {
    const voteID = options.voteID // 通过页面路径参数获取投票ID
    this.getVoteDataFromServer(voteID) // 从服务端获取投票信息
    this.getVoteStatusFromServer(voteID) // 从服务端获取投票情况
  },
  getVoteDataFromServer(voteID) {
    if (voteID === 'test') { // 如果投票ID为test，则伪造一些数据
      /* 以下是伪造的数据 */
      const voteData = {
        multiple: false,
        voteTitle: '测试数据投票标题',
        voteDesc: '测试数据投票描述',
        optionList: [
          '测试数据选项1',
          '测试数据选项2',
          '测试数据选项3',
          '测试数据选项4'
        ],
        endDate: '2019-05-18',
        isAnonymous: false,
      }
      /* 以上是伪造的数据 */
      const isExpired = this.checkExpired(voteData.endDate) // 检查投票是否已经过期
      this.setData({ // 将获取的投票信息更新到data对象中
        voteID,
        multiple: voteData.multiple,
        voteTitle: voteData.voteTitle,
        voteDesc: voteData.voteDesc,
        optionList: voteData.optionList,
        endDate: voteData.endDate,
        isAnonymous: voteData.isAnonymous,
        isExpired
      })
    } else {
      // TODO 从服务端获取投票信息
    }
  },
  checkExpired(endDate) {
    const now = new Date()
    const nowYear = now.getFullYear()
    const nowMonth = now.getMonth() + 1
    const nowDay = now.getDate()
    const endDateArray = endDate.split('-') // 将字符串分割成字符数组，分隔符为-
    const endYear = Number(endDateArray[0]) // 取字符数组中的年份，并将数据类型转换为number
    const endMonth = Number(endDateArray[1]) // 取字符数组中的月份，并将数据类型转换为number
    const endDay = Number(endDateArray[2]) // 取字符数组中的日期，并将数据类型转换为number
    // 如果当前年份超了，那么投票一定过期了
    if (nowYear > endYear) {
      return true
    }
    // 如果年份一致，而当前月份超了，那么投票一定过期了
    if ((nowYear === endYear) && (nowMonth > endMonth)) {
      return true
    }
    // 如果年份和月份一致，而当前日期超了，那么投票一定过期了
    if ((nowYear === endYear) && (nowMonth === endMonth) && (nowDay > endDay)) {
      return true
    }
    // 其他情况投票一定没有过期
    return false
  },
  onPickOption(e) {
    if (this.data.multiple) {
      // 更新选择的选项（多选投票）
      this.setData({
        pickedOption: e.detail.value // checkbox-group获取的值是一个array
      })
    } else {
      // 更新选择的选项（单选投票）
      this.setData({
        pickedOption: [ // 为了与多选投票统一，使用数组保存选择的选项
          e.detail.value // radio-group获取的值是一个string
        ]
      })
    }
  },
  onTapVote() {
    if (this.data.isAnonymous) { // 匿名投票的情况
      const postData = { // 需要提交的数据
        voteID: this.data.voteID,
        pickedOption: this.data.pickedOption
      }
      // TODO 将postData数据上传到服务端
      this.getVoteStatusFromServer(this.data.voteID) // 从服务端获取投票情况
    } else { // 实名投票的情况
      const _this = this // 在API接口中的函数中，this会被改变，因此需要提前获取this的值到_this中
      wx.getUserInfo({
        success(res) { // 授权成功后，调用wx.getUserInfo接口时会回调这个函数
          const postData = { // 需要提交的数据
            voteID: _this.data.voteID,
            userInfo: res.userInfo, // 获取用户信息
            pickedOption: _this.data.pickedOption
          }
          console.log(postData)
          // TODO 将postData数据上传到服务端
          _this.getVoteStatusFromServer(_this.data.voteID) // 从服务端获取投票情况
        }
      })
    }
  },
  getVoteStatusFromServer(voteID) {
    if (voteID === 'test') { // 如果投票ID为test，则伪造一些数据
      /* 以下是伪造的数据 */
      const voteStatus = {
        alreadyVoted: false,
        totalVoteCount: 100,
        optionStatus: [{
          count: 25, // 第1个选项的投票数量
          vote: false
        }, {
          count: 35, // 第2个选项的投票数量
          vote: false
        }, {
          count: 10, // 第3个选项的投票数量
          vote: true // 用户选择了该投票
        }, {
          count: 30, // 第4个选项的投票数量
          vote: false
        }]
      }
      /* 以上是伪造的数据 */
      this.setData({ // 将获取的投票情况更新到data对象中
        voteStatus
      })
    } else {
      // TODO 从服务端获取投票情况
    }
  },
  onShareAppMessage() {
    return {
      title: '邀请你参与投票',
      path: '/pages/vote/vote?voteID=' + this.data.voteID
    }
  }
})
