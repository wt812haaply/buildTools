/**
 * Created by ahu on 2017/10/12.
 */
const merge = require('webpack-merge');
const common = require('./base.js');
const projectsCfg=require('./projects');
const webpack = require('webpack');
const precss       = require('precss');
const autoprefixer = require('autoprefixer');

module.exports = merge(common, {
    devtool: 'source-map',
    module:{
        rules:[
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1,
                            outputPath:projectsCfg.assetPath.image//image 压缩输出路径
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                include:projectsCfg.devRoot,
                use: [
                    'style-loader',
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
                ]
            }
        ]
    },
    output: {
        filename: '[name].bundle.js',
        path: projectsCfg.distRoot,
        publicPath:'/'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
});