import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChatDataType, MessageType } from "../../../@types/cattypes";

type UseReceiveMessageProps = {
  homeSocket: any,
  currentUserId: string | undefined;
  userChatDataRef: React.MutableRefObject<ChatDataType[]>;
  setUserChatData: React.Dispatch<React.SetStateAction<ChatDataType[]>>;
  reciveMessageAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  sendMessageAudioRef: React.MutableRefObject<HTMLAudioElement | null>
}

const useReceiveMessage = ({
  homeSocket,
  currentUserId,
  userChatDataRef,
  setUserChatData,
  reciveMessageAudioRef,
  sendMessageAudioRef
}: UseReceiveMessageProps) => {
  const router = useRouter();
  useEffect(() => {
    let isActive = true;
    if (isActive && homeSocket.current) {
      homeSocket.current.on('receiveMessage', (messageData: MessageType) => {
        if (messageData.receiverId == currentUserId) {
          if (typeof router.query.roomId !== 'undefined' && router.query.roomId == messageData.roomId) {
            const chatIndex = userChatDataRef.current.findIndex(chat => chat.roomId === messageData.roomId);
            if (chatIndex !== -1) {
              setTimeout(() => {
                const msgIndex = userChatDataRef.current[chatIndex].messages.findIndex((m) => m.timestamp == messageData.timestamp)
                if (msgIndex !== -1) {
                  const message = userChatDataRef.current[chatIndex].messages[msgIndex];
                  homeSocket.current.emit('makeOneMessageRead', message)
                  setUserChatData((prevState) => {
                    let newState = [...prevState];

                    // newState[chatIndex].messages[msgIndex].read = true;
                    return newState
                  })
                }
              }, 50);
            }
          }
        }
        if (messageData.receiverId == currentUserId) {
          if (router.query.roomId !== null) {
            if (reciveMessageAudioRef && reciveMessageAudioRef.current !== null) {

              reciveMessageAudioRef.current.currentTime = 0; // Reset to start
              reciveMessageAudioRef.current.play();

            }
          }
        }
        if (messageData.senderId == currentUserId) {
          if (sendMessageAudioRef && sendMessageAudioRef.current !== null) {

            sendMessageAudioRef.current.currentTime = 0; // Reset to start
            sendMessageAudioRef.current.play();

          }
        }
        // }
      })
    }
    return () => {
      isActive = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, currentUserId, router,])
}

export default useReceiveMessage;