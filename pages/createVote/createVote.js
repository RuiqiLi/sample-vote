Page({
  data: {
    multiple: false, // 用来保存投票类型，最终需要传递给服务端
    formTitle: '',
    formDesc: '',
    optionList: [],
    nowDate: '',
    endDate: '',
    isAnonymous: false
  },
  onLoad(options) {
    if (options.type === 'radio') {
      wx.setNavigationBarTitle({ // 动态改变导航栏文字
        title: '创建单选投票'
      })
    } else if (options.type === 'multiple') {
      this.setData({ // 修改投票类型为多选
        multiple: true
      })
      wx.setNavigationBarTitle({ // 动态改变导航栏文字
        title: '创建多选投票'
      })
    } else { // 参数异常的情况，对每个分支都进行判断是个好习惯
      console.error('wrong page parameter [type]: ' + options.type)
    }
    this.formReset()
  },
  onTitleInputChange(e) {
    this.setData({
      formTitle: e.detail.value
    })
  },
  onDescChange(e) {
    this.setData({
      formDesc: e.detail.value
    })
  },
  onTapAddOption() {
    const newOptionList = this.data.optionList
    newOptionList.push('')
    this.setData({
      optionList: newOptionList
    })
  },
  onOptionInputChange(e) {
    const newOptionList = this.data.optionList
    const changedIndex = e.currentTarget.dataset.optionIndex
    newOptionList[changedIndex] = e.detail.value
    this.setData({
      optionList: newOptionList
    })
  },
  onTapDelOption(e) {
    const delIndex = e.currentTarget.dataset.optionIndex
    const newOptionList = this.data.optionList.filter(
      (v, i) => i !== delIndex
    )
    this.setData({
      optionList: newOptionList
    })
  },
  onChangeEndDate(e) {
    this.setData({
      endDate: e.detail.value
    })
  },
  onChangeIsAnonymous(e) {
    this.setData({
      isAnonymous: e.detail.value
    })
  },
  formSubmit() {
    const formData = {
      multiple: this.data.multiple, // 投票类型也要传递给服务端
      formTitle: this.data.formTitle,
      formDesc: this.data.formDesc,
      optionList: this.data.optionList,
      endDate: this.data.endDate,
      isAnonymous: this.data.isAnonymous
    }
    // TODO 将formData提交到云端
    const voteID = 'test'; // 伪造一个数据，作为服务端返回的投票ID
    wx.redirectTo({
      url: '/pages/vote/vote?voteID=' + voteID,
    })
  },
  formReset() {
    const now = new Date()
    const nowYear = now.getFullYear()
    const nowMonth = now.getMonth() + 1
    const nowDay = now.getDate()
    const nowDate = nowYear +
      '-' +
      ((nowMonth < 10) ? ('0' + nowMonth) : nowMonth) +
      '-' +
      ((nowDay < 10) ? ('0' + nowDay) : nowDay)
    this.setData({
      nowDate,
      endDate: nowDate,
      formTitle: '',
      formDesc: '',
      optionList: [],
      isAnonymous: false
    })
  }
})
