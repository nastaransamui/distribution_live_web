import { ChatDataType, ChatUserType, IncomingCallType, MessageType } from "../../../@types/chatTypes";
import endVoiceCall from "./endVoiceCall";
import makeVoiceCall from "./makeVoiceCall";

type VoiceCallToggleFunctionProps = {
  voiceCallActive: boolean,
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
  makeCallAudioRef: React.MutableRefObject<HTMLAudioElement | null>,
  chatInputValue: MessageType,
  setFakeMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>
  setEndCall: React.Dispatch<React.SetStateAction<boolean>>;
  endCall: boolean;
  setIsAnswerable: React.Dispatch<React.SetStateAction<boolean>>;
  isRecording: boolean;
  stopRecording: () => void;
  setShowSnakBar: React.Dispatch<React.SetStateAction<{ show: boolean, text: string }>>;
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>,
  audioBlobRef: React.MutableRefObject<Blob | null>;
  incomingCall: IncomingCallType | null;
  setIncomingCall: React.Dispatch<React.SetStateAction<IncomingCallType | null>>,
}

const voiceCallToggleFunction = (
  {
    voiceCallActive,
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
    chatInputValue,
    setFakeMediaRecorder,
    setEndCall,
    endCall,
    setIsAnswerable,
    isRecording,
    stopRecording,
    setShowSnakBar,
    setAudioBlob,
    audioBlobRef,
    incomingCall,
    setIncomingCall
  }: VoiceCallToggleFunctionProps
) => {
  const drautoComplet = document.querySelector('.MuiAutocomplete-root') as HTMLElement
  if (!voiceCallActive) {
    makeVoiceCall({
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
      setEndCall,
      setIncomingCall,
      incomingCall
    });
    if (drautoComplet) {
      drautoComplet.style.zIndex = "1";
    }
  } else {
    const createrData = incomingCall?.callerData as ChatUserType
    const receiverData = incomingCall?.receiverData as ChatUserType
    endVoiceCall({
      homeSocket,
      chatInputValue,
      setChatInputValue,
      setFakeMediaRecorder,
      setEndCall,
      endCall,
      makeCallAudioRef,
      peerConnection,
      localStream,
      remoteStream,
      setVoiceCallActive,
      setCallReceiverUserData,
      setIsAnswerable,
      isRecording,
      stopRecording,
      setShowSnakBar,
      setAudioBlob,
      audioBlobRef,
      createrData,
      receiverData,
    });
    if (drautoComplet) {
      drautoComplet.style.zIndex = "1301";
    }
  }
};

export default voiceCallToggleFunction;