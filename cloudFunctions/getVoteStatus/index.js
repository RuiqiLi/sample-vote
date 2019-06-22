const cloud = require('wx-server-sdk')  // 引入云开发SDK

cloud.init()  // 初始化云环境
const db = cloud.database()  // 获取数据库引用

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID  // 获取用户的openid

  /*
   * 根据投票ID获取投票记录
   * 使用await关键词可以直接获取到Promise过程中then函数中的res的值
   * await关键词必须在被声明为async的函数中使用
   */
  const res = await db.collection('votes').doc(event.voteID).get()
  const optionLength = res.data.optionList.length  // 获取投票选项的个数
  const voteList = res.data.voteList  // 获取所有用户的投票列表

  const alreadyVoted = checkAlreadyVoted(voteList, openid)
  const totalVoteCount = getTotalVoteCount(voteList)
  const optionStatus = getOptionStatus(voteList, openid, optionLength)

  return {
    alreadyVoted,   // 当前用户是否已经投票
    totalVoteCount, // 总投票数量
    optionStatus    // 每个选项的投票情况
  }
}

// 检查用户是否已经参与过投票了
function checkAlreadyVoted(voteList, openid) {
  let alreadyVoted = false  // 默认用户没有参与投票
  voteList.map(voteItem => {  // 遍历所有的用户投票，将数组中的每个元素执行一次下面的代码
    if (voteItem.openid == openid) {  // 如果某个投票记录的openid与用户openid相同
      alreadyVoted = true  // 那么用户显然参与了本次投票
    }
  })
  return alreadyVoted
}

// 计算得到所有选项投票的总数量
function getTotalVoteCount(voteList) {
  let totalVoteCount = 0  // 初始数量为0
  voteList.map(voteItem => {  // 遍历所有的用户投票
    totalVoteCount += voteItem.pickedOption.length  // 将总数加上每一次投票的数量
  })
  return totalVoteCount
}

// 计算得到每个选项的投票数量，以及用户是否选择了该选项
function getOptionStatus(voteList, openid, optionLength) {
  let optionStatus = new Array(optionLength)  // 新建一个数组，使它的长度与选项数量一样
  for (let i = 0; i < optionStatus.length; i++) {
    optionStatus[i] = {  // 初始化数组中的每个元素
      count: 0,  // 默认每个选项的投票数量为0
      vote: false  // 默认用户没有投这个选项
    }
  }
  voteList.map(voteItem => {  // 遍历所有的用户投票
    const userVoteThis = (voteItem.openid == openid)  // 如果openid一致，那么这个投票是该用户投的，反之则不是
    voteItem.pickedOption.map(pickedIndex => {  // 遍历这个投票的选项
      optionStatus[pickedIndex].count++  // 对应选项的数量增加1
      if (userVoteThis) {  // 只有当这个投票是该用户投的时候，更新vote属性
        optionStatus[pickedIndex].vote = true
      }
    })
  })
  return optionStatus
}
