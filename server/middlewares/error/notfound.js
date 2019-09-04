module.exports = async function onerror(ctx, next) {
    try {
        await next();
    } catch (err) {
        console.error('URL:' + ctx.originalUrl);
        ctx.app.emit('error', err)
        ctx.status = err.status || 404;
        const base = require('../../base/controller')
        await base['error_404'](ctx, next)
    }
}