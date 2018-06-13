const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractCSS = new ExtractTextPlugin('dist/[name]-one.css');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
module.exports = {
  entry: {
      app:'./src/demo/js/index.js',
      print:'./src/demo/js/print.js'
  },
  // devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
  plugins: [
      new ManifestPlugin(),
      new HtmlWebpackPlugin({
        title: 'Output Management',
      }),
      new CleanWebpackPlugin(['./dist']),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common' // 指定公共 bundle 的名称。 提取公共代码 为一个单独的js
      }),
       new UglifyJSPlugin(),// 移除 JavaScript 上下文中的未引用代码(dead-code)
      new webpack.HotModuleReplacementPlugin(),
      new webpack.ProvidePlugin({
          lodash: 'lodash'
      })

   ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')+'/demo/test'
  },
    watchOptions:{
        ignored: '/node_modules/'
    }
};
