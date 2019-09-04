const koa = require('koa');
const app = new koa();
const logger = require('koa-logger');
const session = require('koa-session');
const bodyPaser = require('koa-bodyparser');
const static = require('koa-static');
const router = require('./server/middlewares/router/router')(); //路由控制文件
const redirect = require('./server/middlewares/request/apiRedirect');
const context = require('./server/middlewares/context/index');
const cors = require('./server/middlewares/request/cors');
const error = require('./server/middlewares/error/notfound');

app.use(error)
    .use(cors)
    //扩展 context，配置CDN地址
    .use(context) 
    .use(bodyPaser({
        formLimit: 1024 * 1024 * 20
    }))
    //转发接口
    .use(redirect)
    .use(static(__dirname + '/release', {
        maxAge: process.env.NODE_ENV === 'production' ? 60 * 60 * 24 * 30 * 1000 : 0
    }))
    .use(session(app))
    .use(router.routes())
    .use(router.allowedMethods())
    .use(logger())
    .listen(4040);