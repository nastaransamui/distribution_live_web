import { ChatDataType, MessageType } from "../../../@types/cattypes";

type OnEditButtonClickProps = {
  editChatInputValue: MessageType,
  currentRoom: ChatDataType | null,
  currentUserId: string | undefined,
  currentRoomId: string | null,
  homeSocket: any,
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>,
  setEditChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>,
}

const onEditButtonClick = (
  {
    editChatInputValue,
    currentRoom,
    currentUserId,
    currentRoomId,
    homeSocket,
    setIsEdit,
    setEditChatInputValue,
  }: OnEditButtonClickProps
) => {
  if (
    (editChatInputValue.message == null || editChatInputValue.message.trim() === '') &&
    editChatInputValue.attachment.length == 0
  ) return;
  const receiverId = currentRoom?.createrData.userId === currentUserId
    ? currentRoom?.receiverData?.userId
    : currentRoom?.createrData?.userId;
  const senderFcmTokens = currentRoom?.createrData.userId == currentUserId
    ? currentRoom?.createrData.fcmTokens!
    : currentRoom?.receiverData.fcmTokens!;
  const receiverFcmTokens = currentRoom?.createrData.userId == currentUserId
    ? currentRoom?.receiverData.fcmTokens!
    : currentRoom?.createrData.fcmTokens!;
  const messageData: MessageType & { attachmentFiles: any[] } = {
    senderId: currentUserId!,
    receiverId: receiverId!,
    senderFcmTokens: senderFcmTokens,
    receiverFcmTokens: receiverFcmTokens,
    timestamp: editChatInputValue.timestamp,
    message: editChatInputValue.message,
    read: false,
    attachment: editChatInputValue.attachment,
    roomId: currentRoomId!,
    attachmentFiles: [],
    calls: [],
  };


  if (homeSocket.current) {
    homeSocket.current.emit("editMessage", messageData);
  }

  setIsEdit(false)
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

export default onEditButtonClick;