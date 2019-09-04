'use strict';
const cors = require('koa2-cors');
module.exports = cors({
    origin: function (ctx) {
        if (!process.env.NODE_ENV) return "*";
        let host = ctx.header.host;
        let url = ctx.url;
        if (/debug=1/.test(url) || /localhost|m\.img4399\.com|h5\.img4399\.com/.test(host)) {
            return '*';
        }
        return false;
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 86400,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowHeaders: (process.env.NODE_ENV == 'local' || !process.env.NODE_ENV || process.env.NODE_ENV == 'test') ? ['Content-Type', 'Authorization', 'Accept', 'close-device'] : ['Content-Type', 'Authorization', 'Accept']
})