import { wait } from "@/utils/wait";
// import { synthesizeVoiceApi } from "./synthesizeVoice";
import englishToJapanese from '@/utils/englishToJapanese.json';
import homeStore from "../stores/home";
import settingsStore from "../stores/settings";
import { Screenplay, Talk } from "./messages";
import { synthesizeVoice } from "./synthesizeVoice";

interface EnglishToJapanese {
  [key: string]: string
}

const VOICE_VOX_API_URL =
  process.env.NEXT_PUBLIC_VOICE_VOX_API_URL || 'http://127.0.0.1:50021'
  const typedEnglishToJapanese = englishToJapanese as EnglishToJapanese

const createSpeakCharacter = () => {
  let lastTime = 0;
  let prevFetchPromise: Promise<unknown> = Promise.resolve();
  let prevSpeakPromise: Promise<unknown> = Promise.resolve();

  return (
    screenplay: Screenplay,
    // viewer: Viewer,
    // koeiroApiKey: string,
    onStart?: () => void,
    onComplete?: () => void
  ) => {
    const ss = settingsStore.getState()
    const { viewer } = homeStore.getState()
    onStart?.()

    // 英単語を日本語で読み上げる
    screenplay.talk.message = convertEnglishToJapaneseReading(
      screenplay.talk.message
    )

    const fetchPromise = prevFetchPromise.then(async () => {
      const now = Date.now();
      if (now - lastTime < 1000) {
        await wait(1000 - (now - lastTime));
      }

      const buffer = await fetchAudioVoiceVox(
        screenplay.talk,
        ss.voicevoxSpeaker,
        ss.voicevoxSpeed,
        ss.voicevoxPitch,
        ss.voicevoxIntonation
      ).catch(
        () => null
      );
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

export const speakCharacter = createSpeakCharacter();

export const fetchAudio = async (
  talk: Talk,
  apiKey: string
): Promise<ArrayBuffer> => {
  const ttsVoice = await synthesizeVoice(
    talk.message,
    talk.speakerX,
    talk.speakerY,
    talk.style,
    // apiKey
  );
  const url = ttsVoice.audio;

  if (url == null) {
    throw new Error("Something went wrong");
  }

  const resAudio = await fetch(url);
  const buffer = await resAudio.arrayBuffer();
  return buffer;
};

function convertEnglishToJapaneseReading(text: string): string {
  const sortedKeys = Object.keys(typedEnglishToJapanese).sort(
    (a, b) => b.length - a.length
  )

  return sortedKeys.reduce((result, englishWord) => {
    const japaneseReading = typedEnglishToJapanese[englishWord]
    const regex = new RegExp(`\\b${englishWord}\\b`, 'gi')
    return result.replace(regex, japaneseReading)
  }, text)
}

export const fetchAudioVoiceVox = async (
  talk: Talk,
  speaker: string,
  speed: number,
  pitch: number,
  intonation: number
): Promise<ArrayBuffer> => {
  // console.log('speakerId:', speaker)
  const ttsQueryResponse = await fetch(
    VOICE_VOX_API_URL +
      '/audio_query?speaker=' +
      speaker +
      '&text=' +
      encodeURIComponent(talk.message),
    {
      method: 'POST',
    }
  )
  if (!ttsQueryResponse.ok) {
    throw new Error('Failed to fetch TTS query.')
  }
  const ttsQueryJson = await ttsQueryResponse.json()

  ttsQueryJson['speedScale'] = speed
  ttsQueryJson['pitchScale'] = pitch
  ttsQueryJson['intonationScale'] = intonation
  const synthesisResponse = await fetch(
    VOICE_VOX_API_URL + '/synthesis?speaker=' + speaker,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked',
      },
      body: JSON.stringify(ttsQueryJson),
    }
  )
  if (!synthesisResponse.ok) {
    throw new Error('Failed to fetch TTS synthesis result.')
  }
  const blob = await synthesisResponse.blob()
  const buffer = await blob.arrayBuffer()
  return buffer
}
