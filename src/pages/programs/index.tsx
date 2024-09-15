import { Menu } from "@/components/menu";
import VrmViewer from "@/components/vrmViewer";
import { getLocalStatusGPT4VResponseStream, resetLocalChat } from "@/features/chat/localLLMChat";
import { getChatAIResponseStream } from "@/features/chat/openAiChat";
import { SYSTEM_PROMPT, VISION_PROMPT } from "@/features/constants/systemPromptConstantsYouri";
import {
  Message,
  Screenplay,
  textsToScreenplay,
} from "@/features/messages/messages";
import { speakCharacter } from "@/features/messages/speakCharacter";
import { useCallback, useEffect, useState } from "react";
// import { GitHubLink } from "@/components/githubLink";
import { MessageInputContainer } from "@/components/messageInputContainer";
import { Meta } from "@/components/meta";
import { SlideText } from "@/components/slideText";
import homeStore from '@/features/stores/home';
import settingsStore from "@/features/stores/settings";
import slideStore from '@/features/stores/slide';
import { buildUrl } from "@/utils/buildUrl";

export default function Home() {
  const slidePlaying = slideStore((s) => s.isPlaying)
  const chatProcessingCount = homeStore((s) => s.chatProcessingCount)
  const isGuestTurn = slideStore((s) => s.isGuestTurn)
  const currentContext = slideStore((s) => s.currentContext)
  const guestName = settingsStore((s) => s.guestName)

  const { viewer } = homeStore.getState()

  const [systemPrompt, setSystemPrompt] = useState(SYSTEM_PROMPT);
  const [openAiKey, setOpenAiKey] = useState("");
  const [chatProcessing, setChatProcessing] = useState(false);
  const [chatSpeaking, setChatSpeaking] = useState(false);
  const [micRecording, setSpeechRecognizing] = useState(false);
  const [latestStatusLog, setLatestStatusLog]  = useState<string | null>(null);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [getStatusTimerId, setGetStatusTimerId] = useState<any | null>(null);
  const [autoStatusPolling, setAutoStatusPolling] = useState(false);

  useEffect(() => {
  // system promptはここで保存しないように変更
  // if (window.localStorage.getItem("chatVRMParams")) {
  //     const params = JSON.parse(
  //       window.localStorage.getItem("chatVRMParams") as string
  //     );
  //     setSystemPrompt(params.systemPrompt);
  //     homeStore.setState({ chatLog: params.chatLog })
  //   }
    if (!slideStore.getState().selectedSlideDocs) {
      console.log('set default slide.')
      slideStore.setState({ selectedSlideDocs: '20240911' })
    }
  }, []);

  // system promptはここで保存しないように変更
  // useEffect(() => {
  //   process.nextTick(() =>
  //     window.localStorage.setItem(
  //       "chatVRMParams",
  //       JSON.stringify({ systemPrompt, chatLog })
  //     )
  //   );
  // }, [systemPrompt, chatLog]);

  // useEffect(() => {
  //   console.log('chatProcessingCount:', chatProcessingCount)
  // }, [chatProcessingCount])

  /**
   * 文ごとに音声を直列でリクエストしながら再生する
   */
  const handleSpeakAi = useCallback(
    async (
      screenplay: Screenplay,
      onStart?: () => void,
      // NOTE: このOnEndはStreamの個別の音声再生が終わった時で全部の音声再生が終わった時ではないので注意
      onEnd?: () => void
    ) => {
      speakCharacter(screenplay, onStart, onEnd);
    },
    [viewer]
  );

  /**
   * アシスタントとの会話を行う
   */
  const handleSendChat = useCallback(
    async (text: string) => {

      if (!openAiKey) {
        // setAssistantMessage("APIキーが入力されていません");
        alert("APIキーが入力されていません");
        // TODO: tutorialを表示
        // homeStore.setState({settingTourDone: false })
        return;
      }

      const newMessage = text;

      if (newMessage == null) return;

      const hs = homeStore.getState()

      setChatProcessing(true);
      setChatSpeaking(true);
      // ユーザーの発言を追加して表示
      const messageLog: Message[] = [
        ...hs.chatLog,
        { role: "user", content: newMessage },
      ];
      homeStore.setState({ chatLog: messageLog })

      // Chat GPTへ
      const messages: Message[] = [
        {
          role: "system",
          content: systemPrompt.replace(/\{CONTEXT\}/g, currentContext).replace(/\{GUEST_NAME\}/g, guestName),
        },
        ...messageLog,
      ];
      // console.log('messages:', messages)

      var stream = null;
      let aiTextLog = "";
      if (newMessage.indexOf('実況') !== -1) {
        const statusQueryMessages: Message[] = [
          {
            role: "user",
            content: "それでは、ゲーム実況してください",
          },
        ];
        const messages: Message[] = [
          {
            role: "system",
            content: VISION_PROMPT,
          },
          ...statusQueryMessages,
        ];
        stream = await getLocalStatusGPT4VResponseStream(messages, openAiKey).catch(
            (e) => {
            console.error(e);
            return null;
          }
        );
        // 実況アクション
        const aiText = '実況するのだ！';
        const aiTalks = textsToScreenplay([aiText]);
        aiTextLog += aiText;  // ログの表示は汚くなるけど、表情を会話で継続的に出力するためには仕方ない
        handleSpeakAi(aiTalks[0], () => { setAssistantMessage(aiText);}, () => {});
        viewer.moveCamera(-1.2, 0, 0);
        viewer.loadVrma(buildUrl("/TaiSp03_Tatsumaki.vrma"));
      } else {
        // stream = await getLocalChatResponseStream(newMessage).catch(
        // stream = await getChatResponseStream(messages, openAiKey).catch(
        //   (e) => {
        //   console.error(e);
        //   return null;
        // }
        try {
          stream = await getChatAIResponseStream(messages, openAiKey)
        } catch (e) {
          console.error(e)
          stream = null
        }
      }
      if (stream == null) {
        setChatProcessing(false);
        return;
      }

      const reader = (stream as ReadableStream<any>).getReader();
      let receivedMessage = "";
      let tag = "";
      const sentences = new Array<string>();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          receivedMessage += value;

          // 返答内容のタグ部分の検出
          const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
          if (tagMatch && tagMatch[0]) {
            tag = tagMatch[0];
            receivedMessage = receivedMessage.slice(tag.length);
          }

          // 返答を一文単位で切り出して処理する
          const sentenceMatch = receivedMessage.match(
            /^(.+[。．！？\n]|.{10,}[、,])/
          );
          if (sentenceMatch && sentenceMatch[0]) {
            const sentence = sentenceMatch[0];
            sentences.push(sentence);
            receivedMessage = receivedMessage
              .slice(sentence.length)
              .trimStart();

            // 発話不要/不可能な文字列だった場合はスキップ
            if (
              !sentence.replace(
                /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
                ""
              )
            ) {
              continue;
            }

            const aiText = `${tag} ${sentence}`;
            const aiTalks = textsToScreenplay([aiText]);
            aiTextLog += aiText;  // ログの表示は汚くなるけど、表情を会話で継続的に出力するためには仕方ない

            // リラックス表情アクション
            if (aiTalks[0].expression === 'relaxed') {
              viewer.loadFbx(buildUrl("/Samba Dancing.fbx"));
            }

            // 文ごとに音声を生成 & 再生、返答を表示
            const currentAssistantMessage = sentences.join(" ");
            handleSpeakAi(aiTalks[0], () => {
                setAssistantMessage(currentAssistantMessage);
              }, () => {
                // console.log('getLocalChatResponseStream from handleSpeakAi.onEnd. chatProcessing: ' + chatProcessing)
                // ここでは個別のstreamの再生の終了の度に実行される。個別のstream再生が終わったらではなく、実際の音声再生が終わったらchatSpeakingをfalseにする
                // 実際の判定はsetChatSpeaking側で入っている
                setChatSpeaking(false);
              }
            );
          }
        }
      } catch (e) {
        setChatProcessing(false);
        setChatSpeaking(false);
        console.error(e);
      } finally {
        reader.releaseLock();
      }

      // アシスタントの返答をログに追加
      const messageLogAssistant: Message[] = [
        ...messageLog,
        { role: "assistant", content: aiTextLog },
      ];

      homeStore.setState({ chatLog: messageLogAssistant })
      setChatProcessing(false);
      if (autoStatusPolling) {
        startGetStatusTimer();
      }
    },
    [systemPrompt, handleSpeakAi, openAiKey, currentContext, guestName]
  );

  const startGetStatusTimer = () => {
    const timerId = setTimeout(() => {
      console.log("getStatusの時間になりました");
      setGetStatusTimerId(null);
      getStatusMessagegAsync();
    }, 14000 + Math.floor(Math.random() * 6000));
    setGetStatusTimerId(timerId);
  }

  const getStatusMessagegAsync = async () => {
    if (chatProcessing || chatSpeaking || micRecording) {
      return;
    }
    setChatProcessing(true);
    setChatSpeaking(true);
    const statusQueryMessages: Message[] = [
      {
        role: "user",
        content: "それでは、ゲーム実況してください",
      },
    ];
    const messages: Message[] = [
      {
        role: "system",
        content: VISION_PROMPT,
      },
      ...statusQueryMessages,
    ];
    // const stream = await getChatResponseStream(messages, openAiKey).catch(
    const stream = await getLocalStatusGPT4VResponseStream(
      messages,
      openAiKey
    ).catch(
        (e) => {
        console.error(e);
        return null;
      }
    );
    if (stream == null) {
      setChatProcessing(false);
      setChatSpeaking(false);
      return;
    }

    const reader = stream.getReader();
    let receivedMessage = "";
    let aiTextLog = "";
    let tag = "";
    const sentences = new Array<string>();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          // FIXME: まだサーバが応答文を返しているのに終了してしまう場合がある
          // console.log('read getLocalChatStatusResponseStream done.');
          break;
        }

        receivedMessage += value;

        // 返答内容のタグ部分の検出
        const tagMatch = receivedMessage.match(/^\[(.*?)\]/);
        if (tagMatch && tagMatch[0]) {
          tag = tagMatch[0];
          receivedMessage = receivedMessage.slice(tag.length);
        }

        // 返答を一文単位で切り出して処理する
        const sentenceMatch = receivedMessage.match(
          /^(.+[。．！？\n]|.{10,}[、,])/
        );
        if (sentenceMatch && sentenceMatch[0]) {
          const sentence = sentenceMatch[0];
          sentences.push(sentence);
          receivedMessage = receivedMessage
            .slice(sentence.length)
            .trimStart();

          // 発話不要/不可能な文字列だった場合はスキップ
          const sanitizedSentence = sentence.replace(
            /^[\s\[\(\{「［（【『〈《〔｛«‹〘〚〛〙›»〕》〉』】）］」\}\)\]]+$/g,
            ""
          );
          if (
            !sanitizedSentence
          ) {
            console.log('skip:' + sanitizedSentence)
            continue;
          }

          const aiText = `${tag} ${sentence}`;
          const aiTalks = textsToScreenplay([aiText]);
          aiTextLog += aiText;  // ログの表示は汚くなるけど、表情を会話で継続的に出力するためには仕方ない

          // 文ごとに音声を生成 & 再生、返答を表示
          const currentAssistantMessage = sentences.join(" ");
          handleSpeakAi(aiTalks[0], () => {
              // setAssistantMessage(currentAssistantMessage);
              setAssistantMessage(sentence);
            }, () => {
              // console.log('getLocalChatStatusResponseStream from handleSpeakAi.onEnd. chatProcessing: ' + chatProcessing)
              // ここでは個別のstreamの再生の終了の度に実行される。個別のstream再生が終わったらではなく、実際の音声再生が終わったらchatSpeakingをfalseにする
              // 実際の判定はsetChatSpeaking側で入っている
              setChatSpeaking(false);
            }
          );
        }
      }
    } catch (e) {
      setChatProcessing(false);
      setChatSpeaking(false);
      console.error(e);
    } finally {
      reader.releaseLock();
    }

    // アシスタントの返答をログに追加
     const chatLog = homeStore((s) => s.chatLog)
     const messageLogAssistant: Message[] = [
      ...chatLog,
      { role: "assistant", content: aiTextLog },
    ];

    homeStore.setState({ chatLog: messageLogAssistant })
    setLatestStatusLog(aiTextLog);
    setChatProcessing(false);
    if (autoStatusPolling) {
      startGetStatusTimer();
    }
  }

  const handleCamera = useCallback(
    async () => {
      getStatusMessagegAsync();
    },
    [systemPrompt, handleSpeakAi, openAiKey, getStatusTimerId, chatProcessing, chatSpeaking]
  )

  const resetGetStatusTimerId = useCallback(
    () => {
      // 既存のタイマーがあればキャンセル
      if (getStatusTimerId !== null) {
        console.log("getStatusタイマーをキャンセルしました！");
        clearTimeout(getStatusTimerId);
        setGetStatusTimerId(null);
      }
    },
    [getStatusTimerId]
  )

  const handleReload = useCallback(
    () => {
      homeStore.setState({ chatLog: [] })
      setLatestStatusLog(null);
      setSystemPrompt(SYSTEM_PROMPT);
      resetLocalChat();
    },
    [getStatusTimerId]
  )

  return (
    <div className={"font-M_PLUS_2"}>
      <Meta />
      {/* <Introduction
        openAiKey={openAiKey}
        onChangeAiKey={setOpenAiKey}
      /> */}
      <VrmViewer />
      {
        (!isGuestTurn && (slidePlaying || chatProcessingCount !== 0)) ? (
          <SlideText />
        ) : (
          <MessageInputContainer
            isChatProcessing={chatProcessing}
            onChatProcessStart={handleSendChat}
            isMicRecording={micRecording}
            setIsMicRecording={setSpeechRecognizing}
            getStatusTimerId={getStatusTimerId}
            resetGetStatusTimerId={resetGetStatusTimerId}
            onCameraProcessStart={handleCamera}
            onReloadProcessStart={handleReload}
          />
        )
      }
      <Menu
        openAiKey={openAiKey}
        systemPrompt={systemPrompt}
        assistantMessage={assistantMessage}
        onChangeAiKey={setOpenAiKey}
        onChangeSystemPrompt={setSystemPrompt}
        handleClickResetSystemPrompt={() => setSystemPrompt(SYSTEM_PROMPT)}
      />
    </div>
  );
}
