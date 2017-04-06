# TOKYO SHIBUYA DEV
---

TOKYO SHIBUYA DEVはホームページ手作り用キットです。<br>
完全に個人目線で開発をしていますが、ありきたりな構成ではあるので、cloneしてくればだれでもすぐに開発が始められるでしょう。

## 構成

### node

* >= 7.5.0

他でも動くと思うけど、動作してるのは7.5.0

### パッケージマネージャ

* yarn

入っていれば`yarn`で、なければhomebrewなりでyarnを落としてくるか、`npm i`でも叩きましょう。おそらくそれでも入ってくると思います。

### タスクランナーなどの構成

* gulp
  * pug -- htmlをどうこうするのに
  * gulp-file-include -- pug使わないときのために一応置いてる。
  * sass(scssでない)
  * pleeease -- cssをいい感じに
  * webpack2 -- jsをどうこうするのに
  * imagemin -- 画像圧縮
  * browser-sync -- ローカルホスト立ち上げ用

* babel
  * env
  * stage-0
  * transform-runtime

大まかには以上で、詳しいことはpackage.jsonで

### 元から入れてるプラグイン

**css**
* TOKYO SHIBUYA RESET -- 僕が作った全消しリセット

**js**
* jquery -- どこでも使えるようにしてある
* modernizr -- touch eventだけ
* gsap
* imagesloaded
* webfontloader

## コマンド

開発タスク -- watch

    $ npm start

開発タスク -- watch & lint

    $ npm lint

開発タスク -- 吐き出しだけ

    $ npm build

リリースタスク

    $ npm release

リリースされたものの確認

    $ npm server

## 詳細

### ディレクトリとファイル

ディレクトリは以下

    app -- _release リリースフォルダ
      |  ├ dest ステージング
      |  ├ src 開発
      |     ├ assets
      |       ├ js
      |       ├ img
      |       ├ sass
      |         ├ lib
      |           ├ modules...
      |
    package.json ...

### webpackとbabelとeslint

**webpack configについて**

現在主流なのはwebpack configをcommmon/dev/prodの3枚とかに分けることだとおもうのですが、今回は対して違いがないので、全て1枚のファイルにまとめています。そしてオブジェクトにぶら下げてわたすことで、gulpで読み込むときにどの設定を読み込むかを分けています。
現状3パターンあります。(dev/lint/prod)

**webpack2とbabel**

babelで jsのトランスパイルを行っていますが、webpack2の絡みのせいでややこしいことになっています。<br>
なぜなら、webpack2ではes6 modules(import/export)をfalseにしないとtree shakingがおこなわれないけれど、設定ファイルである、gulpfile.babel.jsとwebpack.config.babel.jsではimportとか、いろいろ使いたいみたいな気持ちがあったからです。<br>
つまり、.babelrcに設定ファイル用をかいているが、実際のjsをコンパイルするとき用のbabelの設定はwebpack.config内で別途記述しているということです。<br>
もしかしたらなんとかするかもしれません。

**eslint**

FREE CODE CAMPのものをパクってきて使ってます。ですが、**エラーを警告に変更**してます。これはlintモードもwatchが走るようにしているのですが、警告がでるとwatchが止まるからです。<br>
方法が見つかれば修正するかも
