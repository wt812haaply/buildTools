/**
 * Created by ahu on 2017/10/12.
 */
const path = require('path');
const distBasePath = path.join(__dirname, '../dist');
const devBasePath = path.join(__dirname, '../src');
/*-----每次修改项目名-start-----*/
const rootName='ProductSize';
const assetPath={
    image:'images/',
    js:'js/',
    css:'css/',
    // publicPath:'https://tu.95vintage.com/web/'
    publicPath:''
}
//建议一下固定
const entryJs='index.js';
const dfltPort = 8000;
const entryHtml=rootName+'.html';
/*-----每次修改项目名-end------*/
module.exports={
    dist:distBasePath,
    distRoot:distBasePath+'/'+rootName,
    rootName:rootName,
    devRoot:devBasePath+'/'+rootName,
    js:devBasePath+'/'+rootName+'/js',
    entryJs:devBasePath+'/'+rootName+'/js/'+entryJs,
    entryHtml:devBasePath+'/'+rootName+'/'+entryHtml,
    images:devBasePath+'/'+rootName+'/images',
    cdnPath:'https://tu.95vintage.com/web/',
    dfltPort:dfltPort,
    css:devBasePath+'/'+rootName+'/css',
    assetPath:assetPath
}