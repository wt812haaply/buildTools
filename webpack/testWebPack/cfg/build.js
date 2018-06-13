/**
 * Created by ahu on 2017/10/12.
 */
const merge = require('webpack-merge');
const base = require('./base.js');
const path = require('path');
const webpack = require('webpack');
const projectsCfg =require('./projects');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const extractCSS = new ExtractTextPlugin(projectsCfg.assetPath.css+'[name].css');
module.exports = merge(base, {
    devtool: false,
    module:{
        rules:[
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            outputPath:projectsCfg.assetPath.image//image 压缩输出路径
                        }
                    }
                    // images压缩
                    // {
                    //     loader:'image-webpack-loader',
                    //     options: {
                    //         exclude: /(node_modules)/,
                    //         mozjpeg: {
                    //             progressive: true,
                    //             quality: 65
                    //         }
                    //     }
                    // }
                ]
            },
            {
                test: /\.css$/,
                include:projectsCfg.devRoot,
                use: extractCSS.extract([
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: (loader) => [
                                require('precss')(),
                                require('autoprefixer')()
                            ]
                        }
                    }
                ])
            }
        ]
    },
    output: {
        filename: '[name].[chunkhash].bundle.js',
        path: projectsCfg.distRoot,
        publicPath:projectsCfg.assetPath.publicPath
    },
    plugins: [
        new CleanWebpackPlugin(['./'+projectsCfg.rootName],{root:projectsCfg.dist}),
        new webpack.DefinePlugin({//很多库里（比如react）if(process.env.NODE_ENV !== 'production'){死代码在压缩代码时删掉
            'process.env.NODE_ENV': '"production"'
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common' // 指定公共 bundle 的名称。 提取公共代码 为一个单独的js
        // }),
        extractCSS,
        new ManifestPlugin(),
        // new webpack.DllPlugin({
        //     context: path.join(__dirname,'../'),
        //     path: path.join(__dirname, '..',"[name]-manifest.json"),
        //     name: "[name]_[hash]"
        // }),
        // new UglifyJSPlugin()
        new UglifyJSPlugin({// 移除 JavaScript 上下文中的未引用代码(dead-code)
            uglifyOptions:{
                ie8: false,
                output:{
                    beautify:false,
                    comments:false
                }
            }
        })
    ]
});