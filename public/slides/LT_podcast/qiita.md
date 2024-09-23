---
title: [個人開発] ずんだもんが技術トレンド記事を紹介するAIラジオの自動配信をはじめました！
tags: AI LLM langgraph 個人開発 podcast
author: takaaki_inada
slide: false
---
AIラジオ？AIが自動でラジオ番組を作成してpodcast配信します。
[zenncastさんのAIラジオの記事](https://zenn.dev/himara2/articles/db054d81b05d19)を読んで、いいなと思って自分でもやってみよう～と思った次第です。
ずんだもんが毎朝AIやテクノロジーに関するトレンド記事を紹介するラジオ番組を、AIを使って全自動で番組作成して配信までやっています。

# 番組podcastの配信サイト

https://zund-arm-on.com/

# コンテンツ紹介

先週まで3週間程、試験配信をしていました。
その中からデモ用に幾つかピックアップしましたのでまずは聴いてみてください。

<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="ja" dir="ltr">2024/6/3 お便りを頂いた配信回のサンプル(冒頭90秒)なのだ <a href="https://t.co/CewyUdoSca">pic.twitter.com/CewyUdoSca</a></p>&mdash; 株式会社ずんだもん技術室AI放送局 (@zund_arm_on_tec) <a href="https://twitter.com/zund_arm_on_tec/status/1802668595396411751?ref_src=twsrc%5Etfw">June 17, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

こちらは、StableAudioOpenという作曲AIにBGMを作ってもらった回です。
<blockquote class="twitter-tweet" data-media-max-width="560"><p lang="ja" dir="ltr">2024/6/7配信回のサンプル(冒頭1分)なのだ <a href="https://t.co/jGsyspM49J">pic.twitter.com/jGsyspM49J</a></p>&mdash; 株式会社ずんだもん技術室AI放送局 (@zund_arm_on_tec) <a href="https://twitter.com/zund_arm_on_tec/status/1802488864734601662?ref_src=twsrc%5Etfw">June 16, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

気に入って頂けましたら、是非、配信サイトよりpodcastの登録をお願いします！

# どういう仕組みなのか簡単に
平日毎朝5時に以下を自動で行います
- 番組で紹介するトレンドの記事の候補のURLをあつめてくる
- 番組で紹介する記事を3本ほどAIが選定する
- 各記事を5～10分の番組枠で紹介できる長さにAIが要約する
- お便りを頂いている場合は、過去に頂いたお便りとお返事を考慮しつつAIがお返事を考えて、番組で紹介するネタとして用意する
- 番組からのお知らせ、お便りのお返事、記事の要約をつないでラジオ番組の読み上げ原稿をAIが作成する
- 原稿を音声に変換(TextToSpeech)する
- podcast配信ページへ番組(音声ファイル)をアップロードする
- 配信した番組内容を元に配信告知宣伝するための簡単なtweetをAIが作成してXへpostする

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">おはようございます！株式会社ずんだもん技術室AI放送局、今日の話題は3つ！「Cat as a サービス」でネコ召喚、「ニュージーンズ」のMV、アメリカ人の紅茶の淹れ方！どれも気になる話ばかりなのだ。<a href="https://twitter.com/hashtag/AI%E3%81%9A%E3%82%93%E3%81%A0%E3%82%82%E3%82%93?src=hash&amp;ref_src=twsrc%5Etfw">#AIずんだもん</a><a href="https://t.co/GJPXwO6o2k">https://t.co/GJPXwO6o2k</a></p>&mdash; 株式会社ずんだもん技術室AI放送局 (@zund_arm_on_tec) <a href="https://twitter.com/zund_arm_on_tec/status/1802467501210812450?ref_src=twsrc%5Etfw">June 16, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

こんな感じで配信告知もAIが考えてXにポストしてます。

# ターゲットリスナー、想定ユースケース
新人エンジニアさんやQiitaのライトユーザ層に、毎朝の通勤電車や目覚まし代わりにに情報キャッチアップの一助としてpodcastをリスニングしてもう

# 3年後の目標
- リスナー1000人
- わかりやすいAI活用事例としてメディアにこのpodcastが取り上げられたる
- 最新技術のキャッチアップをどうやればいいのかまだわからないエンジニアを目指す初学者に、まず手始めにこのpodcastを聞くところからはじめるといいよ、と強い人から紹介してもらえるようになる
- そこから進んでコラボ案件を獲得（技術供与、儲かってるVTuberさんのAI podcast等）→収益化はこのあたり

# 運営方針
ゆるくやっていきます。
3年後として書いたことは、とらぬたぬき感が強いのですが、どうしたい？どうなりたい？はネタとして掲げるだけでも大事なので。
毎日情報キャッチアップで使っている時間を一部さいて上限を決めて時間を捻出する形で、こちらのサービスメンテにあてようと思います。
基本的に新しい技術の勉強やキャッチアップのほうが自分的には優先度が高いのですが、サービス維持するだけなら全自動運営されているので、なんとかなるはず。
とはいえそれだと、いつまでたっても閑古鳥がないているサービスになる気がするのだけど、最低、リスナーが自分一人でも、自分がリスナーとしていつづけるならサービス回し続けられるかなと。。。

# なぜやるか
やらないとわからないこと、継続してみてはじめて見える景色が、もしかしたらあるのかもと思った。
どんなことも最初は誰もいないところからはじまるのだから、このコンテンツに需要などないだろう、集客難しいだろうと最初からあきらめてしまうのではなく、ダメもとでもいいから、まずやってみないとはじまりもしないのかもと思った。

# サービス終了判断基準
リスナーが少なく、自分がいろんな理由でいらないと思ったら１カ月前にサービス終了を告知する形で。
いらないと思いそうな理由:
- AI技術が進歩してサービスが陳腐化
- 同じ路線でもっといいpodcastが出てきて太刀打ちできそうにない
など

# 見えている細かな課題
- 英字表記の読み上げ品質問題（VSCodeをバーサスコードと読み上げたり）
- 記事選定の品質問題、AIと技術トレンドに関係ない記事を選定する（全然関係ない官僚の過労働の記事をとりあげたり）

サービスを続けていく中で改善していきます！

# 技術構成要素
|   | 使用している技術   |
|:-----------|:------------|
| LLM        | gpt4o, gemini flash            |
| AI Agent(DAG) framework | langgraph            |
| Workflow管理 | github actions            |
| 音声読み上げ(TTS) | voicevox |
| podcast配信サイト | github pages (yattecast)            |
| Xへの配信告知 | tweepy            |

## システム概要
![zundarmon_podcast_system_diagram.drawio.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/116075/233512e3-908f-3e2c-5510-aad81ec5c995.png)

↑クリックすると大きくなります

# ちなみに「株式会社ずんだもん技術室AI放送局」とは
株式会社ずんだもんは実在しません。架空の組織です。
ガンダム水星の魔女に出てくるgund-armを平和利用するために設立された会社「株式会社ガンダム」の設定をぱくっています。
OpenAIが人類滅亡を危惧しているAI技術「zund-arm」を平和利用するために設立された会社という設定にしておきましょう。

# おわりに
朝起きて、podcastを確認してずんだもんの声が流れてくるとほっと安堵。今日もなんとか配信うまく行ったみたい。ずんだもんに起こされる優しい日々。昔アニメで見た未来的なAIアバターって、ふたあけてみたら、ずんだもん実はおまえだったのか！？

AIはリアルタイム化、マルチモーダル化、マルチエージェント化、個人ごとのパーソナライズ、高速軽量化の方向に技術は進化していき、podcastという静的なコンテンツではなく、あなただけのAIパートナーやAIアバターが、あなたが朝起きて身支度をしている時に、まるで未来のアニメの世界のように、あなたに必要な今日の情報のキャッチアップ、今日の予定の確認、Agentにまかせること、自分が今日やること、をAIがサポートしてくれる未来、そんな未来がやってくるのだ。

# 参考リンク
zenncastさんの素晴らしい記事。すごく参考にさせて頂きました。

https://zenn.dev/himara2/articles/db054d81b05d19
