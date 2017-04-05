'use strict';
/*
      ██╗    ██╗███████╗██████╗ ██████╗  █████╗  ██████╗██╗  ██╗██████╗
      ██║    ██║██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔════╝██║ ██╔╝╚════██╗
      ██║ █╗ ██║█████╗  ██████╔╝██████╔╝███████║██║     █████╔╝  █████╔╝
      ██║███╗██║██╔══╝  ██╔══██╗██╔═══╝ ██╔══██║██║     ██╔═██╗ ██╔═══╝
      ╚███╔███╔╝███████╗██████╔╝██║     ██║  ██║╚██████╗██║  ██╗███████╗
       ╚══╝╚══╝ ╚══════╝╚═════╝ ╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝
 */

import webpack from 'webpack';
import Path from 'path';

const commonConfig = {
  entry: {
    script: './app/src/assets/js/script.js'
  },
  output: {
    filename: '[name].js'
  },
  // ファイル名解決のための設定
  resolve: {
    // 拡張子の省略
    extensions: ['.js'],
    // moduleのディレクトリ指定
    modules: ['node_modules'],
    // プラグインのpath解決
    alias: {
      'modernizr$': Path.resolve(__dirname, '.modernizrrc')
    }
  },
  // モジュール
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          "presets": [
            "stage-0",
            ["env", {
              "targets": {
                 "browsers": ["last 2 versions", "ie >= 11"]
              },
              "modules": false
            }]
          ],
          "plugins": [
            "transform-runtime"
          ]
        }
      },
      {
        test: /\.modernizrrc$/,
        loader: 'modernizr-loader'
      }
    ]
  },
  // プラグイン
  plugins: [
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

// for development Config
const devConfig = {
  ...commonConfig,
  devtool: 'cheap-module-source-map',
};

// for development linter mode
const devLintConfig = {
    ...devConfig,
    module: {
      rules: [...commonConfig.module.rules, {
        enforce: 'pre', // 先に読んでね
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }]
    }
}

// for production Config
const prodConfig = {...commonConfig,
  plugins: [...commonConfig.plugins, new webpack.optimize.UglifyJsPlugin()]
};

module.exports = {
  dev: devConfig,
  devLint: devLintConfig,
  prod: prodConfig
};
