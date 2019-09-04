/**
 * api转发工具修改：
 * request.Get()参数改动，做相应改动
 */
const request = require('./syncRequest');
const sign = '/api';
module.exports = async (ctx, next) => {
    let href = ctx.url;
    let isPost = ctx.request.method === 'POST';
    if (href.indexOf(sign) < 0) {
        await next();
    } else {
        let url = href.split(sign)[1];
        url = url.split('?')[0];
        let data;
        if (isPost) {
            data = await request.Post(url, ctx);
        } else {
            data = await request.Get(url, ctx);
        }
        ctx.body = data;
    };
}
