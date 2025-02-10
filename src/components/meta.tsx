import Head from "next/head";
export const Meta = () => {
  const title = "株式会社ずんだもんAI放送局まもなく放送100回記念！";
  const description =
    "あなたも番組に参加して気分はコメンテーター！？<br/>配信ネタに困っているVTuberさんもネタを提供してくれてコメントするだけで良い最終兵器として大助かり！<br/>Webブラウザだけでずんだもんとの会話を、マイクやテキスト入力、音声合成を用いて楽しめます。";
  const imageUrl = "https://zund-arm-on.com/images/zund_arm_on_100_notice.png";
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
    </Head>
  );
};
