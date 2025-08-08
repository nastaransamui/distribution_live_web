import { toast } from "react-toastify";
import { ChatDataType, ChatUserType, MessageType } from "../../../@types/cattypes";
import createPeerConnection from "./createPeerConnection";
import openMediaDevices from "./openMediaDevices";

type MakeVoiceCallProps = {
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>,
  localStream: React.MutableRefObject<MediaStream | null>,
  remoteStream: React.MutableRefObject<MediaStream | null>,
  homeSocket: any,
  currentUserId: string | undefined,
  currentRoom: ChatDataType | null,
  currentRoomId: string | null,
  setChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>,
  setCallReceiverUserData: React.Dispatch<React.SetStateAction<ChatUserType | null>>,
  setVoiceCallActive: React.Dispatch<React.SetStateAction<boolean>>,
  makeCallAudioRef: React.MutableRefObject<HTMLAudioElement | null>
  setEndCall: React.Dispatch<React.SetStateAction<boolean>>;
}

const makeVoiceCall = async (
  {
    peerConnection,
    localStream,
    remoteStream,
    homeSocket,
    currentUserId,
    currentRoom,
    currentRoomId,
    setChatInputValue,
    setCallReceiverUserData,
    setVoiceCallActive,
    makeCallAudioRef,
    setEndCall
  }: MakeVoiceCallProps
) => {
  try {
    setEndCall(false);
    const stream = await openMediaDevices({ audio: true });
    if (stream) {
      localStream.current = stream;
      remoteStream.current = new MediaStream();
      peerConnection.current = createPeerConnection({ homeSocket, currentUserId, currentRoom, currentRoomId });
      localStream.current.getTracks().forEach(track => {
        track.enabled = true;
        peerConnection.current?.addTrack(track, localStream.current!);

      })
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      const callerId = currentUserId;
      const receiverId =
        currentRoom?.createrData.userId == callerId ?
          currentRoom?.receiverData.userId :
          currentRoom?.createrData.userId;

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
        senderRoleName?: string;
        senderName?: string;
        senderGender?: string;
        icon?: string;
      } = {
        senderId: currentUserId!,
        receiverId: receiverId!,
        senderFcmTokens: senderFcmTokens,
        receiverFcmTokens: receiverFcmTokens,
        timestamp: new Date().getTime(),
        message: null,
        read: false,
        attachment: [],
        roomId: currentRoomId!,
        calls: [
          {
            isVoiceCall: true,
            isVideoCall: false,
            startTimeStamp: new Date().getTime(),
            finishTimeStamp: null,
            isMissedCall: false,
            isRejected: false,
            isAnswered: false,
          }
        ],
        senderRoleName: senderRoleName,
        senderName: senderName,
        senderGender: senderGender,
        icon: icon,
      };
      setChatInputValue(messageData)
      homeSocket.current.emit("makeVoiceCall", { offer, callerId, receiverId, roomId: currentRoomId, messageData });
      if (currentRoom !== null) {
        const callReceiver = currentRoom.createrData.userId === currentUserId ? currentRoom.receiverData : currentRoom.createrData;
        setCallReceiverUserData((prevState) => (prevState == null ? callReceiver : null));
        setTimeout(() => {
          setVoiceCallActive(true)
          if (makeCallAudioRef && makeCallAudioRef.current !== null) {
            makeCallAudioRef.current.loop = true;
            makeCallAudioRef.current.play();
          }
        }, 500);
      }
    }
  } catch (error: any) {
    toast.error(error.toString())
  }
}

export default makeVoiceCall;