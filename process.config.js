module.exports = {
  apps: [{
      //本地环境
      "name": "local",
      "script": "app.js",
      "node_args": "--harmony",
      "env": {
        "NODE_ENV": "local"
      }
    },{
      //测试环境
      "name": "test",
      "script": "app.js",
      "node_args": "--harmony",
      "instances": 8,
      "env": {
        "NODE_ENV": "test"
      }
    },{
      //预发布环境
      "name": "ot",
      "script": "app.js",
      "node_args": "--harmony",
      "instances": 8,
      "env": {
        "NODE_ENV": "ot"
      }
    },{
      // 生产环境
      "name": "production",
      "script": "app.js",
      "node_args": "--harmony",
      "instances": 8,
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
