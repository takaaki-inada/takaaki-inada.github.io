---
marp: true
theme: custom
paginate: true
---

<!-- _class: title -->

<h1>
LTテーマ [個人開発]<br/>
エンジニア向けpodcast放送の紹介<br/>
～AI使って全自動でやってるよ～
</h1>

2024/9/26

![blur bg cover opacity:.3](/slides/LT_podcast/images/4.jpg)

---

# Agenda

- エンジニア向けpodcast放送のご紹介 (2分)
- 使っている技術の簡単な説明 (1分)
- 「スライドショーも自動で作って動画配信にも対応してみた」のデモ
 (1.5分)
- おわりに & 質疑応答 (3分)

![blur bg cover opacity:.3](/slides/LT_podcast/images/1.jpg)

---

# エンジニア向けpodcast放送のご紹介 (2分)

<div class="columns">

<div style="flex: 7;">

- ターゲットユーザ
新人エンジニアが平日の朝の通勤や身支度の時間に、最新技術トレンドをキャッチアップ
</div>

<div style="flex: 5;">

![height:500px](/slides/LT_podcast/images/2.jpg)

</div>

</div>

---

実際の放送でどんな記事をとりあげているか操作員(Human)が紹介

<a href="https://zund-arm-on.com/" target="_blank">株式会社ずんだもん技術室AI放送局</a>

![blur bg cover opacity:.3](/slides/LT_podcast/images/5.jpg)

---

# 使っている技術の簡単な説明 1/2 (30秒)

![](/slides/LT_podcast/images/zundarmon_podcast_system_diagram_20240919.drawio.png)

---

# 使っている技術の簡単な説明 2/2 (30秒)

| 機能　             | 使用している技術   |
|:-------------------|:------------|
| LLM (番組作成, Chatbot)  | gpt-4o-mini, gemini flash            |
| AI Agent framework | langgraph            |
| スライドショー | marp, aituberkit(slides関連実装)   |
| スライド画像生成 | flux.1            |
| 音声読み上げ | voicevox |
| 番組作成配信のCI/CD | github actions            |
| 配信サイト | github pages (yattecast, marp-cli, Next.js(static export))     |
| Xへの自動配信告知 | tweepy            |

---

# スライドショーも自動で作って動画配信にも対応してみた

デモ全体 (1.5分)
1. opening (25秒)
1. 1本目記事前半(50秒)

![blur bg cover opacity:.3](/slides/LT_podcast/images/6.jpg)

---

操作員(Human)によるデモ画面表示

<a href="https://zund-arm-on.com/programs/20240911/ " target="_blank">https://zund-arm-on.com/programs/20240911/</a>

![blur bg cover opacity:.3](/slides/LT_podcast/images/7.jpg)

---

<!-- _class: end -->

# おわりに ＆ 質疑応答 (3分)

<div class="columns">

<div style="flex: 5;">

![height:500px](/slides/LT_podcast/images/8.jpg)

</div>

<div style="flex: 7;">

スライド自体をmarpで作っておいて、
ほぼ全自動でプレゼンしました。
**質疑応答の受け答えもAIがします**

（AIとずんだもんに仕事を奪われていく…）

</div>

</div>

---

<!-- _class: end -->

# link

podcast配信サイト: [株式会社ずんだもん技術室AI放送局](https://zund-arm-on.com/)
Qiita: [\[個人開発\]ずんだもんが技術トレンド記事を紹介するAIラジオの自動配信をはじめました](https://qiita.com/takaaki_inada/items/ae457a2c4fbcecf9eade) 
