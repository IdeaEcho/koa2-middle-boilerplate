/**
 * Created by csy on 2018/1/3.
 */
/**
 * 基于gulp
 * 1.资源合并 concat
 * 2.css压缩，js压缩混淆  minify-css  uglify
 * 3.sass编译 sass
 * 4.生成md5戳，替换html中的引用  rev rev-format rev-replace
 * 5.自由正则替换  replace
 * 6.plumber 捕获出错
 * 7.顺序执行任务  run-sequence
 * 8.监听文件变动 watch
 * 9.connect 启动一个node服务器来作测试
 * 10.babel  编译ES6 和 ES2017
 * 11.自动给css加兼容性前缀 autoprefixer
 * 12.图片压缩和输出
 */

//在这里配置要编译的项目
// var project = 'app-wap';
var gulp = require('gulp');

var concat = require('gulp-concat');
var miniCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var sourcemap = require('gulp-sourcemaps');

var replace = require('gulp-replace');

var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var proxy = require('http-proxy-middleware');
var sequence = require('run-sequence');
var _if = require('gulp-if');

var base64 = require('gulp-base64');

var project = 'base';

var src = {
    sass: './scss/**/*.scss',
    js: './js/**/*.js',
    images: './images/*.{jpg,png,jpeg}',
    imgs: './img/*.{jpg,png,jpeg}',
    views: '../../../../server/y2018/game/views/'+project+'/**/*.ejs',
    lib: './lib/**/*.js'
};
var dist = '../../release/'+project+'/';


var env = 'dev';

gulp.task('css', function() {
    gulp.src(src.sass)
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(gulp.dest('./css/'))
        .pipe(base64({
            extensions: ['svg', 'jpg', 'png', /\.jpg#datauri$/i],
            maxImageSize: 12 * 1024, // bytes
            debug: true
        }))
        .pipe(miniCss())
        .pipe(gulp.dest(dist + '/css/'))
        .pipe(connect.reload());
});
gulp.task('js', function() {
    gulp.src(src.js)
        .pipe(plumber())
        .pipe(_if(env === 'dev', sourcemap.init()))
        .pipe(babel({
            presets: ["env"]
        }))
        .pipe(uglify())
        .pipe(_if(env === 'dev', sourcemap.write()))
        .pipe(gulp.dest(dist + '/js/'))
        .pipe(connect.reload())
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true,
    port: 8080,
    middleware: function(connect, opt) {
        return [
            proxy('/y2018', {
                target: 'http://localhost:4040',
                changeOrigin: true
            })
        ]
    }
  });
});

gulp.task('dev', function() {
    env = 'dev';
    watch([src.views]).on('change', function() {
        gulp.start('css');
    })
    watch([src.sass]).on('change', function() {
        gulp.start('css');
    })
    // watch([src.js]).on('change', function() {
    //     gulp.start('js');
    // });
});

gulp.task('lib', function() {
    gulp.src(src.lib)
        .pipe(gulp.dest(dist + '/lib'))
});
gulp.task('build', function() {
    env = 'prod';
    sequence('js');
});
gulp.task('default', ['connect', 'dev']);
