'use strict';

/*
      ██████╗ ██╗   ██╗██╗     ██████╗
      ██╔════╝ ██║   ██║██║     ██╔══██╗
      ██║  ███╗██║   ██║██║     ██████╔╝
      ██║   ██║██║   ██║██║     ██╔═══╝
      ╚██████╔╝╚██████╔╝███████╗██║
      ╚═════╝  ╚═════╝ ╚══════╝╚═╝
 */

// module import
import gulp from 'gulp';
import browserSync from 'browser-sync';
import dateUtils from 'date-utils'; // 日付をフォーマット
import insert from 'gulp-insert'; // 挿入
import plumber from 'gulp-plumber'; // エラー起きても止まらない
import pug from 'gulp-pug'; // 可愛いパグを処理するやつ
import fileinclude from 'gulp-file-include'; // file include 使いたい時のために一応置いとく
import runSequence from 'run-sequence'; // タスクの処理順序の担保
import imagemin from 'gulp-imagemin'; // 画像圧縮
import sass from 'gulp-sass'; // sass!!!
import sassGlob from 'gulp-sass-glob'; // sass!!!
import sourcemaps from'gulp-sourcemaps'; // sassのソースマップ吐かせる
import please from 'gulp-pleeease'; // sass周りのいろいろ
import webpack from 'webpack'; // js関係のことを今回やらせます。
import webpackStream from 'webpack-stream'; // webpack2をつかうためのもの
import webpackConfig from './webpack.config.babel.js'; // webpackの設定ファイル
import minimist from 'minimist'; // タスク実行時に引数を渡す
import del from 'del'; // clean task用
import DirectoryManager from './DirectoryManager.js'; // directory 共通化用

const DIR = DirectoryManager();
const HTML_TASK = 'fileinclude'; // pug or fileinclude

// *********** COMMON METHOD ***********

// 実行時の引数取得
const args = minimist(process.argv.slice(2));

// 現在時刻の取得
const fmtdDate = new Date().toFormat('YYYY-MM-DD HH24MISS');

// clean
let cleanDIR;
gulp.task('clean', cb => {
  // if(args.clean) return del([cleanDIR], cb);
  // return cb();
  return del([cleanDIR], cb);
});

// *********** DEVELOPMENT TASK ***********

// browserSync
gulp.task('browserSync', ()=> {
  browserSync.init({
    server: {
      baseDir: DIR.dest
    },
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false
    }
  });
});

// sass
gulp.task('sass', ()=> {
  return gulp.src(DIR.src_assets + 'sass/**/*.{sass,scss}')
  .pipe(sourcemaps.init())
  .pipe(plumber())
  .pipe(sassGlob())
  .pipe(sass({
    includePaths: 'node_modules/tokyo-shibuya-reset',
    outputStyle: ':expanded'
  })
  .on('error', sass.logError))
  .pipe(please({
    sass: false,
    minifier: false,
    rem: false,
    pseudoElements: false,
    mqpacker: true
  }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(DIR.dest_assets + 'css/'))
  .pipe(browserSync.stream());
});

// js
gulp.task('scripts', () => {
  return gulp.src(DIR.src_assets + 'js/**/*.js')
  .pipe(plumber())
  .pipe(webpackStream(webpackConfig.dev, webpack))
  .pipe(gulp.dest(DIR.dest_assets + 'js'))
  .pipe(browserSync.stream());
});

// html include
gulp.task('fileinclude', ()=> {
  gulp.src([DIR.src + '**/*.html', '!' + DIR.src + '_inc/**/*.html'])
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: 'app/src/_inc'
    }))
    .pipe(gulp.dest(DIR.dest))
    .pipe(browserSync.stream());
});

// pug
gulp.task('pug', ()=> {
  gulp.src([DIR.src + '**/*.pug', '!' + DIR.src + '_inc/', '!' + DIR.src + '_inc/**/*.pug'])
    .pipe(plumber())
    .pipe(pug({
      pretty: true,
      basedir: DIR.src
    }))
    .pipe(gulp.dest(DIR.dest))
    .pipe(browserSync.stream());
});

// imageMin
gulp.task('imageMin', ()=> {
  return gulp.src(DIR.src_assets + 'img/**/*')
  .pipe(imagemin(
    [
      imagemin.gifsicle({
        optimizationLevel: 3,
        interlaced: true
      }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({ removeViewBox: false })
    ],
    { verbose: true }
  ))
  .pipe(gulp.dest(DIR.dest_assets + 'img/'))
  .pipe(browserSync.stream());
});

// watch
gulp.task('watch', ()=> {
  const htmlExpanded = (HTML_TASK === 'pug') ? 'pug' : 'html';
  gulp.watch(DIR.src + '**/*.' + htmlExpanded, [HTML_TASK]);
  gulp.watch(DIR.src_assets + 'sass/**/*.{sass,scss}', ['sass']);
  gulp.watch(DIR.src_assets + 'js/**/*.js', ['scripts']);
});

// only build
gulp.task('build', ()=> {
  cleanDIR = DIR.dest;
  runSequence(
    'clean',
    [HTML_TASK, 'scripts', 'sass', 'imageMin'],
  );
});

// default
gulp.task('default', ()=> {
  cleanDIR = DIR.dest;
  runSequence(
    'clean',
    [HTML_TASK, 'scripts', 'sass', 'imageMin'],
    'browserSync',
    'watch'
  );
});

// *********** RELEASE TASK ***********

// css
gulp.task('release_CSS', ()=> {
  return gulp.src(DIR.dest_assets + 'css/*.css')
  .pipe(please({
    sass: false,
    minifier: true,
    rem: false,
    pseudoElements: false
  }))
  .pipe(insert.prepend('/*! compiled at:' + fmtdDate + ' */\n'))
  .pipe(gulp.dest(DIR.release_assets + 'css/'));
});

// js conat
gulp.task('release_JS', () => {
  return webpackStream(webpackConfig.prod, webpack)
  .pipe(gulp.dest(DIR.release_assets + 'js'));
});

// releaesへcopy
gulp.task('release_COPY', ()=> {
  // img
  gulp.src(DIR.dest_assets + 'img/**/*.{jpg,png,gif,svg,ico}')
  .pipe(gulp.dest(DIR.release_assets + 'img/'));
  // html
  gulp.src(DIR.dest + '**/*.html')
  .pipe(gulp.dest(DIR.release));
});

// for release
gulp.task('release', ()=>{
  cleanDIR = DIR.release;
  runSequence(
    'clean',
    ['release_CSS', 'release_JS', 'release_COPY']
  );
});
