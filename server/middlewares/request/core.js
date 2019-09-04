const client = {};
const config = require("./config");
const network = require("./network");
client.crypto = require('crypto');
client.querystring = require('querystring');
client.currentEnv = ''
client.md5 = function (s) {
    return client.crypto.createHash('md5').update(s).digest('hex');
};

client.random = function (min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
};

client.server = function (href) {
    let regTest = /\/test[\.|\/]/i;
    let regOt = /\/ot[\.|\/]/i;
    if (regTest.test(href) || (href.indexOf('localhost') > -1) || (href.indexOf('192.168') > -1) || (href.indexOf('127.0.0.1') > -1)) {
        client.secret = config.test.secret;
        client.server_ip = config.test.server_ip;
        client.server_host = config.test.server_host;
        client.api_key = config.test.api_key;
    } else if (regOt.test(href)) {
        client.secret = config.online.secret;
        client.server_ip = config.online.server_ip;
        client.server_host = config.online.server_host;
        client.api_key = config.online.api_key;
        client.currentEnv = 'ot'
    } else {
        client.secret = config.online.secret;
        client.server_ip = config.online.server_ip;
        client.server_host = config.online.server_host;
        client.api_key = config.online.api_key;
    }
};

client.options = function (uri, referer, api_data, ua, ip, closeDevice) {
    let currentEnv = client.server(referer)
    let now = Date.parse(new Date()) / 1000
    let rand = client.random(10000, 99999)
    let sign = client.md5(now + client.secret + rand + api_data)
    return {
        url: "http://" + client.server_ip + uri,
        headers: {
            "User-Client-Ip": ip,
            "User-Agent": ua,
            "Content-Type": 'application/x-www-form-urlencoded',
            "Host": client.server_host,
            "api-key": client.api_key,
            "api-sign": sign,
            "api-time": now,
            "api-rand": rand,
            "api-data": api_data,
            "current-env": client.currentEnv,
            "api-referer": referer,
            "CLOSE-DEVICE": closeDevice//0 表示开启设备绑定   1表示关闭设备绑定
        }
    }
};

client.ksort = function (obj) {
    if (typeof obj !== 'object') {
        return String(obj)
    }
    let keys = [], i, res = {}, len = 0, k;
    for (i in obj) {
        keys[len++] = i;
    }
    keys.sort();
    for (i = 0; i < len; i++) {
        k = keys[i];
        res[k] = client.ksort(obj[k]);
    }
    return res;
};

client.serialize = function (data) {
    let arr = [], k;
    const _val = function (k, v, prefix) {
        try {
            let l;
            if (prefix) {
                k = prefix + '%5B' + k + '%5D';
            }
            if (v === null) {
                return false;
            }
            switch (typeof v) {
                case 'object':
                    for (l in v) {
                        _val(l, v[l], k);
                    }
                    break;
                case 'boolean':
                    arr.push(k + '=' + (v ? '1' : '0'));
                    break;
                case 'string':
                    arr.push(k + '=' + encodeURIComponent(v));
                    break;
                case 'number':
                    arr.push(k + '=' + String(v));
                    break;
                default:
                    return false;
            }
            return true;
        } catch (e) {
            console.log(e);
            return false
        }
    };
    for (k in data) {
        _val(k, data[k], '');
    }
    return arr.join('&');
};

client.generateSyn = function (data) {
    data = client.ksort(data);
    return client.serialize(data);
};

client.post = function (uri, ctx, hash) {
    let referer = ctx.request.header.referer ? ctx.request.header.referer : ctx.href;
    let ip = network.getIP(ctx);
    let query = ctx.query;
    let ua = ctx.header['user-agent']
    let closeDevice = ctx.request.header['close-device'] != 1 ? 0 : parseInt(ctx.request.header['close-device'])
    let form = ctx.request.body;
    form = client.ksort(form);
    form = client.querystring.stringify(form);
    query = client.ksort(query);
    query = client.querystring.stringify(query);
    let api_data = client.md5(JSON.stringify(client.querystring.parse(form)).replace(/\//g, "\\\/")).toUpperCase();
    let opt = client.options(uri + '?' + query, referer, api_data, ua, ip, closeDevice);
    opt.headers["Content-Length"] = form.length;
    opt.body = form;
    return opt;
};

client.get = function (uri, ctx, hash) {
    let referer = ctx.request.header.referer ? ctx.request.header.referer : ctx.href;
    let ip = network.getIP(ctx);
    let query = ctx.query;
    let ua = ctx.header['user-agent'];
    let closeDevice = ctx.request.header['close-device'] != 1 ? 0 : parseInt(ctx.request.header['close-device']);
    hash = hash === undefined ? "" : "#" + hash;
    query = client.ksort(query);
    query = client.querystring.stringify(query);
    let api_data = client.md5(JSON.stringify(client.querystring.parse(query))).toUpperCase();
    let symbol = /\?/.test(uri) ? '&' : '?'
    let opt = client.options(uri + ((query || hash) ? symbol : '') + query + hash, referer, api_data, ua, ip, closeDevice);
    return opt;
};

client.pipeline = function (bulk) {
    let s = [];
    for (let k in bulk) {
        s.push(k);
    }
    for (let k in bulk) {
        let item = bulk[k];
        item.args = client.ksort(item.args);
        client.querystring.stringify(item.args);
        bulk[k]['header'] = bulk[k]['header'] || {};
        bulk[k]['header']['api-data'] = client.md5(JSON.stringify(client.querystring.parse(client.querystring.stringify(item.args)))).toUpperCase();
    }
    s = s.join(";");
    return {
        uri: "/pipeline/?uris=" + s,
        form: { bulk: JSON.stringify(bulk) }
    };
};

module.exports = {
    host: client.server_host,
    server_ip: client.server_ip,
    post: client.post,
    get: client.get,
    pipeline: client.pipeline
};
