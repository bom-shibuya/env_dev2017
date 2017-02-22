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
import sourcemaps from'gulp-sourcemaps'; // sassのソースマップ吐かせる
import please from "gulp-pleeease"; // sass周りのいろいろ
import webpack from 'gulp-webpack'; // js関係のことを今回やらせます。
import webpackConfig from './webpack.config.babel.js'; // webpackの設定ファイル


// *********** DIRECTORY ***********

// main directory
const DIR = {
  src:  'src/',
  src_assets: 'src/assets/',
  dest: 'dest/',
  dest_assets: 'dest/assets/',
  release: '_release/',
  release_assets: 'release/assets/'
};

// assets directory
const assets = 'assets/';

// *********** TIME ***********

const fmtdDate = new Date().toFormat("YYYY-MM-DD HH24MISS");

// *********** TASK ***********

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
  return gulp.src(DIR.src_assets +'sass/**/*.{sass,scss}')
  .pipe(sourcemaps.init())
  .pipe(plumber())
  .pipe(sass({outputStyle: ':expanded'})
  .on('error', sass.logError))
  .pipe(please({
    autoprefixer: {
      browsers: ['last 4 versions', 'last 4 ios_saf versions']
    },
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
    return gulp.src(DIR.src.assets + 'js/*.js')
    .pipe(webpack(webpackConfig.dev))
    .pipe(gulp.dest(DIR.dest_assets + 'js'))
    .pipe(browserSync.stream());
});


// ヘッダー・フッターインクルード
gulp.task("fileinclude", ()=> {
  gulp.src([DIR.src + '**/*.html', '!' + DIR.src +'_inc/**/*.html'])
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(DIR.dest))
    .pipe(browserSync.stream());
});

// pug
gulp.task("pug", ()=> {
  gulp.src([DIR.src + '**/*.pug', '!' + DIR.src + '_inc/', '!' + DIR.src +'_inc/**/*.pug'])
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
  return gulp.src(DIR.src.assets + 'img/**/*')
  .pipe(imagemin(
    [
    imagemin.gifsicle({
      optimizationLevel: 3,
      interlaced: true
    }),
    imagemin.jpegtran({
      progressive: true
    }),
    imagemin.optipng({
      optimizationLevel: 5
    }),
    imagemin.svgo({
      removeViewBox: false
    })
    ],
    {
      verbose: true
    }
  ))
  .pipe(gulp.dest(DIR.dest_assets + 'img/'))
  .pipe(browserSync.stream());
});


// watch
gulp.task('watch', ()=> {
  gulp.watch(DIR.src + '**/*.pug', ['pug']);
  gulp.watch(DIR.src.assets + 'sass/**/*.{sass,scss}', ['sass']);
  gulp.watch(DIR.src.assets + 'js/**/*.js', ['scripts']);
});


// default
gulp.task('default', ()=> {
  runSequence(
    ['pug', 'scripts', 'sass', 'imageMin'],
    'browserSync',
    'watch'
  )
});


// *********** RELEASE TASK ***********

// css
gulp.task('releaseCss', ()=> {
  return gulp.src(DIR.dest_assets + 'css/*.css')
  .pipe(please({
    autoprefixer: {
      browsers: ['last 4 versions', 'last 4 ios_saf versions']
    },
    sass: false,
    minifier: true,
    rem: false,
    pseudoElements: false,
    mqpacker: true
  }))
  .pipe(insert.prepend('/*! compiled at:' + fmtdDate + ' */\n'))
  .pipe(gulp.dest(DIR.release_assets + 'css/'))
});

// js conat
gulp.task('releaseJs', () => {
  return gulp.src(DIR.src.assets + 'js/*.js')
    .pipe(webpack(webpackConfig.prod))
    .pipe(gulp.dest(DIR.release_assets + 'js'))
});

console.log(webpackConfig.prod);

// imgのcopy
gulp.task('imgCopy', ()=> {
  return gulp.src(DIR.dest_assets + 'img/**/*.{jpg,png,gif,svg,ico}')
  .pipe(gulp.dest(DIR.release_assets + 'img/'))
});


// htmlのcopy
gulp.task('htmlCopy', ()=> {
  return gulp.src(DIR.dest + '**/*.html')
  .pipe(gulp.dest(DIR.release))
});

// for release
gulp.task('release', ()=>{
  runSequence(
    'releaseCss',
    'releaseJs',
    'imgCopy',
    'htmlCopy'
  )
})
