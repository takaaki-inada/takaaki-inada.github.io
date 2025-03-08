# 株式会社ずんだもん技術室AI放送局

（株式会社ずんだもんは架空の登場組織です）

# 静的サイト生成
jekyll

# memo

## public/slides
現在、github actionsで自動でbuildしていない（手動でbuildしてpushしないと反映されない）
./scripts/build_marp_all.sh

※ slideの実装はmarp部分はslides.mdではなくindex.htmlを直接読みに言っているので、npm run devも ./scripts/build_marp_all.sh をしないと反映されない

## _includes/notice.html
### 過去memo
```
              <h1 class="card-heading">
                langgraph本 輪読会 イベント告知
              </h1>
              <a href="/programs/LT_langgraph10_intro"><img src="/images/LT_langgraph10/LT_langgraph10_thumbnail.jpg" alt="お知らせ" style="width: 100%;"></a>
              <div class="article-header-note">
                運営の人が輪読会の進行やります<br/>
                <a href="/programs/LT_langgraph10_intro">こちらのサイトでイベント告知配信中！</a>是非PCから遊んでみて！<br/>
                興味が沸いたら、お気軽にご参加を！
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
