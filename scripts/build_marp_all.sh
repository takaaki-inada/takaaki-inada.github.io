#!/bin/bash

# public/slides直下のディレクトリの一覧を取得し、それぞれのディレクトリに対してmarpコマンドを実行する
for dir in `ls public/slides`; do
  # public/slides/$dir/slides.mdが存在しない場合はスキップ
  if [ ! -e public/slides/$dir/slides.md ]; then
    continue
  fi
  marp --html --no-stdin public/slides/$dir/slides.md --theme public/slides/$dir/theme.css -o public/slides/$dir/index.html
  # index.htmlの中身のtwitter:cardの値をsummary_large_imageに変更する
  sed -i -e 's/twitter:card" content="summary">/twitter:card" content="summary_large_image"><meta name="twitter:title" content="XXX">/g' public/slides/$dir/index.html
done
