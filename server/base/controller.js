"use strict"
const dirname = '/base/views/';

module.exports = {
  //首页
  error_404: async function(ctx) {
    let view = dirname + '404';
    ctx.body = await ctx.render(view, {
      cdn: ctx.state.cdn,
      cdnBase: ctx.state.cdnBase,
    })
  },
  //安卓系统低于4.0版本
  lowSystem: async function(ctx) {
    let view = dirname + 'lowSystem'
    ctx.body = await ctx.render(view, {
      cdn: ctx.state.cdn,
      cdnBase: ctx.state.cdnBase,
    })
  },
}
