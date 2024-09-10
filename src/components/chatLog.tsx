import homeStore from "@/features/stores/home";
import settingsStore from "@/features/stores/settings";
import { useEffect, useRef } from "react";
export const ChatLog = () => {
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const messages = homeStore((s) => s.chatLog)

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "auto",
      block: "center",
    });
  }, []);

  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [messages]);
  return (
    <div className="absolute w-col-span-6 max-w-full h-[100svh] pb-64">
      <div className="absolute z-5 max-h-full px-16 pt-104 pb-64 overflow-y-auto scroll-hidden">
        {messages.map((msg, i) => {
          return (
            <div key={i} ref={messages.length - 1 === i ? chatScrollRef : null}>
              <Chat role={msg.role} message={msg.content} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Chat = ({ role, message }: { role: string; message: string }) => {
  const characterName = settingsStore((s) => s.characterName)
  const guestName = settingsStore((s) => s.guestName)
  const roleColor =
    role === "assistant" ? "bg-secondary text-white " : "bg-base text-primary";
  const roleText = role === "assistant" ? "text-secondary" : "text-primary";
  const offsetX = role === "user" ? "pl-40" : "pr-40";

  return (
    <div className={`mx-auto max-w-sm my-16 ${offsetX}`}>
      <div
        className={`px-24 py-8 rounded-t-8 font-bold tracking-wider ${roleColor}`}
      >
        {role === "assistant" ? `${characterName}` : `${guestName}`}
      </div>
      <div className="px-24 py-16 bg-white rounded-b-8">
        <div className={`typography-16 font-bold ${roleText}`}>{message}</div>
      </div>
    </div>
  );
};
