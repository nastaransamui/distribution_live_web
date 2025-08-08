import { ChatDataType } from "../../../@types/cattypes";


const sortLatestMessage: (userChatData: ChatDataType[]) => ChatDataType[] = (userChatData) => {
  return [...userChatData].sort((a, b) => {
    let lastMessageA = a?.messages?.length
      ? a.messages.reduce((latest, msg) => (msg.timestamp > latest.timestamp ? msg : latest), a.messages[0])
      : null;

    let lastMessageB = b?.messages?.length
      ? b.messages.reduce((latest, msg) => (msg.timestamp > latest.timestamp ? msg : latest), b.messages[0])
      : null;

    return (lastMessageB?.timestamp || 0) - (lastMessageA?.timestamp || 0);
  });
};

export default sortLatestMessage;