import Head from "next/head";
export const Meta = () => {
  const title = "ChatVRM";
  const description =
    "Webブラウザだけで3Dキャラクターとの会話を、マイクやテキスト入力、音声合成を用いて楽しめます。";
  // TODO: ogp画像を用意して、URLを指定する
  const imageUrl = "https://zund-arm-on.com//images/zundarmon_artwork_3000_2.jpg";
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};
