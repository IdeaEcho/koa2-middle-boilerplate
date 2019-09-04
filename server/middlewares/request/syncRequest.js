/**
 * 同步数据请求封装
 **/
"use strict"

//需要的参数构造
const Client = require("./core");
const request = require('request')
const format = require('./format')
module.exports = {
  Get: function(uri, ctx) {
    // sync
    return new Promise((resolve, reject) => {
      let opt = Client.get(uri, ctx);
      opt.hostname = Client.server_ip; //服务器ip
      opt.headers.originalHostHeaderName = opt.headers.Host; //来源host
      opt.headers.cookie = ctx.header.cookie;
      let beginTime = new Date().getTime();
      request.get(opt, (err, res, body) => {
        if (res) {
          let cookies = res.headers['set-cookie']
          if(cookies&&cookies.length) {
            cookies.forEach(function(item) {
              ctx.cookies.set(item)
            })
          }
          resolve(res);
        } else {
          reject(res);
        }
      });
    }).then(result => {
      return format.strToObj(result)
    }).catch(res => {
      console.error("error: " + JSON.stringify(res))
      return {
        "code": res && res.statusCode,
        "message": "服务器异常"
      }
    })
  },
  Post: function(uri, ctx) {
    // sync
    return new Promise((resolve, reject) => {
      let opt = Client.post(uri, ctx);
      opt.hostname = Client.server_ip;
      opt.headers.originalHostHeaderName = opt.headers.Host;
      opt.headers.cookie = ctx.header.cookie;
      let beginTime = new Date().getTime();
      request.post(opt, (err, res, body) => {
        if (res) {
          if(res.headers['set-cookie']) {
            ctx.cookies.set(res.headers['set-cookie'])
          }
          resolve(res);
        } else {
          reject(err);
        }
      });
    }).then(result => {
      return format.strToObj(result)
    }).catch(err => {
      console.error("error: " + JSON.stringify(res))
      return {
        "code": res.statusCode,
        "message": "服务器异常"
      }
    })
  }
}
