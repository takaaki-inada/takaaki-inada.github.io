import { wait } from "@/utils/wait";
import homeStore from "../stores/home";
import { Screenplay } from "./messages";

const createSpeakCharacterWav = () => {
    let lastTime = 0;
    let prevFetchPromise: Promise<unknown> = Promise.resolve();
    let prevSpeakPromise: Promise<unknown> = Promise.resolve();
  
    return (
      url: string,
      onStart?: () => void,
      onComplete?: () => void
    ) => {
      const { viewer } = homeStore.getState()
      onStart?.()
  
      // 英単語を日本語で読み上げる
      const fetchPromise = prevFetchPromise.then(async () => {
        const now = Date.now();
        if (now - lastTime < 1000) {
          await wait(1000 - (now - lastTime));
        }
  
        const res = await fetch(url);
        const buffer = await res.arrayBuffer();
        lastTime = Date.now();
        return buffer;
      });
  
      prevFetchPromise = fetchPromise;
      prevSpeakPromise = Promise.all([fetchPromise, prevSpeakPromise]).then(
        ([audioBuffer]) => {
          // onStart?.();
          if (!audioBuffer) {
            return;
          }
          // 使わないので何でも良い
          const screenplay: Screenplay = {
            talk: {
              message: "test",
              style: "happy",
              speakerX: 0,
              speakerY: 0,
            },
            expression: "neutral",
          };
          return viewer.model?.speak(audioBuffer, screenplay);
        }
      );
      prevSpeakPromise.then(() => {
        onComplete?.();
        // 発話後はニュートラルに戻す
        viewer.model?.emoteController?.playEmotion("neutral");
      });
    };
  };
  
  export const speakCharacterWav = createSpeakCharacterWav();
