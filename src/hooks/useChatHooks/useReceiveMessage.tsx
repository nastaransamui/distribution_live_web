import { useRouter } from "next/router";
import { RefObject, useEffect } from "react";
import { ChatDataType, MessageType } from "../../../@types/chatTypes";
import { getChatFile } from "./useFetchUserRooms";

type UseReceiveMessageProps = {
  homeSocket: any,
  currentUserId: string | undefined;
  userChatDataRef: React.RefObject<ChatDataType[]>;
  reciveMessageAudioRef: React.RefObject<HTMLAudioElement | null>;
  sendMessageAudioRef: React.RefObject<HTMLAudioElement | null>;
  setCurrentRoom: React.Dispatch<React.SetStateAction<ChatDataType | null>>;
  lastRef: RefObject<HTMLDivElement | null>,
}

const useReceiveMessage = ({
  homeSocket,
  currentUserId,
  userChatDataRef,
  reciveMessageAudioRef,
  sendMessageAudioRef,
  setCurrentRoom,
  lastRef
}: UseReceiveMessageProps) => {
  const router = useRouter();
  useEffect(() => {
    const socket = homeSocket.current;
    if (!socket || !currentUserId) return;

    const handleReceiveMessage = async (messageData: MessageType) => {
      const isReceiver = messageData.receiverId === currentUserId;
      const isSender = messageData.senderId === currentUserId;
      // If the message has attachments, process them
      if (messageData.attachment?.length) {
        messageData = {
          ...messageData,
          attachment: await Promise.all(
            messageData.attachment.map(async (a) => ({
              ...a,
              src:
                a.id && a.id !== ""
                  ? await getChatFile(a.id, currentUserId)
                  : a.src,
            }))
          ),
        };
      }

      // If I'm the receiver and in the same room → append message & mark as read
      // if (isReceiver) {
      if (
        typeof router.query.roomId !== "undefined" &&
        router.query.roomId === messageData.roomId
      ) {
        const chatIndex = userChatDataRef.current.findIndex(
          (chat) => chat.roomId === messageData.roomId
        );

        if (chatIndex !== -1) {
          setTimeout(() => {
            setCurrentRoom((prev) => {
              if (!prev) return prev;
              const exists = prev.messages.some(
                (m) => m.timestamp === messageData.timestamp
              );
              if (exists) return prev;
              if (messageData.receiverId == currentUserId) messageData.read = true;
              return {
                ...prev,
                messages: [...prev.messages, messageData],
              };
            });
            if (messageData.receiverId == currentUserId) {
              homeSocket.current.emit("makeOneMessageRead", messageData);
            }

            setTimeout(() => {
              lastRef.current?.scrollIntoView({ behavior: 'smooth' });

            }, 100);
          }, 50);
        }
      }

      // Play receive sound
      if (router.query.roomId !== null) {
        reciveMessageAudioRef.current?.pause();
        reciveMessageAudioRef.current!.currentTime = 0;
        reciveMessageAudioRef.current?.play();
      }
      // }

      // If I'm the sender → play send sound
      if (isSender) {
        sendMessageAudioRef.current?.pause();
        sendMessageAudioRef.current!.currentTime = 0;
        sendMessageAudioRef.current?.play();
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [
    homeSocket,
    currentUserId,
    router.query.roomId, // only rebind if room changes, not full currentRoom
    reciveMessageAudioRef,
    sendMessageAudioRef,
    setCurrentRoom,
    userChatDataRef,
    lastRef
  ]);
}

export default useReceiveMessage;
