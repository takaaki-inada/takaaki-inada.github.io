import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChatLog } from "./chatLog";
import { IconButton } from "./iconButton";
import { Settings } from "./settings";
// import { AssistantText } from "./assistantTextBlack";
// import { AssistantText } from "./assistantText";
import homeStore from "@/features/stores/home";
import settingsStore from "@/features/stores/settings";
import slideStore from "@/features/stores/slide";
import { AssistantText } from "./assistantText";
import Slides from "./slides";

type Props = {
  openAiKey: string;
  systemPrompt: string;
  assistantMessage: string;
  onChangeSystemPrompt: (systemPrompt: string) => void;
  onChangeAiKey: (key: string) => void;
  handleClickResetSystemPrompt: () => void;
};
export const Menu = ({
  openAiKey,
  systemPrompt,
  assistantMessage,
  onChangeSystemPrompt,
  onChangeAiKey,
  handleClickResetSystemPrompt,
}: Props) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showChatLog, setShowChatLog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { viewer } = homeStore.getState()

  const chatLog = homeStore((s) => s.chatLog)
  const selectedSlideDocs = slideStore((state) => state.selectedSlideDocs)
  const [markdownContent, setMarkdownContent] = useState('');
  const useVoicevox = settingsStore((s) => s.useVoicevox)
  const isGuestTurn = slideStore((state) => state.isGuestTurn)

  useEffect(() => {
    if (!selectedSlideDocs) return

    fetch(`/slides/${selectedSlideDocs}/slides.md`)
      .then((response) => response.text())
      .then((text) => setMarkdownContent(text))
      .catch((error) =>
        console.error('Failed to fetch markdown content:', error)
      )
  }, [selectedSlideDocs])

  const handleChangeSystemPrompt = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeSystemPrompt(event.target.value);
    },
    [onChangeSystemPrompt]
  );

  const handleAiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiKey(event.target.value);
    },
    [onChangeAiKey]
  );

  const handleClickOpenVrmFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChangeVrmFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const file = files[0];
      if (!file) return;

      const file_type = file.name.split(".").pop();

      if (file_type === "vrm") {
        const blob = new Blob([file], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        viewer.loadVrm(url);
      }

      event.target.value = "";
    },
    [viewer]
  );

  return (
    <>
      <div className="absolute z-10 m-24">
        <div className="grid grid-flow-col gap-[8px]">
          <IconButton
            iconName="24/Menu"
            label="設定"
            isProcessing={false}
            onClick={() => setShowSettings(true)}
            className="menu-setting"
          ></IconButton>
          {showChatLog ? (
            <IconButton
              iconName="24/CommentOutline"
              label="会話ログ"
              isProcessing={false}
              onClick={() => setShowChatLog(false)}
            />
          ) : (
            <IconButton
              iconName="24/CommentFill"
              label="会話ログ"
              isProcessing={false}
              disabled={chatLog.length <= 0}
              onClick={() => setShowChatLog(true)}
            />
          )}
        </div>
      </div>
      {showChatLog && <ChatLog />}
      <div className="relative">
        <Slides markdown={markdownContent} />
      </div>
      {showSettings && (
        <Settings
          openAiKey={openAiKey}
          systemPrompt={systemPrompt}
          onClickClose={() => setShowSettings(false)}
          onChangeAiKey={handleAiKeyChange}
          onChangeSystemPrompt={handleChangeSystemPrompt}
          onClickOpenVrmFile={handleClickOpenVrmFile}
          onClickResetSystemPrompt={handleClickResetSystemPrompt}
        />
      )}
      {
        /* NOTE: AssistantTextではなくprocessReceivedMessageを使うようにしたい */
        !showChatLog && assistantMessage && !useVoicevox && isGuestTurn && (
        <AssistantText message={assistantMessage} />
      )}
      <input
        type="file"
        className="hidden"
        accept=".vrm"
        ref={fileInputRef}
        onChange={handleChangeVrmFile}
      />
    </>
  );
};
