---
marp: true
theme: custom
paginate: true
image: https://zund-arm-on.com/slides/LT_langgraph10/images/LT_langgraph10_thumbnail.jpg
title: LangChainとLangGraphによるRAG・AIエージェント実践入門10章輪読会
description: 1. 導入LT:ユースケースを明確にして要件定義をしよう 2. Elicitronフレームワークの概要説明 3. 動かして理解を深める＆コードをひたすら読む
author: Takaaki Inada
keywords: langgraph,requirements engineering
---

<!-- _class: title -->

![bg cover](https://zund-arm-on.com/slides/LT_langgraph10/images/LT_langgraph10_thumbnail.jpg)

---

<!-- _class: title -->

# LangChainとLangGraphによるRAG・AIエージェント実践入門 輪読会

<h2>
10章「要件ドキュメント生成AIエージェント」
</h2>

2025/3/27

![blur bg cover opacity:.3](https://zund-arm-on.com/slides/LT_podcast/images/4.jpg)

---

# 本日のAgenda

- 導入LT: ユースケースを明確にして要件定義をしよう(6分)

- Elicitronフレームワーク 論文概要(12分)

- 質問＆中休憩(3分)

- 10章「要件ドキュメント生成AIエージェント」(21分)
動かして理解を深める＆コードをひたすら読む

- 運営からの事務連絡等 (3分)

---

<!-- _class: title -->

# 導入LT: ユースケースを明確にして要件定義をしよう
(6分)

![blur bg cover opacity:.18](https://zund-arm-on.com/slides/LT_podcast/images/7.jpg)

---

# システム開発の落とし穴

ユーザが思ってたのと違うシステムが出来る

<div class="columns">

<div style="flex: 7; text-align:center">

![height:480px](https://zund-arm-on.com/slides/LT_langgraph10/images/sfig2.jpg)

</div>

<div style="flex: 5; text-align:center">

![height:400px center](https://zund-arm-on.com/slides/LT_langgraph10/images/510580.png)
顧客が本当に必要だったもの

</div>

</div>

---

# 顧客が本当に必要だったもの

そもそも、まず要件定義をした？

![height:440px](https://zund-arm-on.com/slides/LT_langgraph10/images/システム開発V字モデル.png)
<div style="font-size: 40%">出典:セキュリティ・バイ・デザイン「システム開発のセキュリティ向上0.0」</div>

---

# 顧客が本当に必要だったもの

要件はレビューしてもらった？

<div class="columns">

<div style="flex: 6; text-align:center">

<br/>
<br/>
<br/>
聞いてないんだが！

</div>

<div style="flex: 6;">

![height:440px](https://zund-arm-on.com/slides/LT_langgraph10/images/クレーム.jpg)

</div>

</div>


---

# 顧客が本当に必要だったもの

その要件定義、誰が要件を出した？（要件出した人は実際に使う人？）

<div class="columns">

<div style="flex: 6; text-align:center">

<br/>
AWSみたいなシステム作って！<br/>
<br/>
OpenAIみたいなシステム作って！<br/>
<br/>
非機能要件：外販できること！

</div>

<div style="flex: 6;">

![height:440px](https://zund-arm-on.com/slides/LT_langgraph10/images/クレーム.jpg)

</div>

</div>


---

# 顧客が本当に必要だったもの

実際に使うユーザのユースケースに落として、
何が出来るかイメージ出来るとこまで落として確認した？

<div class="columns">

<div style="flex: 4; text-align:right">

![height:440px center](https://zund-arm-on.com/slides/LT_langgraph10/images/511609.png)

</div>

<div style="flex: 8; text-align:center">

<br/>
機能要件：ブランコ機能

<br/>
<br/>
（誰が使う？）
<br/>
（どういうユースケースで使う？）
<br/>
（作るものがイメージ出来る？）
</div>

</div>


---

# ユーザにユースケースを確認しよう

ユースケースを明確にして要件定義をしよう

<div style="text-align:center">

![height:400px center](https://zund-arm-on.com/slides/LT_langgraph10/images/510580.png)

顧客が本当に必要だったもの
</div>

---

<!-- _class: title -->

# Elicitronフレームワーク 論文概要

<div style="font-size: 70%">Elicitron: An LLM Agent-Based Simulation Framework for Design Requirements Elicitation (2024)</div>
<br/>
(12分)

![blur bg cover opacity:.2](https://zund-arm-on.com/slides/LT_podcast/images/5.jpg)

---

# 最初に自己紹介

<div class="columns">

<div style="flex: 5; text-align:right">

![height:400px center](https://zund-arm-on.com/slides/LT_langgraph10/images/icon.jpg)

</div>

<div style="flex: 7; text-align:center">

<br/>
<h2>稲田 高明</h2>
<br/>
ACES ソフトウェアエンジニア
<br/>
～ インフラからアプリまで手広く

</div>

</div>


---

# 個人開発サービスの宣伝

<div class="columns">

<div style="flex: 8;">

![center](https://zund-arm-on.com/images/zundamon_thumbnail.jpg)

</div>

<div style="flex: 4;">

<br/>
“ずんだもん AI放送局“
<br/>
で検索
<br/>
<br/>

- langgraph
- langsmith
- 全自動配信

<br/>
<div style="text-align:center; font-size: 90%">
案件ください！！
</div>

</div>

</div>

---

# 本日の問い

<div class="columns">

<div style="flex: 7;">

「ユーザにユースケースを確認しよう」

- 適切なユーザがすぐつかまらない

- ユーザインタビュー
コストと時間めっちゃかからない？

- 多用なニーズ、潜在要求の把握

<br/>
<h2>それ、AIでいい感じに出来ない？</h2>

</div>

<div style="flex: 5; text-align:center">

![height:400px](https://zund-arm-on.com/slides/LT_langgraph10/images/12.jpg)

</div>

</div>


---

# 背景と主要問題

従来の要求獲得手法は、多様なユーザー視点の不足や潜在的要求の抽出困難、実施にかかる時間やコストの問題を抱える

<div style="text-align:center">

![height:500px](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/user-research-challenges.svg)

</div>

---

# [Elicitron] 論文の提供する解決策

LLMを用いたエージェントインタビューと分析により潜在ニーズを抽出
CoT(Chain of Thought)でユーザの多様性と潜在ニーズの抽出精度を向上

<div style="text-align:center">

![height:500px](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/llm-agent-user-research2.svg)

</div>

---

# [Elicitron] 論文の技術的優位性

<div class="columns">


<div style="flex: 7; text-align:center">

潜在ニーズ抽出数を1.8倍(baseline比[1])

![height:400px center](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/latent-needs.jpg)

<div style="font-size: 40%">出典:Elicitron: An LLM Agent-Based Simulation Framework for Design Requirements Elicitation. Fig.4</div>
<div style="font-size: 40%">[1]:Lin, Joseph and Seepersad, Carolyn Conner. “Empathic Lead Users: The Effects of Extraordinary User Experiences on Customer Needs Analysis and Product Redesign.”</div>

</div>

<div style="flex: 5; text-align:center">

実施にかかる時間を
80時間(4時間/人x20人)
→ 2.3時間に短縮

![](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/horizontal-bar-comparison.svg)

</div>

</div>


---

# [Elicitron] 論文の先行研究

## DETC2007/35302: “Empathic Lead Users: The Effects of Extraordinary User Experiences on Customer Needs Analysis and Product Redesign.”

### Empathic Lead User (ELU)インタビュー

通常のユーザに対して特別な状況をシミュレートし、インタビューを実施することで潜在ニーズを抽出する
典型的な顧客の経験からの逸脱を考慮し、通常では見過ごされがちな潜在ニーズを明らかにする

---

# [Elicitron] 論文の先行研究(ELUインタビューの例)

「週末にキャンプをする、15〜30歳、健康で体力があり、年に数回キャンプをする人」に対して二人用テントの製品インタビューを実施

![width:1100px](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/elu-horizontal.svg)

<div style="font-size: 80%">潜在ニーズを元にNemo Equipment社のSakoテント(空気注入式の支柱を持つテント)が製品化</div>

---

# Elicitron フレームワーク概要

<div class="columns">

<div style="flex: 8; text-align:center">

![](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/image_elicitron_framework_all.jpg)

</div>

<div style="flex: 4; text-align:left; font-size:85%">

<br/>

<b>ブロック構成：</b>

・ユーザエージェント生成

・製品体験生成

・ユーザインタビュー

・ユーザニーズ抽出

</div>

</div>

---

# Elicitron解説(ユーザエージェント生成)

多様性が最大となるようにユーザのペルソナを作成する

<div class="columns">

<div style="flex: 6; text-align:center">

![center](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/image_elicitron_framework_1_agent.jpg)

</div>

<div style="flex: 6; text-align:left">
<br/>
<b>作成方法：</b>

一つ前に作成したユーザとは異なる典型的なユーザを順番に作成
さらに、非典型的なユーザをprompt操縦(steer)で作成

</div>

</div>

---

# Elicitron解説(ユーザエージェント生成)

serial method prompt
```
Generate three different user personas for a camping tent, including their name, a description of their characteristics, and a rationale for creating each agent
```

steer prompt
```
You must create non-typical users based on the following description of a typical user:
“The typical user would be a weekend camper, 15-30 years old, with very good health and physical fitness, who camps a few times a year.
 The typical usage environment would be a public park or wilderness area, in a generally wooded or grassy environment with warm, sunny weather.”
```

<div style="font-size: 80%">
<b>実際に生成されたユーザ（例）</b>

典型的なユーザ：「週末にキャンプをする、15〜30歳、健康で体力があり、年に数回キャンプをする人」
非典型なユーザ：「アドベンチャーを求めるティーン」「引退した自然愛好家」「身体障害を持つ人」「遠征リーダー」「高地登山家」など
</div>

---

# Elicitron解説(製品体験生成)

ユーザインタビューで潜在的なニーズを特定するためのコンテキストとして製品体験を生成する

<div class="columns">

<div style="flex: 6; text-align:center">

![center](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/image_elicitron_framework_2_experience.jpg)

</div>

<div style="flex: 6; text-align:left; font-size:80%">

多様なインタラクションのシミュレーション
- セットアップ
- 特定機能の使用
- トラブルシューティングなど

具体的な利用シナリオの特定のための構造化
- 「行動 (Action)」
- 「観察 (Observation)」
- 「課題 (Challenge)」

</div>

</div>

---

# Elicitron解説(製品体験生成)

例：「関節炎を患う高齢者」ユーザにテント利用に関する製品体験を生成

```
ステップ1：
アクション：指の器用さが限られている状態で、テントの入り口のジッパーをつかもうと試みた。　　　　　　　　　　　　
観察：ジッパーが小さすぎて把持しにくく、操作が困難だった。
課題：テントの開閉に苦労し、イライラした。

ステップ2：
アクション：テントのポールを組み立て、構造の上に生地を張ろうとした。
観察：テントポールを接続し、生地を引っ張るのに必要な力が、関節炎の痛みを悪化させた。
課題：指の力が弱く、痛みがあるため、組み立てが困難で時間がかかった。

ステップ3：
アクション：テントを地面に固定しようとした。
観察：通常サイズの杭とハンマーを使う方法では、自分の状態では扱えないと感じた。
課題：テントを効果的に地面に固定できず、風の強い状況下での安全性が懸念された。

ステップ4：
アクション：使用後、テントを片付けようとした。
観察：テントを畳んでバッグに収まるほどきつく巻くのに苦労した。
課題：この作業は肉体的にきつく、自分には必要な器用さと力が足りず、他人の助けを借りる必要があった。
```

---

# Elicitron解説(ユーザインタビュー)

「質問プールの作成」「ユーザインタビュー」のタスクで構成される

<div class="columns">

<div style="flex: 4; text-align:center">

![center](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/image_elicitron_framework_3_interview.jpg)

</div>

<div style="flex: 8; text-align:center">

![center](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/question-design-process.svg)

</div>

</div>

---

# Elicitron解説(ユーザインタビュー)

<b>生成されたユーザへの質問（例）</b>

```
自由形式：
「理想的なテントを購入するとしたら、どのような主な特徴を求めますか？」

カテゴリ別：
「テントの[カテゴリ]の側面、具体的には、あなたのニーズと、
　それらのニーズに対応するための革新的な洞察を教えてください」
*カテゴリ:サイズ、形状、重量、素材、安全性、耐久性、美観、エルゴノミクス、コスト、セットアップ、輸送

質問:
テントの設営という側面に特に焦点を当てて、あなたのニーズと、
それらのニーズに対応するための革新的なアイデアがあれば教えてください。

回答:
「…バッグから取り出すと自動的に展開し、自分で設営できる自己設営型のテント構造です。
手動でテントポールを接続したり、生地を伸ばしたりする必要がありません。
これは、スプリング式または形状記憶素材の技術を活用できるでしょう。
構造要素は、解放されると自動的に正しい形状と張力を得るように設計されています。」
```

---

# Elicitron解説(ユーザニーズ抽出)

ユーザ回答を元に"think step-by-step to detect the latent needs"で潜在ニーズをLLMに考えさせ、次の条件で潜在ニーズかを判定

<div class="columns">

<div style="flex: 6; text-align:center">

![center](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/image_elicitron_framework_4_report.jpg)

</div>

<div style="flex: 7; text-align:left; font-size:80%">

潜在ニーズの判定条件：

- 製品設計への重要な変更を表しており、サイズ、形状、重量、素材、安全性、耐久性、美観、エルゴノミクス、コスト、セットアップ、または輸送のカテゴリのいずれにも該当しない場合
- 製品および/またはその使用方法に関して、非常に革新的で明確に表現された洞察を反映している場合

</div>

</div>

---

# Elicitron解説(ユーザニーズ抽出)

潜在ニーズ:
「写真撮影のために広い視野を確保するために、指定された開口部を通してテントの内部構造を再設計する」
 → 既存のカテゴリに当てはまらない製品設計への重要な変更

潜在ニーズではない:
「鋭利なものや一般的な摩耗による裂けに強いテントの床にする」
 → 耐久性という既存のカテゴリに該当

---

# Elicitronフレームワークのおさらい

![center](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/elu-needs-extraction-process.svg)

---

# [Elicitron] 論文の提案する方法の限界または制約

![height:550px](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/vertical-llm-flow-challenges-no-title.svg)

---

# 最初の問いに立ち戻る

要件定義で「<b>ユーザにユースケースを確認する</b>」という課題に、Elicitronの潜在ニーズ抽出の手法を応用できるのでは？

![width:1200px](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/image_re_elecitron_compare.jpg)

<div style="font-size: 40%">引用元: LangChainとLangGraphによるRAG・AIエージェント実践入門 p278</div>

---

# そして輪読会がはじまる

<div class="columns">

<div style="flex: 7; text-align:left">

langgraphで要件定義にElicitronを活用して実装している本が出ている！

<b>そうだ、輪読会をしたらいいのでは！？</b>

</div>

<div style="flex: 5; text-align:center">

![height:500px center](https://zund-arm-on.com/slides/LT_langgraph10/images/bookcover.jpg)

</div>

</div>


---

<!-- _class: title -->

# 質問＆中休憩

(3分)

![blur bg cover opacity:.3](https://zund-arm-on.com/slides/20241004ex/images/6.jpg)

---

<!-- _class: title -->

<h1>
10章「要件ドキュメント生成AIエージェント」

動かして理解を深める＆コードをひたすら読む
</h1>

(21分)

![blur bg cover opacity:.2](https://zund-arm-on.com/slides/20240911/images/12.jpg)

---

# 輪読会の進め方

- 発言自由・質問歓迎：
気軽に意見や疑問を出し合い、学びを深める場にする。

- スライド不要・準備は最小限：
手間をかけず、気軽に参加できるようにする。

- 完璧を求めない：
ざっくり理解でOK。わからない部分はみんなで考える。

---

# まずは動かしてみる

[https://github.com/GenerativeAgents/agent-book](https://github.com/GenerativeAgents/agent-book)

chapter10
```markdown
poetry run python -m documentation_agent.main --task "スマートフォン向けの健康管理アプリを開発したい"
```

実行すると、
- 途中経過のログは出ない(動いているのかちょっと心配になる)
- 1分程で結果が返ってくる

---

# コードスタディ: 処理の流れ(全体)

<div class="columns">

<div style="flex: 8;">

![height:500px](https://zund-arm-on.com/slides/LT_langgraph10/images/elicitron/image_process.jpg)

<div style="font-size: 40%">引用元: LangChainとLangGraphによるRAG・AIエージェント実践入門 p278</div>

</div>

<div style="flex: 4; font-size: 60%">

<br/>
<br/>

主要エージェント:

- PersonaGenerator

- InterviewConductor

- InformationEvaluator

- RequirementsDocumentGenerator

</div>

</div>

---

# コードスタディ: 処理の流れ(レポートの生成)

以下の通り出力する構成をpromptで指定して要件定義書を作成
- プロジェクト概要
- 主要機能
- 非機能要件
- 制約条件
- ターゲットユーザー
- 優先順位
- リスクと軽減策

---

# コードスタディ: 実装のポイント

LLMまとめ
- 初期ペルソナ5セット作成
- 情報の不足に応じて動的にペルソナ追加
- AIエージェントによる包括的な要件収集
- 自動要件ドキュメント生成
- LangGraphワークフロー
- Pydanticによる構造化データモデリング

---

# 個人的な気付き、ふと思ったこと

- ターゲットユーザがある程度絞れるケースでは以下も有効？
  - 会議やslackでの発言、人事データからペルソナを作成
  - 購買履歴と閲覧履歴から仮想ペルソナを作成
  - 医療診療履歴等から仮想ペルソナを作成

- 特定のドメイン特化のソリューションの要件定義
ユーザインタビューで業務個別の知識を渡す必要がありそう

- 他のシステムに依存するシステムの要件定義を作る場合どうすると良い？

---

# 振り返り

この章では、Elicitronフレームワークをlanggraphで実装し以下を実現した

- ユーザインタビュー起点の要件定義プロセスの実装
- AI技術を活用した要件定義プロセスの効率化
- 多様な仮想ペルソナからの潜在ニーズの掘り起こし

---

<!-- _class: end -->

<br/>
<br/>

# ご参加ありがとうございました！

<div style="text-align:center">

<br/>

[宣伝]
![height:300px center](https://zund-arm-on.com/images/zundamon_thumbnail.jpg)

</div>
