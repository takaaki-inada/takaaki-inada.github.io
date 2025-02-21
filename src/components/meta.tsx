import Head from "next/head";

type MetaProps = {
  title?: string | null;
  description?: string | null;
};

export const Meta = ({ title, description }: MetaProps) => {
  const defaultTitle = "株式会社ずんだもんAI放送局";
  const defaultDescription =
    "あなたも番組に参加して気分はコメンテーター！？<br/>配信ネタに困っているVTuberさんもネタを提供してくれてコメントするだけで良い最終兵器として大助かり！<br/>Webブラウザだけでずんだもんとの会話を、マイクやテキスト入力、音声合成を用いて楽しめます。";
  const imageUrl = "https://zund-arm-on.com/images/zund_arm_on_100_notice.png";

  return (
    <Head>
      <title>{title || defaultTitle}</title>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="description" content={description || defaultDescription} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={imageUrl} />
    </Head>
  );
};
