import { useCallback, useEffect } from "react";
import { ChatUserType, IncomingCallType, MessageType } from "../../../@types/chatTypes";
import endVoiceCall from "../useChatHelpers/endVoiceCall";

type UseEndVoiceCallHandlerProps = {
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
  // isRecording: boolean;
  // stopRecording: () => void;
  setShowSnakBar: React.Dispatch<React.SetStateAction<{ show: boolean, text: string }>>;
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>,
  audioBlobRef: React.MutableRefObject<Blob | null>;
  incomingCall: IncomingCallType | null;
}

const useEndVoiceCallHandler = ({
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
  // isRecording,
  // stopRecording,
  setShowSnakBar,
  setAudioBlob,
  audioBlobRef,
  incomingCall,
}: UseEndVoiceCallHandlerProps) => {
  // Create a stable listener
  const handleEndVoiceCall = useCallback(() => {
    if (endCall) return;
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
      // isRecording,
      // stopRecording,
      setShowSnakBar,
      setAudioBlob,
      audioBlobRef,
      createrData,
      receiverData,
    });
  }, [
    endCall,
    homeSocket,
    chatInputValue,
    setChatInputValue,
    setFakeMediaRecorder,
    setEndCall,
    makeCallAudioRef,
    peerConnection,
    localStream,
    remoteStream,
    setVoiceCallActive,
    setCallReceiverUserData,
    setIsAnswerable,
    // isRecording,
    // stopRecording,
    setShowSnakBar,
    setAudioBlob,
    audioBlobRef,
    incomingCall
  ]);
  useEffect(() => {
    if (!homeSocket?.current) return;
    const socket = homeSocket.current;

    socket.on("endVoiceCall", handleEndVoiceCall);

    return () => {
      socket.off("endVoiceCall");
    };
  }, [homeSocket, handleEndVoiceCall]);
  // useEffect(() => {
  //   if (!homeSocket?.current) return;

  //   const socket = homeSocket.current;



  //   socket.on("endVoiceCall", () => {
  //     if (endCall) return;
  //     endVoiceCall({
  //       homeSocket,
  //       chatInputValue,
  //       setChatInputValue,
  //       setFakeMediaRecorder,
  //       setEndCall,
  //       endCall,
  //       makeCallAudioRef,
  //       peerConnection,
  //       localStream,
  //       remoteStream,
  //       setVoiceCallActive,
  //       setCallReceiverUserData,
  //       setIsAnswerable,
  //       isRecording,
  //       stopRecording,
  //       setShowSnakBar,
  //       setAudioBlob,
  //       audioBlobRef,
  //     });
  //   });

  //   return () => {
  //     socket.off("endVoiceCall");
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   homeSocket,
  //   // isRecording,
  //   // stopRecording,
  //   // audioBlobRef,
  //   // endCall,
  // ]);
}

export default useEndVoiceCallHandler;