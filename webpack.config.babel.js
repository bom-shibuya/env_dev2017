'use strict';
/*
      ██╗    ██╗███████╗██████╗ ██████╗  █████╗  ██████╗██╗  ██╗
      ██║    ██║██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██║ ██╔╝
      ██║ █╗ ██║█████╗  ██████╔╝██████╔╝███████║██║     █████╔╝
      ██║███╗██║██╔══╝  ██╔══██╗██╔═══╝ ██╔══██║██║     ██╔═██╗
      ╚███╔███╔╝███████╗██████╔╝██║     ██║  ██║╚██████╗██║  ██╗
       ╚══╝╚══╝ ╚══════╝╚═════╝ ╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 */

import webpack from 'webpack';
import Path from 'path';
import ModernizrWebpackPlugin from 'modernizr-webpack-plugin';

const commonConfig = {
  entry: {
    script: './src/assets/js/script.js'
  },
  output: {
    filename: "[name].js"
  },
  // ファイル名解決のための設定
  resolve: {
    // 拡張子の省略
    extensions: ['', '.js'],
    // moduleのディレクトリ指定
    modulesDirectories: ['node_modules'],
    // rootの解決
    // root: Path.resolve(__dirname + 'node_modules/'),
    // プラグインのpath解決
    alias: {
      "TweenLite": Path.resolve("node_modules", "gsap/src/uncompressed/TweenLite"),
      "ScrollTo":  Path.resolve("node_modules", "gsap/src/uncompressed/plugins/ScrollToPlugin.js"),
      "EasePack":  Path.resolve("node_modules", "gsap/src/uncompressed/easing/EasePack.js"),
      "modernizr$": Path.resolve(__dirname, ".modernizrrc")
    }
  },
  // モジュール
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.modernizrrc$/,
        loader: "modernizr"
      }
    ]
  },
  // プラグイン
  plugins: [
    // ライブラリ間で依存しているモジュールが重複している場合、二重に読み込まないようにする
    new webpack.optimize.DedupePlugin(),
    // ファイルを細かく分析し、まとめられるところはできるだけまとめてコードを圧縮する
    new webpack.optimize.AggressiveMergingPlugin(),
    // jQueryをグローバルに出す
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ]
};

const devConfigs = {
  ...commonConfig,
  devtool: "source-map",
  eslint: {
   configFile: './.eslintrc'
  },
  module: {
    ...commonConfig.module,
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      }
    ]
  }
};


const prodConfigs = {...commonConfig,
  plugins: [...commonConfig.plugins, new webpack.optimize.UglifyJsPlugin()]
};

module.exports = {
  dev: devConfigs,
  prod: prodConfigs
};
