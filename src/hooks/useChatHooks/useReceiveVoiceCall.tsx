import { useEffect } from "react";
import { ChatDataType, ChatUserType, MessageType } from "../../../@types/chatTypes";


type UseReceiveVoiceCallProps = {
  homeSocket: any;
  setIncomingCall: React.Dispatch<React.SetStateAction<{ offer: RTCSessionDescriptionInit, receiverId: string, callerId: string, roomId: string } | null>>;
  setVoiceCallActive: React.Dispatch<React.SetStateAction<boolean>>;
  setIsAnswerable: React.Dispatch<React.SetStateAction<boolean>>;
  setChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>;
  currentUserId: string | undefined;
  userChatData: ChatDataType[];
  setCallReceiverUserData: React.Dispatch<React.SetStateAction<ChatUserType | null>>;
  makeCallAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  missedCallTimeout: React.MutableRefObject<NodeJS.Timeout | null>
  setEndCall: React.Dispatch<React.SetStateAction<boolean>>;
}

const useReceiveVoiceCall = ({
  homeSocket,
  setIncomingCall,
  setVoiceCallActive,
  setIsAnswerable,
  setChatInputValue,
  currentUserId,
  userChatData,
  setCallReceiverUserData,
  makeCallAudioRef,
  missedCallTimeout,
  setEndCall
}: UseReceiveVoiceCallProps) => {

  useEffect(() => {
    if (!homeSocket?.current) return;
    const socket = homeSocket.current;
    socket.on('receiveVoiceCall', async (data: { offer: RTCSessionDescriptionInit, callerId: string, receiverId: string, roomId: string, messageData: MessageType }) => {
      setEndCall(false)
      setIncomingCall(data);
      setVoiceCallActive(true);
      setIsAnswerable(true);
      setChatInputValue(data.messageData)
      if (data.receiverId === currentUserId) {
        const { roomId } = data;
        // setCurrentRoomId(() => roomId)
        const roomData = userChatData.find((a) => a.roomId === roomId);
        if (roomData) {
          const callReceiver =
            roomData.createrData.userId == currentUserId ?
              roomData.receiverData :
              roomData.createrData;
          setCallReceiverUserData(() => callReceiver)
        }
        setTimeout(() => {
          setVoiceCallActive(true)
          if (makeCallAudioRef && makeCallAudioRef.current !== null) {
            makeCallAudioRef.current.loop = true;
            makeCallAudioRef.current.play();
          }
        }, 500);

        // Clear any existing timeout before setting a new one
        if (missedCallTimeout.current) {
          clearTimeout(missedCallTimeout.current);
        }

        // Set a timeout to show "missed call" only if not accepted
        missedCallTimeout.current = setTimeout(() => {
          const updatedChatInputValue = {
            ...data.messageData,
            calls: data.messageData.calls.map((call, index) =>
              index === 0 ? {
                ...call,
                isMissedCall: true,
                isAnswered: false,
                finishTimeStamp: new Date().getTime(),
              } : call
            ),
          };
          setChatInputValue(updatedChatInputValue);
          homeSocket.current.emit('endVoiceCall', { messageData: updatedChatInputValue })
        }, 20 * 1000);
      }
    })
    return () => {
      socket.off("receiveVoiceCall")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, homeSocket, userChatData, missedCallTimeout])

}

export default useReceiveVoiceCall;