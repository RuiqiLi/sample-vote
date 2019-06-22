const cloud = require('wx-server-sdk')  // 引入云开发SDK

cloud.init()  // 初始化云环境
const db = cloud.database()  // 获取数据库引用

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID  // 获取用户的openid

  // 从postData中取到3个属性的值
  const { voteID, pickedOption, userInfo } = event.postData
  // 将openid、pickedOption和userInfo保存到voteItem对象中（匿名投票没有userInfo）
  const voteItem = userInfo ? {
    openid,
    pickedOption,
    userInfo
  } : {
    openid,
    pickedOption
  }

  // 在votes集合中，对该投票的voteList字段原子插入一条数据
  return await db.collection('votes').doc(voteID).update({
    data: {
      voteList: db.command.push(voteItem)
    }
  })
}
