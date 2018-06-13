module.exports = function(grunt) {
    require('jit-grunt')(grunt);
    // require('load-grunt-tasks')(grunt);
    // grunt.loadNpmTasks('grunt-autoprefixer');
    // grunt.loadNpmTasks('grunt-contrib-cssmin');
    // const mozjpeg = require('imagemin-mozjpeg');
    // 'use strict';

/* = 全局变量设置
-------------------------------------------------------------- */    
    var appPath = {
        css          :  'app/style/css',
        less         :  'app/style/less',
        postcss      :  'app/style/postcss',
        sass         :  'app/style/sass',
        concat       :  'app/style/css',
        js           :  'app/js',
        images       :  'app/images',
    };

    var destPath = {
        css          :  'app/style/css',
        less         :  'app/style/css',
        postcss      :  'app/style/css',
        sass         :  'app/style/css',
        concat       :  'dist/css',
        cssmin       :  'dist/css',
        js           :  'dist/js',
        images       :  'dist/images',
    };

    var serveStatic = require('serve-static');
    var serveIndex = require('serve-index');

    // LiveReload的默认端口号，你也可以改成你想要的端口号
    var lrPort = 35729;
    // 使用connect-livereload模块，生成一个与LiveReload脚本
    // <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
    var lrSnippet = require('connect-livereload')({ port: lrPort });
    var lrMiddleware = function(connect, options, middlwares) {
        // 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
        // 把脚本，注入到静态文件中
        return [
            lrSnippet,
            // 静态文件服务器的路径 原先写法：connect.static(options.base[0])
            serveStatic(options.base[0]),
            // 启用目录浏览(相当于IIS中的目录浏览) 原先写法：connect.directory(options.base[0])
            serveIndex(options.base[0]),
        ];
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('../package.json'),

        //-------启动连接Web服务器-------//
        connect: {
            options: {
                // 服务器端口号
                port: 8888,
                // 服务器地址(可以使用主机名localhost，也能使用IP)
                // hostname: '192.168.30.66',
                hostname: 'localhost',
                // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
                base: ''
            },
            livereload: {
                options: {
                    // 通过LiveReload脚本，让页面重新加载。
                    middleware: lrMiddleware,
                    livereload: true,
                    // port: 8006,
                }
            }
        },

        //-------LESS编译-------//
        less: {
            development: {
                options: {
                    compress: false,
                    /*  true*/
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    // destination file and source file
                    // "app/style/css/name-less.css": "app/style/less/name-less.less"
                   [ destPath.less +  "/name-less.css"] : [ appPath.less + "/name-less.less"]

                }
            }
        },

        //-------SASS编译-------//
        sass: {
            options: {
                // sourceMap: true,
                processors: [
                    require('autoprefixer')({ browsers: 'last 2 versions' }), // add vendor prefixes
                    require('precss')(),
                ]
            },

            dist: {
                files: {
                    [ destPath.sass +  "/name-sass.css"] : [ appPath.sass + "/name-sass.scss"]
                }
            }
        },

        //-------post (私有前缀、precss)-------//
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')({ browsers: 'last 2 versions' }), // add vendor prefixes
                    require('precss')(),
                ]
            },
            dist: {
                src:  [ appPath.postcss + '/name-postcss.css'],
                dest: destPath.postcss + '/name-postcss.css'
            }
        },

        //-------私有前缀-------//
        autoprefixer: {
            options: {
                //任务设置
                processors: [
                    require('autoprefixer-core')({
                        browsers: [
                            '> 11%',
                            'Chrome >= 10',
                            'Explorer >= 6',
                            'Opera >= 11',
                            'Firefox >= 3.5',
                            'Safari >= 4',
                            'iOS >= 6'
                        ],
                    })
                ],
                cascade: true,
                remove: false,
                // map:true,
            },

            //单文件任务
            // single_file: {
            //   src: ['style/a.css','style/test/*.css']
            //   dest: 'style/css/layout.css'   //目标地址
            // },
            //多文件任务
            mutiple_files: {
                expand: true,
                flatten: true,
                src: [ destPath.css + '/*.css'],
                dest: destPath.css + '/'
            }
        },

        //-------合并文件-------//
        concat: {
            options: {
                // separator: ';',
            },
            // js:{
            //   src: ['app/js/*.js'],
            //   dest: 'dist/js/abc1.js',

            //   options: {
            //   separator: ';',
            // },
            // },
            css: {
                src: [ appPath.concat + '/*.css'],
                dest: destPath.concat + '/name.css',
            },
        },

        //-------css压缩-------//
        cssmin: {
            options: {
                // sourceMap :true,    //生成sourceMap文件
                compatibility: 'ie8', //设置兼容模式   
                noAdvanced: true //取消高级特性 
            },
            target: {
                files: [{
                    expand: true,
                    cwd: destPath.cssmin + '/',
                    src: ['*.css', '!*.min.css'],
                    dest: destPath.cssmin + '/',
                    ext: '.min.css'
                }]
            },
        },

        //-------图片压缩-------//
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3 //定义 PNG 图片优化水平
                },
                files: [{
                    expand: true,
                    cwd: appPath.images + '/',
                    src: ['*.{png,jpg,jpeg,gif,svg}'], // 优化 img 目录下所有 png/jpg/jpeg/gif图片
                    dest: destPath.images + '/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
                }]
            }
        },

        //-------监听刷新-------//
        watch: {
            options: {
                livereload: true,
            },
            styles: {
                files: [ 
                    appPath.less + '/*.less', 
                    appPath.sass + '/*.scss', 
                    appPath.css + '/*.css', 
                    appPath.postcss + '/*.css', 
                    destPath.concat + '/*.css', 
                    appPath.js + '/*.js', 
                    destPath.js + '/*.js', 
                    '*.html',
                ], 
                tasks: [
                    'less', 
                    'sass', 
                    'autoprefixer', 
                    'postcss', 
                    'concat', 
                    'cssmin', 
                    'imagemin',
                ],
                options: {
                    nospawn: true
                }
            }
        }
    });
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    // grunt.loadNpmTasks('grunt-contrib-connect');
    //  grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', 'live', ['connect', 'less', 'sass', 'autoprefixer', 'postcss', 'concat', 'cssmin', 'imagemin', 'watch']);
};