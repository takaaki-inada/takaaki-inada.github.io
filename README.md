# 株式会社ずんだもん技術室AI放送局

（株式会社ずんだもんは架空の登場組織です）

# 静的サイト生成
jekyll

## localで確認(うまく動かなかった)
bundle install
gem install rexml
bundle exec jekyll serve


# memo

## _posts
dateが先日付のものはbuildされない

### 過去mp3のcloud storageへのアーカイブ
置き換え
audio_file_path: /audio/
audio_file_path: https://storage.googleapis.com/podcast-zund-arm-on/audio/

置き換えたmp3を削除してリポジトリをpush
一旦リポジトリをcloneして退避(git clone git@github.com:takaaki-inada/takaaki-inada.github.io.git)
```
git filter-branch --tree-filter "rm -f audio/マジカルラブリー☆つむぎのピュアピュアA.I.放送局_podcast_20250[1-6]*.mp3 audio/株式会社ずんだもん技術室AI放送局_podcast_20250[1-6]*.mp3 audio/私立ずんだもん女学園放送部_podcast_20250[1-6]*.mp3" HEAD
git reflog expire --expire=now --all
# ここから1時間かかる
git gc --aggressive --prune=now
git push -f --all
```
ローカルのサイズはcloneしなおさないと小さくならないのでリポジトリを消してcloneしなおす

- 参考(cloud straoge bucket)
https://console.cloud.google.com/storage/browser/podcast-zund-arm-on

## public/slides
現在、github actionsで自動でbuildしていない（手動でbuildしてpushしないと反映されない）
./scripts/build_marp_all.sh

※ slideの実装はmarp部分はslides.mdではなくindex.htmlを直接読みに言っているので、npm run devも ./scripts/build_marp_all.sh をしないと反映されない

## _includes/notice.html
### 過去memo
```
              <h1 class="card-heading">
                【告知】4/10 18:30- LangChainとLangGraphによるRAG・AIエージェント［実践］入門 10章 要件ドキュメント生成AIエージェントの輪読会やります
              </h1>
              <a href="/programs/LT_langgraph10_intro"><img src="/slides/LT_langgraph10/images/LT_langgraph10_thumbnail.jpg" alt="こちらのサイトでイベント告知配信中！" style="width: 100%;"></a>
              <div class="article-header-note">
                輪読会で使うスライドの最初の部分をあげておきます。<br/>
                PCでクリックするとずんだもんがLTしはじめます！<br/>
                お気軽にご参加ください（なお、当日はずんだもん出てきません）<br/>
                <a href="https://acesinc.connpass.com/event/350397/">エントリーはこちら</a>
              </div>
```

```
              <div class="article-header-note">
                <b>番組改編のお知らせ</b>
                <br/>
                月曜日は春日部つむぎ、金曜日はお嬢様ずんだもん、その他の曜日は今までどおりずんだもんでお届けします。
                <br/>
                今後ともよろしくお願いいたします。
                <br/>
              </div>
```

```
                <b>AI放送局の年末年始の放送について</b>
                <br/>
                12月28日(土)から1月5日(日)までの間、AI放送局は年末年始の休業とさせていただきます。また、1月6日(月)からは通常通り放送を再開いたしますので、どうぞよろしくお願いいたします。
                <br/>
                <br/>
```

```
              <h1 class="card-heading">
                まもなく放送１００回！記念Web放送を公開しました！
              </h1>
              <a href="/programs/LT_podcast"><img src="/images/zund_arm_on_100_notice.png" alt="お知らせ" style="width: 100%;"></a>
              <div class="article-header-note">
                社内LT会にずんだもん先輩がpodcast放送の紹介で登壇してきました！<br/>
                皆さまのお手元のPCでもずんだもん先輩のLTを再現できます！<br/>
                <a href="/programs/LT_podcast">こちらのサイトで配信中！</a>是非PCから遊んでみて！
              </div>
```

