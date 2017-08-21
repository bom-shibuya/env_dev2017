# TOKYO SHIBUYA DEV
---

TOKYO SHIBUYA DEVはホームページ手作り用キットです。<br>
完全に個人目線で開発をしていますが、ありきたりな構成ではあるので、cloneしてくればだれでもすぐに開発が始められるでしょう。

## 構成

### node

* >= 7.0.0

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
  * webpack3 -- jsをどうこうするのに
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

開発タスク -- 吐き出しだけ

    $ npm run build

eslint

    $ npm run lint

eslintがエラー吐くときにnpm ERR!がいっぱい出ますが、ウザかったら`npm run lint -s`でnpmを黙らせましょう。`--silent`でももちろんいいです。

リリースタスク

    $ npm run release

リリースされたものの確認

    $ npm run server

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

ディレクトリはpackage.jsonとどう階層においてあるDirectoryManager.jsをgulpfileとwebpack configで使っています。<br>
それぞれ、pathの書き方が違うので、そこを柔軟にするために関数化して、必要なら引数を食わせることにしました。  
ディレクトリ構成を変更する場合はそこも確認してみてください。

### webpackとbabelとeslint

**webpack configについて**

現在主流なのはwebpack configをcommmon/dev/prodの3枚とかに分けることだとおもうのですが、今回は対して違いがないので、全て1枚のファイルにまとめています。そしてオブジェクトにぶら下げてわたすことで、gulpで読み込むときにどの設定を読み込むかを分けています。
現状2パターンあります。(dev/prod)

**webpack3とbabel**

babelで jsのトランスパイルを行っていますが、webpack3の絡みのせいでややこしいことになっています。<br>
なぜなら、webpack3ではes6 modules(import/export)をfalseにしないとtree shakingがおこなわれないけれど、設定ファイルである、gulpfile.babel.jsとwebpack.config.babel.jsではimportとか、いろいろ使いたいみたいな気持ちがあったからです。<br>
つまり、.babelrcに設定ファイル用をかいているが、実際のjsをコンパイルするとき用のbabelの設定はwebpack.config内で別途記述しているということです。<br>
もしかしたらなんとかするかもしれません。

**eslint**

FREE CODE CAMPのものをパクってきて使ってます。

### special thanks

inagaki氏のsassファイルからmixins, variablesのutils, colorファイルの構成を使用させてもらってます。<br>
thunk you inagakiiii!!
