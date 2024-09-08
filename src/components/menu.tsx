import { Message } from "@/features/messages/messages";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChatLog } from "./chatLog";
import { IconButton } from "./iconButton";
import { Settings } from "./settings";
// import { AssistantText } from "./assistantTextBlack";
// import { AssistantText } from "./assistantText";
import homeStore from "@/features/stores/home";
import slideStore from "@/features/stores/slide";
import Slides from "./slides";

type Props = {
  openAiKey: string;
  systemPrompt: string;
  chatLog: Message[];
  assistantMessage: string;
  onChangeSystemPrompt: (systemPrompt: string) => void;
  onChangeAiKey: (key: string) => void;
  onChangeChatLog: (index: number, text: string) => void;
  handleClickResetChatLog: () => void;
  handleClickResetSystemPrompt: () => void;
};
export const Menu = ({
  openAiKey,
  systemPrompt,
  chatLog,
  assistantMessage,
  onChangeSystemPrompt,
  onChangeAiKey,
  onChangeChatLog,
  handleClickResetChatLog,
  handleClickResetSystemPrompt,
}: Props) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showChatLog, setShowChatLog] = useState(false);
  // const { viewer } = useContext(ViewerContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { viewer } = homeStore.getState()

  const selectedSlideDocs = slideStore((state) => state.selectedSlideDocs)
  const [markdownContent, setMarkdownContent] = useState('');

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
      {showChatLog && <ChatLog messages={chatLog} />}
      <div className="relative">
        <Slides markdown={markdownContent} />
      </div>
      {showSettings && (
        <Settings
          openAiKey={openAiKey}
          chatLog={chatLog}
          systemPrompt={systemPrompt}
          onClickClose={() => setShowSettings(false)}
          onChangeAiKey={handleAiKeyChange}
          onChangeSystemPrompt={handleChangeSystemPrompt}
          onChangeChatLog={onChangeChatLog}
          onClickOpenVrmFile={handleClickOpenVrmFile}
          onClickResetChatLog={handleClickResetChatLog}
          onClickResetSystemPrompt={handleClickResetSystemPrompt}
        />
      )}
      {/* {!showChatLog && assistantMessage && (
        <AssistantText message={assistantMessage} />
      )} */}
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
