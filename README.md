# koa2-middle-boilerplate
koa2 做为中间层的一个脚手架，用于活动仓库。

## Installation

First, clone this repo and `cd` into the main directory. Then:

```shell
npm install
```

## Development
```shell
npm run dev
```

## Structure
```
├─build               # 前端源码文件存放目录
│  └─base
├─release             # 前端编译后代码存放目录
│  └─zabbix           # 提供给zabbix监控请求的gif文件存放目录
├─server              
│   ├─base            # 存放通用页面的示例目录
│   │  ├─controllers  # Controller 文件存放目录
│   │  └─views        # 前端编译后 HTML 模板文件存放目录
│   └─middlewares     # 中间件存放目录
│       ├─context     # Koa Context 对象扩展（可选）
│       ├─request     # Koa Request 对象扩展
│       ├─error       # 错误处理中间件存放目录
│       └─router      # 路由中间件存放目录
├─app.js              # 应用实际入口文件
├─package-lock.json
├─package.json
└─process.config.js   # 环境配置文件
```
