import { ChatDataType, MessageType } from "../../../@types/chatTypes";

type OnCancelEditProps = {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>,
  currentRoom: ChatDataType | null,
  currentUserId: string | undefined,
  setEditChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>
}
const onCancelEdit = (
  {
    setIsEdit,
    currentRoom,
    currentUserId,
    setEditChatInputValue,
  }: OnCancelEditProps
) => {
  setIsEdit(false)
  const senderFcmTokens = currentRoom?.createrData.userId == currentUserId
    ? currentRoom?.createrData.fcmTokens!
    : currentRoom?.receiverData.fcmTokens!;
  setEditChatInputValue({
    senderId: currentUserId!,
    receiverId: '',
    senderFcmTokens: senderFcmTokens,
    receiverFcmTokens: [],
    timestamp: new Date().getTime(),
    message: null,
    read: false,
    attachment: [],
    calls: [],
    roomId: ''
  });
}

export default onCancelEdit;