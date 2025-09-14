import { RefObject } from "react";
import { ChatDataType, MessageType } from "../../../@types/chatTypes";

type OnSendButtonClick = {
  chatInputValue: MessageType,
  currentRoom: ChatDataType | null,
  currentUserId: string | undefined,
  currentRoomId: string | null,
  homeSocket: any,
  lastRef: RefObject<HTMLDivElement | null>,
  setChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>
}

const onSendButtonClick = (
  {
    chatInputValue,
    currentRoom,
    currentUserId,
    currentRoomId,
    homeSocket,
    lastRef,
    setChatInputValue,
  }: OnSendButtonClick
) => {
  if (
    (chatInputValue.message == null || chatInputValue.message.trim() === '') &&
    chatInputValue.attachment.length == 0
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
  const senderRoleName = currentRoom?.createrData.userId == currentUserId
    ? currentRoom?.createrData.roleName!
    : currentRoom?.receiverData.roleName!;
  const senderName = currentRoom?.createrData.userId == currentUserId
    ? currentRoom?.createrData.fullName!
    : currentRoom?.receiverData.fullName!;
  const icon = currentRoom?.createrData.userId == currentUserId
    ? currentRoom?.createrData.profileImage!
    : currentRoom?.receiverData.profileImage!;
  const senderGender = currentRoom?.createrData.userId == currentUserId
    ? currentRoom?.createrData.gender!
    : currentRoom?.receiverData.gender!;
  const messageData: MessageType & {
    senderRoleName: string;
    senderName: string;
    senderGender: string;
    icon: string;
    attachmentFiles: any[]
  } = {
    senderId: currentUserId!,
    receiverId: receiverId!,
    senderFcmTokens: senderFcmTokens,
    receiverFcmTokens: receiverFcmTokens,
    timestamp: new Date().getTime(),
    message: chatInputValue.message,
    read: false,
    attachment: chatInputValue.attachment,
    roomId: currentRoom?.roomId!,
    attachmentFiles: [],
    calls: [],
    senderRoleName: senderRoleName,
    senderName: senderName,
    senderGender: senderGender,
    icon: icon
  };

  let uploadPromise = new Promise(async (uploadResolve) => {
    let uploadAttachResolve: any;
    let uploadAttachPromise = new Promise((r) => { uploadAttachResolve = r; });

    if (chatInputValue.attachment.length > 0) {
      let totalFiles = chatInputValue.attachment.length;
      let processedFiles = 0;

      chatInputValue.attachment.forEach((fileData) => {
        fetch(fileData.src) // Convert blob URL to file
          .then(res => res.blob())
          .then(blob => {
            let reader = new FileReader();
            reader.onload = function () {
              let buffer = new Uint8Array(reader.result as ArrayBuffer);

              messageData.attachmentFiles.push({
                attachFile: buffer,
                attachFileName: fileData.name,
                attachFileExtentionNoDot: fileData.name.split('.').pop(),
                attachFileType: fileData.type || "application/octet-stream",
              });

              processedFiles++;
              if (processedFiles === totalFiles) {
                uploadAttachResolve(true);
              }
            };
            reader.readAsArrayBuffer(blob);
          });
      });
    } else {
      uploadAttachResolve(true);
    }

    Promise.all([uploadAttachPromise])
      .then(() => uploadResolve(true))
      .catch((_err) => { });
  });

  Promise.resolve(uploadPromise).then(async () => {


    if (homeSocket.current) {

      homeSocket.current.emit("sendMessage", messageData);
      setTimeout(() => {
        lastRef.current?.scrollIntoView({ behavior: 'smooth' });

      }, 100);
    }
  });
  setChatInputValue({
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

export default onSendButtonClick;