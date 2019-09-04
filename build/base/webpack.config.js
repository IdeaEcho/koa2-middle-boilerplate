var path = require("path");
var webpack = require('webpack');
var _config = {
  name: 'base'
};

module.exports = {
  mode: 'production',
  entry: {
    deviceSwitch: path.resolve(__dirname + '/js/deviceSwitch.js'),
  },
  output: {
    path: path.resolve('../../release/base/js'), // 打包后文件存放的地方
    filename: '[name].js' // 打包后输出文件的文件名
  },
  module: {
    rules: [{
        test: /.css$/,
        loaders: ["style-loader", "css-loader"]
      },
      {
        test: /.scss$/,
        loaders: ["style", "css", "autoprefixer", "sass"],
        exclude: "/node_modules/"
      },
      {
        // 遇到图片文件，使用 image-webpack (封装了 imagemin) 压缩，并转换为内联 data64 URLs
        test: /\.(png|jpg|svg)/,
        loaders: ['url', 'image-webpack'],
      },
      {
        test: /\.js$/, // 匹配打包文件后缀名的正则
        exclude: /(node_modules|bower_components)/, // 这些文件夹不用打包
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  },
  optimization: {
    minimize: true
  }
}
