import { Message } from "../messages/messages";

export async function getLocalChatResponseStream(
  text: string,
) {

  // const res = await fetch('http://localhost:8000/generate', {
  const res = await fetch('http://127.0.0.1:5001/v1/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'text': text,
      // https://developers.rinna.co.jp/ja-jp/pricing
      // 1文章、60文字
      'min_length': 6,
      'max_new_tokens': 32,
    }),
  })
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
          // const chunks = data
          //   .split("data:")
          //   .filter((val) => !!val && val.trim() !== "[DONE]");
          // for (const chunk of chunks) {
          //   const json = JSON.parse(chunk);
          //   const messagePiece = json.choices[0].delta.content;
          //   if (!!messagePiece) {
          //     controller.enqueue(messagePiece);
          //   }
          // }
          controller.enqueue(data);
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

export async function getLocalChatStatusResponseStream() {
  const res = await fetch('http://localhost:8000/status', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
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
          // const chunks = data
          //   .split("data:")
          //   .filter((val) => !!val && val.trim() !== "[DONE]");
          // for (const chunk of chunks) {
          //   const json = JSON.parse(chunk);
          //   const messagePiece = json.choices[0].delta.content;
          //   if (!!messagePiece) {
          //     controller.enqueue(messagePiece);
          //   }
          // }
          controller.enqueue(data);
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

export async function getLocalStatusGPT4VResponseStream(
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

  const res = await fetch('http://127.0.0.1:8000/status_gpt4v', {
    headers: headers,
    method: "POST",
    body: JSON.stringify({
      model: "", // "gpt-4-vision-preview",
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

export async function resetLocalChat() {
  const res = await fetch('http://localhost:8000/reset', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const reader = res.body?.getReader();
  if (res.status !== 200 || !reader) {
    throw new Error("Something went wrong");
  }
}
