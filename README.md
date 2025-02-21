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
```
                <b>AI放送局の年末年始の放送について</b>
                <br/>
                12月28日(土)から1月5日(日)までの間、AI放送局は年末年始の休業とさせていただきます。また、1月6日(月)からは通常通り放送を再開いたしますので、どうぞよろしくお願いいたします。
                <br/>
                <br/>
```
