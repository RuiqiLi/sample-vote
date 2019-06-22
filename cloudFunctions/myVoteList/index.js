const cloud = require('wx-server-sdk')  // 引入云开发SDK

cloud.init()  // 初始化云环境
const db = cloud.database()  // 获取数据库引用

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID  // 获取用户的openid

  const countResult = await db.collection('votes').count()
  const total = countResult.total  // 取出集合记录总数

  const MAX_LIMIT = 100  // 一次最多取100条数据
  const batchTimes = Math.ceil(total / MAX_LIMIT)  // 计算需要取几次

  let tasks = []  // 保存所有读操作的Promise的数组
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('votes').where({
      'voteList.openid': openid // 根据用户的openid筛选数据
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  // 等待所有Promise执行完毕后，将获取的数据合并到一起，然后返回
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}