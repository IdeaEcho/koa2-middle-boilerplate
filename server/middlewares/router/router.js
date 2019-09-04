"use strict"

const KoaRouter = require('koa-router')

class Controller {
  constructor(ctx, next) {
    this.ctx = ctx
    this.next = next
  }

  async controller_LowSystem() {
    let ua = this.ctx.request.header['user-agent']
    if (!ua) return false
    let index = ua.indexOf("Android")
    if (index < 0) return false
    let androidVersion = parseFloat(ua.slice(index + 8))
    if (androidVersion <= 4.0) { // 版本大于4.0
      const base = require('../../base/controller')
      await base['lowSystem'](this.ctx, this.next)
      return true
    }
    return false
  }

  async dynamicController() {
    let path = this.ctx.path;
    let match = path.match(/(?<hdtype>(y+\d{4,}|maintain|minigame)\/(\w+)\/)(?<hdname>[\w\.]+)(\/?)(?<action>\w*)/);
    let hdtype = match && match.groups.hdtype; //活动类型
    let hdName = match && match.groups.hdname; //获取活动名称
    let action = match && match.groups.action || 'index';
    let controllers = require('../../' + hdtype + 'controllers/' + hdName)

    if (hdName && controllers && controllers[action]) {
      if (await this.controller_LowSystem()) return
      await controllers[action](this.ctx, this.next)
    }
  }
}

module.exports = function () {
  const router = new KoaRouter()
  //路径规则：/年份/项目/活动名(即controllers下命名的文件名)
  router.all(/(game\/)?(y*\d{4,}|maintain|minigame)?(\/)(\w*)(\/)?(\w*)(\/)?(\w*)/, async (ctx, next) => {
    await new Controller(ctx, next).dynamicController()
  })
  return router
};
