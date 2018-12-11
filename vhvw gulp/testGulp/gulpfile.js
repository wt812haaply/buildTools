var gulp = require('gulp'); // 基础库
var livereload = require('gulp-livereload');
var webserver = require('gulp-webserver');
var autoprefixer = require('gulp-autoprefixer'); // 自动添加CSS3浏览器前缀
var less = require('gulp-less');
var stylus = require('gulp-stylus');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var postcss = require('gulp-postcss');
var pxtoviewport = require('postcss-px-to-viewport');
// var px2rem = require('postcss-px2rem');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');

/* = 全局变量设置
-------------------------------------------------------------- */
var srcPath = {
    html        : '',
    css         :  'src/style/css',
    less        :  'src/style/less',
    sass        :  'src/style/sass',
    stylus      :  'src/style/stylus',
    CompileCSS  :  'src/CompileCSS',
    images      :  'src/images',
    js          :  'src/js',
    };
    
var destPath = {
    html        : '',
    css         : 'dist/css',
    script      : 'dist/js',
    images      : 'dist/images',
    };

// px => vw vh
var processors = [
        pxtoviewport({
            viewportWidth: 375,
            // viewportHeight: 1334,
            unitPrecision: 5,
            viewportUnit: 'vw',
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: false
        })
    ];

// 注册任务自启浏览器服务
gulp.task('webserver', function() {
    gulp.src('.') // 服务器目录（.代表根目录）
        .pipe(webserver({ // 运行gulp-webserver
            // host: '192.168.0.13',
            livereload: true, // 启用LiveReload
            open: true, // 服务器启动时自动打开网页
            port: 3001,
        }));
});

// HTML处理
gulp.task('html', function() {
    return gulp.src('*.html')
        // .pipe(gulp.dest('/'));
});

//autoprefixer
gulp.task('autoprefixer', function() {
    // var processors = [px2rem({remUnit: 18.75})];
    gulp.src( srcPath.css + '/*.css') //原路径
        .pipe(less())
        .pipe(sass())
        .pipe(stylus())
        // .pipe(postcss(processors))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest(srcPath.CompileCSS + '/')); //编译后路径
});



//less
gulp.task('less', function() {
    // var processors = [px2rem({remUnit: 18.75})];
    // gulp.src(['src/style/less/less.less','src/style/less/less2.less'])//多个文件以数组形式传入
    return gulp.src( srcPath.less + '/*.less') //所有文件
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(less())
        .pipe(postcss(processors))
        .pipe(gulp.dest(srcPath.CompileCSS + '/')); //编译后路径
});

//sass
gulp.task('sass', function() {
    // var processors = [px2rem({remUnit: 18.75})];
    gulp.src( srcPath.sass + '/*.scss') //*表示所有的scss文件
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(gulp.dest(srcPath.CompileCSS + '/')); //编译后路径
})

//stylus
gulp.task('stylus', function() {
    // var processors = [px2rem({remUnit: 18.75})];
    return gulp.src( srcPath.stylus + '/*.styl')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(stylus())
        .pipe(postcss(processors))
        .pipe(gulp.dest(srcPath.CompileCSS + '/')); //编译后路径
});

//postcss
gulp.task('postcss', function() {
    // var processors = [px2rem({remUnit: 18.75})];
    gulp.src([ srcPath.css + '/*.css',srcPath.less + '/*.less', srcPath.sass + '/*.scss',])
    // return gulp.src('src/style/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        // .pipe(postcss(processors))  
        .pipe(less())
        .pipe(sass())
        .pipe(stylus())
        .pipe(gulp.dest(srcPath.CompileCSS + '/')); //编译后路径
});

//图片压缩
gulp.task('imagemin', function() {
    gulp.src( srcPath.images + '/*.{png,jpg,gif,svg,ico}')
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            svgoPlugins: [{ removeViewBox: true }], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest( destPath.images + '/'))
});

//concat合并
gulp.task('concat', function() {
    return gulp.src([ srcPath.CompileCSS + '/*.css'])
        .pipe(concat('wt.css'))
        .pipe(gulp.dest( srcPath.CompileCSS + '/css/'));
});

//cssmin
gulp.task('cssmin', function () {
    gulp.src( srcPath.CompileCSS + '/css/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest( destPath.css + '/'));
});

// 监听任务
gulp.task('watch', function() {
    // 监听 html
    gulp.watch('*.html', ['html']);
    // 监听 autoprefixer
    gulp.watch( srcPath.css + '/*.css', ['autoprefixer']);
    // sass
    gulp.watch( srcPath.sass + '/*.scss', ['sass']);
    // wx.clearStorageSync
    gulp.watch( srcPath.less + '/*.less', ['less']);
    // stylus
    gulp.watch( srcPath.stylus + '/*.styl', ['stylus']);
    // postcss
    gulp.watch( srcPath.css + '/*.css', ['postcss']);
    // 图片
    gulp.watch( srcPath.images + '/*.{png,jpg,gif,svg}', ['imagemin']);
    // concat
    gulp.watch( srcPath.CompileCSS + '/*.css', ['concat']);
    // cssmin
    gulp.watch( srcPath.CompileCSS + '/css/*.css', ['cssmin']);
});

// 默认任务
gulp.task('default', ['webserver','html','autoprefixer','sass','imagemin','less','stylus','postcss','concat','cssmin','watch'], function() {
    console.log('                                           ');
    console.log('                                           ');
    console.log('                                           ');
    console.log('----------------- 样式处理 -----------------');
    console.log('gulp css                                CSS');
    console.log('gulp less                              less');
    console.log('gulp sass                              sass');
    console.log('gulp stylus                          stylus');
    console.log('gulp postcss                         px2rem');
    console.log('gulp pxtoviewport                  pxtoview');
    console.log('gulp autoprefixer                    CSS前缀');
    console.log('gulp cssmin                         样式压缩');
    console.log('----------------- 图片处理 -----------------');
    console.log('gulp images                         图片压缩');
    console.log('----------------- 文件处理 -----------------');
    console.log('gulp concat                         文件合并');
    console.log('gulp rename                         修改名称');
    console.log('----------------- 完美结束 -----------------');
    console.log('                                           ');
    console.log('                                           ');
    console.log('                                           ');
});