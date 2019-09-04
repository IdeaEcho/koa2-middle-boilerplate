/**
 * 获取网络相关信息封装
 */
"use strict"

module.exports = {
  getIP: function(ctx) {
    let ip
    //cdn-src-ip，用户本地ip
    if (ctx.request.headers['cdn-src-ip'] != undefined) {
      ip = ctx.request.headers['cdn-src-ip']
      //x-forwarded-for=true时，ctx.request.ips返回一个ip数组，默认取第一个ip（即client-ip），客户端ip
      //x-forwarded-for=false时，ctx.request.ips返回空数组
    } else if (ctx.request.ips.length != 0) {
      ip = ctx.request.ips[0]
      //cdn-src-ip不存在时，x-real-ip为用户本地ip
      //cdn-src-ip存在时，x-real-ip为服务器代理ip
    } else if (ctx.request.headers['x-real-ip'] != undefined) {
      ip = ctx.request.headers['x-real-ip']
      //proxy-ip，docker代理ip
    } else if (ctx.req.connection.remoteAddress != undefined) {
      ip = ctx.req.connection.remoteAddress
      //proxy-ip，docker代理ip
    } else if (ctx.req.socket.remoteAddress != undefined) {
      ip = ctx.req.socket.remoteAddress
    } else {
      ip = ''
    }
    return ip;
  }
}
