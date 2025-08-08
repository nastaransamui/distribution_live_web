import { ChatUserType, MessageType } from "../../../@types/cattypes";
import clearRecording from "./clearRecording";
import handleDownload from "./handleDownload";

type EndVoiceCallProps = {
  homeSocket: any,
  chatInputValue: MessageType,
  setChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>,
  setFakeMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>
  setEndCall: React.Dispatch<React.SetStateAction<boolean>>;
  endCall: boolean;
  makeCallAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>;
  localStream: React.MutableRefObject<MediaStream | null>
  remoteStream: React.MutableRefObject<MediaStream | null>
  setVoiceCallActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCallReceiverUserData: React.Dispatch<React.SetStateAction<ChatUserType | null>>
  setIsAnswerable: React.Dispatch<React.SetStateAction<boolean>>;
  isRecording: boolean;
  stopRecording: () => void;
  setShowSnakBar: React.Dispatch<React.SetStateAction<{ show: boolean, text: string }>>;
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>,
  audioBlobRef: React.MutableRefObject<Blob | null>;
}

const endVoiceCall = (
  {
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
  }: EndVoiceCallProps
) => {
  if (!homeSocket?.current) return;
  if (endCall) return;
  setEndCall(true);
  if (makeCallAudioRef?.current) {
    makeCallAudioRef.current.pause();
  }
  const drautoComplet = document.querySelector(
    ".MuiAutocomplete-root"
  ) as HTMLElement;
  if (drautoComplet) {
    drautoComplet.style.zIndex = "1301";
  }

  peerConnection.current?.close();
  peerConnection.current = null;

  localStream.current?.getTracks().forEach((track) => track.stop());
  remoteStream.current?.getTracks().forEach((track) => track.stop());

  localStream.current = null;
  remoteStream.current = null;
  const updatedChatInputValue = {
    ...chatInputValue,
    calls: chatInputValue.calls.map((call, index) =>
      index === 0 ? { ...call, finishTimeStamp: new Date().getTime() } : call
    ),
  };
  setVoiceCallActive(false);
  setCallReceiverUserData(null);
  setIsAnswerable(false);
  setChatInputValue(updatedChatInputValue);
  setFakeMediaRecorder(null)
  if (isRecording) {
    stopRecording();
    setTimeout(() => {
      handleDownload({
        audioBlobRef,
        setAudioBlob,
      });
      clearRecording({
        audioBlobRef,
        setAudioBlob,
      });
    }, 300);
  } else {
    // Clear old blob if not recording
    setTimeout(() => {
      clearRecording({
        audioBlobRef,
        setAudioBlob,
      });
    }, 300);
  }

  setShowSnakBar({
    text: "The call has ended.",
    show: true,
  });
  homeSocket.current.emit('endVoiceCall', { messageData: updatedChatInputValue, })
}

export default endVoiceCall