export const AssistantText = ({ message }: { message: string }) => {
  return (
    <div className="absolute bottom-104 left-0 -mb-24 px-8 h-104 w-full bg-black bg-opacity-80 text-white" style={{ fontSize: "36px" }}>
         {message.replace(/\[([a-zA-Z]*?)\]/g, "").substring(0, 120)}
         {!message && <div>　</div>}
    </div>
  );
};
