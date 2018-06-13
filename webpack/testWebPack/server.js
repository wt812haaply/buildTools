/**
 * Created by ahu on 2017/10/10.
 */
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');
const projectsCfg =require('./cfg/projects');
//
console.log("---------webpackConfig-----------")
console.log(webpackConfig.module)
console.log("---------webpackConfig-----------")
//entry 配置热更新
Object.getOwnPropertyNames((webpackConfig.entry || {})).map(function (name) {
    webpackConfig.entry[name] = []
    //添加HMR文件
        .concat("webpack/hot/dev-server")
        .concat("webpack-dev-server/client?http://192.168.0.18:"+projectsCfg.dfltPort)
        .concat(webpackConfig.entry[name])
});
const open = require('open');
const compiler = Webpack(webpackConfig);
const options = {
    // contentBase: projectsCfg.distRoot,
    contentBase: './dist',
    hot: true,
    stats:{
        colors: true
    }
};
WebpackDevServer.addDevServerEntrypoints(webpackConfig,options)
const server = new WebpackDevServer(compiler,options );

server.listen(projectsCfg.dfltPort, '192.168.0.18', () => {
    open('http://192.168.0.18:'+projectsCfg.dfltPort);
});