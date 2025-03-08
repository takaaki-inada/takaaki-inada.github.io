import homeStore from "@/features/stores/home";
import settingsStore from "@/features/stores/settings";
import React, { useCallback } from "react";
import { IconButton } from "./iconButton";
import { Link } from "./link";
import Character from "./setting/character";
import { TextButton } from "./textButton";

type Props = {
  openAiKey: string;
  systemPrompt: string;
  onClickClose: () => void;
  onChangeAiKey: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeSystemPrompt: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClickOpenVrmFile: () => void;
  onClickResetSystemPrompt: () => void;
};
export const Settings = ({
  openAiKey,
  systemPrompt,
  onClickClose,
  onChangeSystemPrompt,
  onChangeAiKey,
  onClickOpenVrmFile,
  onClickResetSystemPrompt,
}: Props) => {
  const chatLog = homeStore((s) => s.chatLog)
  const characterName = settingsStore((s) => s.characterName)
  const guestName = settingsStore((s) => s.guestName)
  const useVoicevox = settingsStore((s) => s.useVoicevox)
  const welcomeTourDone = homeStore((s) => s.welcomeTourDone)
  const settingTourDone = homeStore((s) => s.settingTourDone)
  
  const handleTourModeChange = useCallback((newMode: boolean) => {
    homeStore.setState({
      welcomeTourDone: newMode,
      settingTourDone: newMode,
    })
  }, [])

  return (
    <div className="absolute z-40 w-full h-full bg-white/80 backdrop-blur ">
      <div className="absolute m-24">
        <IconButton
          iconName="24/Close"
          isProcessing={false}
          onClick={onClickClose}
        ></IconButton>
      </div>
      <div className="max-h-full overflow-auto">
        <div className="text-text1 max-w-3xl mx-auto px-24 py-64 ">
          <div className="my-24 typography-32 font-bold">設定</div>

          <div className="my-40">
            <Character />
          </div>

          <div className="my-24">
            <div className="my-16 typography-20 font-bold">OpenAI API キー</div>
            <input
              className="text-ellipsis px-16 py-8 w-col-span-2 bg-surface1 hover:bg-surface1-hover rounded-8"
              type="text"
              placeholder="sk-..."
              value={openAiKey}
              onChange={onChangeAiKey}
            />
            <div>
              APIキーは
              <Link
                url="https://platform.openai.com/account/api-keys"
                label="OpenAIのサイト"
              />
              で取得できます。取得したAPIキーをフォームに入力してください。
            </div>
            <div className="my-16">
              ChatGPT
              APIはブラウザから直接アクセスしていて安全のためAPIキーはローカルセッションでのみ保持しており、ストレージやサーバには一切保存されずブラウザを閉じると消失します。また会話内容もローカルPCのみに保持しておりChatGPTとの通信以外では利用されません。
              <br />
              ※利用しているモデルはChatGPT API (GPT-4o-mini)です。
            </div>
          </div>
          {/* <div className="my-40">
            <div className="my-16 typography-20 font-bold">
              キャラクターモデル
            </div>
            <div className="my-8">
              <TextButton onClick={onClickOpenVrmFile}>VRMを開く</TextButton>
            </div>
          </div> */}
          {/* <div className="my-40">
            <div className="my-8">
              <div className="my-16 typography-20 font-bold">
                キャラクター設定（システムプロンプト）
              </div>
              <TextButton onClick={onClickResetSystemPrompt}>
                キャラクター設定リセット
              </TextButton>
            </div>

            <textarea
              value={systemPrompt}
              onChange={onChangeSystemPrompt}
              className="px-16 py-8  bg-surface1 hover:bg-surface1-hover h-168 rounded-8 w-full"
            ></textarea>
          </div> */}
          <div className="my-8">
            <div className="my-16 typography-20 font-bold">チャットVoice再生にVoicevoxを使う</div>
            <TextButton
              onClick={() => {
                settingsStore.setState({ useVoicevox: !useVoicevox })
                homeStore.setState({ welcomeTourDone: useVoicevox })
              }}
            >
              {useVoicevox ? 'On' : 'Off'}
            </TextButton>
            <div>一度画面をリロードしツアーに従い設定して下さい</div>
          </div>
          <div className="my-8">
            <div className="my-16 typography-20 font-bold">Tour Mode</div>
            <TextButton
              onClick={() => {
                handleTourModeChange(!welcomeTourDone)
              }}
            >
              {welcomeTourDone ? 'Tour Off' : 'Tour On'}
            </TextButton>
            <div>もう一度ツアーを見たい場合はOnにして画面をリロードして下さい</div>
          </div>
          {chatLog.length > 0 && (
            <div className="my-40">
              <div className="my-8 grid-cols-2">
                <div className="my-16 typography-20 font-bold">会話履歴</div>
                <TextButton onClick={() => { homeStore.setState({ chatLog: [] }) } }>
                  会話履歴リセット
                </TextButton>
              </div>

              {chatLog.length > 0 && (
                <div className="my-8">
                  {chatLog.map((value, index) => {
                    return (
                      <div
                        key={index}
                        className="my-8 grid grid-flow-col  grid-cols-[min-content_1fr] gap-x-fixed"
                      >
                        <div className="w-[64px] py-8">
                          {value.role === 'assistant' ? `${characterName}` : `${guestName}`}
                        </div>
                        <input
                          key={index}
                          className="bg-surface1 hover:bg-surface1-hover rounded-8 w-full px-16 py-8"
                          type="text"
                          value={value.content}
                          onChange={(e) => {
                            handleChangeChatLog(index, e.target.value)
                          }}
                        ></input>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const handleChangeChatLog = (targetIndex: number, text: string) => {
  const hs = homeStore.getState()

  const newChatLog = hs.chatLog.map((m, i) => {
    return i === targetIndex ? { role: m.role, content: text } : m
  })

  homeStore.setState({ chatLog: newChatLog })
}
