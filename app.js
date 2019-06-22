App({
  onLaunch() {
    // 小程序生命周期函数onLaunch，小程序启动时会调用它
    wx.cloud.init({
      env: 'test-633q8',  // 指定使用环境ID为test-633q8的云开发环境
      traceUser: true     // 将用户对云资源的访问记录到用户管理中，在云开发控制台中可见
    })
  }
})