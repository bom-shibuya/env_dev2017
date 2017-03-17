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

const commonConfig = {
  entry: {
    script: './app/src/assets/js/script.js'
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
