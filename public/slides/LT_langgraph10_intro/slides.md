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

# LangChainとLangGraphによるRAG・AIエージェント実践入門 輪読会

<h2>
10章「要件ドキュメント生成AIエージェント」
</h2>

2025/4/10

イベント告知版

![blur bg cover opacity:.3](/slides/LT_podcast/images/4.jpg)

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

![blur bg cover opacity:.3](/slides/LT_podcast/images/7.jpg)

---

# システム開発の落とし穴

ユーザが思ってたのと違うシステムが出来る

<div class="columns">

<div style="flex: 7; text-align:center">

![height:480px](/slides/LT_langgraph10/images/sfig2.jpg)

</div>

<div style="flex: 5; text-align:center">

![height:400px center](/slides/LT_langgraph10/images/510580.png)
顧客が本当に必要だったもの

</div>

</div>

---

# 顧客が本当に必要だったもの

そもそも、まず要件定義をした？

![height:440px](/slides/LT_langgraph10/images/システム開発V字モデル.png)
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

![height:440px](/slides/LT_langgraph10/images/クレーム.jpg)

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

![height:440px](/slides/LT_langgraph10/images/クレーム.jpg)

</div>

</div>


---

# 顧客が本当に必要だったもの

実際に使うユーザのユースケースに落として、
何が出来るかイメージ出来るとこまで落として確認した？

<div class="columns">

<div style="flex: 4; text-align:right">

![height:440px center](/slides/LT_langgraph10/images/511609.png)

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

![height:400px center](/slides/LT_langgraph10/images/510580.png)

顧客が本当に必要だったもの
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

![height:400px](/slides/LT_langgraph10/images/12.jpg)

</div>

</div>


---

<!-- _class: end -->

# 続きは輪読会で！

<br/>
<br/>
<div style="text-align:center">

参加申し込みはこちらから
https://acesinc.connpass.com/event/350397/

</div>
