/**
 * Created by ahu on 2017/10/11.
 */
const projectsCfg =require('./projects');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const srcPath=projectsCfg.devRoot;
const webpack = require('webpack');
module.exports = {
    entry: {
        demo: projectsCfg.entryJs,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Production',
            filename: 'index.html',
            inject:`body`,
            template:projectsCfg.entryHtml
        })
    ],
    module: {
        rules: [
            {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src'],
                        minimize: true
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use:{
                    loader: 'url-loader'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.css','.json','jpg','zepto'],
        // mainFields: ['jsnext:main','main'],
        alias: {
            js:`${srcPath}/js/`,
            images:`${srcPath}/images/`,
            css: `${srcPath}/css/`,
            zepto:'${srcPath}/js/lib/zepto.min.js'
        },
        modules: [projectsCfg.devRoot, path.resolve(__dirname,'..','node_modules'),"node_modules"]// 设置require 查询顺序  先从 devroot 目下查 在 node_modules
    }
};