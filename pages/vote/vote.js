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
    const db = wx.cloud.database()
    db.collection('votes').doc(voteID).get().then(res => {
      const voteData = res.data
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
    }).catch(res => {
      console.error(res)
      wx.showToast({
        title: '获取投票失败',
        icon: 'none'
      })
    })
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
      wx.cloud.callFunction({
        name: 'vote',
        data: {
          postData
        }
      }).then(res => {
        console.log(res)
        this.getVoteStatusFromServer(this.data.voteID) // 从服务端获取投票情况
      }).catch(res => {
        console.error(res)
        wx.showToast({
          title: '投票失败',
          icon: 'none'
        })
      })
    } else { // 实名投票的情况
      const _this = this // 在API接口中的函数中，this会被改变，因此需要提前获取this的值到_this中
      wx.getUserInfo({
        success(res) { // 授权成功后，调用wx.getUserInfo接口时会回调这个函数
          const postData = { // 需要提交的数据
            voteID: _this.data.voteID,
            userInfo: res.userInfo, // 获取用户信息
            pickedOption: _this.data.pickedOption
          }
          wx.cloud.callFunction({
            name: 'vote',
            data: {
              postData
            }
          }).then(res => {
            console.log(res)
            _this.getVoteStatusFromServer(_this.data.voteID) // 从服务端获取投票情况
          }).catch(res => {
            console.error(res)
            wx.showToast({
              title: '投票失败',
              icon: 'none'
            })
          })
        }
      })
    }
  },
  getVoteStatusFromServer(voteID) {
    wx.cloud.callFunction({  // 使用小程序端API调用云函数
      name: 'getVoteStatus',  // 指定调用的云函数名
      data: {
        voteID  // 将投票ID传到服务端
      }
    }).then(res => {
      console.log(res)  // 控制台输出服务端返回的结果
      this.setData({ // 将获取的投票情况更新到data对象中
        voteStatus: res.result
      })
    }).catch(res => {
      console.error(res)  // 如果出现异常，控制台输出异常详情
      wx.showToast({  // 调用提示框API提示用户获取数据失败
        title: '获取投票数据失败',
        icon: 'none'
      })
    })
  },
  onShareAppMessage() {
    return {
      title: '邀请你参与投票',
      path: '/pages/vote/vote?voteID=' + this.data.voteID
    }
  }
})
