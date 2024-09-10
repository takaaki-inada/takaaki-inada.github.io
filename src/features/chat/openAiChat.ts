import { createOpenAI } from "@ai-sdk/openai";
import { CoreMessage, generateText, streamText } from "ai";
import { Message } from "../messages/messages";

export async function getChatResponse(messages: Message[], apiKey: string) {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const openai = createOpenAI({ apiKey: apiKey });

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    messages: messages as CoreMessage[],
  });

  return { message: text };
}

export async function getChatAIResponseStream(
  messages: Message[],
  apiKey: string
) {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const openai = createOpenAI({ apiKey: apiKey });

  try {
    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: messages as CoreMessage[],
    })

    // return result.toDataStreamResponse()

    return new ReadableStream({
      async start(controller) {
        const response = await result.toDataStreamResponse()
        if (!response.body) {
          throw new Error(
            `API response is empty, status ${response.status}`
          )
        }
  
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''
  
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
  
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''
  
            for (const line of lines) {
              if (line.startsWith('0:')) {
                const content = line.substring(2).trim()
                const decodedContent = JSON.parse(content)
                controller.enqueue(decodedContent)
              }
            }
          }
        } catch (error) {
          controller.error(error)
        } finally {
          controller.close()
          reader.releaseLock()
        }
      },
    })
  } catch (error) {
    console.error('Error in OpenAI API call:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function getChatResponseStream(
  messages: Message[],
  apiKey: string
) {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
  // const res = await fetch("http://127.0.0.1:8000/v1/chat/completions", {
    headers: headers,
    method: "POST",
    body: JSON.stringify({
      // model: "gpt-3.5-turbo",
      // model: "mistral-instruct-7b",
      // model: "llava",
      // model: "youri-7b-chat",
      // model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
      model: "gpt-4o-mini",
      messages: messages,
      stream: true,
      max_tokens: 200,
    }),
  });

  const reader = res.body?.getReader();
  if (res.status !== 200 || !reader) {
    throw new Error("Something went wrong");
  }

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder("utf-8");
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const data = decoder.decode(value);
          const chunks = data
            .split("data:")
            .filter((val) => !!val && val.trim() !== "[DONE]");
          for (const chunk of chunks) {
            const json = JSON.parse(chunk);
            const messagePiece = json.choices[0].delta.content;
            if (!!messagePiece) {
              controller.enqueue(messagePiece);
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return stream;
}
