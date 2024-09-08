import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const apiKey = req.body.apiKey || process.env.OPEN_AI_KEY;

  if (!apiKey) {
    res
      .status(400)
      .json({ message: "APIキーが間違っているか、設定されていません。" });

    return;
  }

  const openai = createOpenAI({ apiKey: apiKey });

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    messages: req.body.messages,
  });

  res.status(200).json({ message: text });
}
