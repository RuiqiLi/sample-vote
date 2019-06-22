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
  // 校验表单数据是否完整，如果校验通过就返回null，否则返回需要提示的文字
  checkFormValid() {
    if (!this.data.formTitle) {
      return '标题不能为空'
    }
    if (this.data.optionList.length < 2) {
      return '至少需要2个选项'
    }
    for (let i = 0; i < this.data.optionList.length; i++) {
      if (!this.data.optionList[i]) {
        return '选项不能为空'
      }
    }
    return null
  },
  formSubmit() {
    // 提交前需要先对表单内容进行校验
    const msg = this.checkFormValid()
    if (msg) {        // 在if判断时，null会被转换为false
      wx.showToast({  // 调用提示框API显示提示内容
        title: msg,   // 提示框中的文字内容
        icon: 'none'  // 提示框的图标，none表示没有图标
      })
      return           // 提前返回，函数会在这里结束，后面的内容不会执行
    }
    // 校验通过时后面的内容才会被执行
    const formData = {  // 将表单的数据放到一个formData对象中
      multiple: this.data.multiple,
      voteTitle: this.data.formTitle,
      voteDesc: this.data.formDesc,
      optionList: this.data.optionList,
      endDate: this.data.endDate,
      isAnonymous: this.data.isAnonymous,
      voteList: []
    }
    const db = wx.cloud.database()  // 获得数据库引用
    db.collection('votes').add({    // 将表单数据添加到votes集合中
      data: formData
    }).then(res => {
      console.log(res._id)  // 从返回值中可以拿到新添加的记录自动生成的ID
      wx.redirectTo({       // 自动跳转到参与投票页面
        url: '/pages/vote/vote?voteID=' + res._id,
      })
    }).catch(res => {
      console.error(res)
      wx.showToast({            // 创建投票失败时，显示提示框提示用户
        title: '创建投票失败',  // 提示框中的文字内容
        icon: 'none'            // 提示框的图标，none表示没有图标
      })
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
