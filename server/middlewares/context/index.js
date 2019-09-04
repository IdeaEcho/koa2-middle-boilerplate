const views = require('co-views')
module.exports = async (ctx, next) => {
    let cdn = ''

    ctx.state = Object.assign(ctx.state, {
        cdn
    })
    ctx.render = views(process.cwd() + '/server', {
        ext: 'ejs',
    })
    await next();
}