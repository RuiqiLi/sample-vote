Page({
  data: {
    formTitle: '', // 用来保存当前投票标题输入框中的内容
    formDesc: '', // 用来保存当前补充描述输入框中的内容
    optionList: [], // 使用数组保存每一个投票选项的内容，数组中的每一项都是一个string
    nowDate: '', // 用来保存今天的日期，作为截止日期有效选择范围的起始日期
    endDate: '', // 用来保存截止日期
    isAnonymous: false // 用来保存匿名投票的设置
  },
  onLoad() {
    this.formReset()
  },
  onTitleInputChange(e) {       // 投票标题输入框的输入事件处理函数
    this.setData({               // 使用this.setData函数可以修改data对象中的属性
      formTitle: e.detail.value // 输入框内容改变时，立即更新data中的formTitle属性
    })
  },
  onDescChange(e) {
    this.setData({
      formDesc: e.detail.value
    })
  },
  onTapAddOption() {
    const newOptionList = this.data.optionList // 首先获取当前的optionList
    newOptionList.push('')       // 在list数组中新增一个空字符串，插入到数组最后面
    this.setData({
      optionList: newOptionList  // 更新data对象中的optionList
    })
  },
  onOptionInputChange(e) {
    const newOptionList = this.data.optionList // 获取当前的optionList
    const changedIndex = e.currentTarget.dataset.optionIndex // 获取当前修改的元素的下标
    newOptionList[changedIndex] = e.detail.value // 将视图层的数据更新到逻辑层变量中
    this.setData({
      optionList: newOptionList  // 更新data对象中的optionList
    })
  },
  onTapDelOption(e) {
    const delIndex = e.currentTarget.dataset.optionIndex // 获取当前删除的元素的下标
    const newOptionList = this.data.optionList.filter( // 筛选当前数组
      (v, i) => i !== delIndex //只要不等于被删除元素的下标，就保留元素
    )
    this.setData({
      optionList: newOptionList  // 更新data对象中的optionList
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
      formTitle: this.data.formTitle,
      formDesc: this.data.formDesc,
      optionList: this.data.optionList,
      endDate: this.data.endDate,
      isAnonymous: this.data.isAnonymous
    }
    // TODO 将formData提交到云端
  },
  formReset() {
    const now = new Date() // 新建一个Date对象，命名为now，默认的时间是当前的时间
    const nowYear = now.getFullYear() // 从now中取出年份，返回值为number类型
    const nowMonth = now.getMonth() + 1 // 从now中取出月份，返回值为number类型
    const nowDay = now.getDate() // 从now中取出日期，返回值为number类型
    // 将年月日拼接成string类型的变量
    const nowDate = nowYear +
      '-' + // 年月日分隔符，数字和字符串相加，会先将数字转换为字符串，然后拼接在一起
      ((nowMonth < 10) ? ('0' + nowMonth) : nowMonth) + // 月份如果为单个数字，前面补0
      '-' + // 年月日分隔符
      ((nowDay < 10) ? ('0' + nowDay) : nowDay) // 日期如果为单个数字，前面补0
    // 调用一次setData方法，修改data对象中的nowDate和endDate数据
    this.setData({
      nowDate,  // 等价于 nowDate: nowDate，由于key与value相同，可以简写
      endDate: nowDate,
      formTitle: '',
      formDesc: '',
      optionList: [],
      isAnonymous: false
    })
  }
})
