import { toast } from "react-toastify";
import openMediaDevices from "./openMediaDevices";
import createPeerConnection from "./createPeerConnection";
import { ChatDataType, MessageType } from "../../../@types/cattypes";

type AcceptVoiceCallProps = {
  setIsAnswerable: React.Dispatch<React.SetStateAction<boolean>>,
  incomingCall: { offer: RTCSessionDescriptionInit, receiverId: string, callerId: string, roomId: string } | null,
  homeSocket: any,
  missedCallTimeout: React.MutableRefObject<NodeJS.Timeout | null>,
  localStream: React.MutableRefObject<MediaStream | null>,
  remoteStream: React.MutableRefObject<MediaStream | null>,
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>,
  currentUserId: string | undefined,
  currentRoom: ChatDataType | null,
  currentRoomId: string | null,
  chatInputValue: MessageType,
  setChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>,
  setFakeMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>,
  setIncomingCall: React.Dispatch<React.SetStateAction<{ offer: RTCSessionDescriptionInit, receiverId: string, callerId: string, roomId: string } | null>>,
  makeCallAudioRef: React.MutableRefObject<HTMLAudioElement | null>,
  setEndCall: React.Dispatch<React.SetStateAction<boolean>>;
}

const acceptVoiceCall = async (
  {
    setIsAnswerable,
    incomingCall,
    homeSocket,
    missedCallTimeout,
    localStream,
    remoteStream,
    peerConnection,
    currentUserId,
    currentRoom,
    currentRoomId,
    chatInputValue,
    setChatInputValue,
    setFakeMediaRecorder,
    setIncomingCall,
    makeCallAudioRef,
    setEndCall
  }: AcceptVoiceCallProps
) => {
  setIsAnswerable(false)
  if (incomingCall == null) return;
  if (!homeSocket?.current) return;
  // Clear missed call timeout if the call is accepted
  if (missedCallTimeout.current) {
    clearTimeout(missedCallTimeout.current);
    missedCallTimeout.current = null;
    setEndCall(false)
  }
  try {
    const stream = await openMediaDevices({ audio: true });
    if (stream) {
      localStream.current = stream;
      remoteStream.current = new MediaStream();
      peerConnection.current = createPeerConnection({ homeSocket, currentUserId, currentRoom, currentRoomId });

      // Listen for incoming remote tracks
      peerConnection.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
          remoteStream.current?.addTrack(track);
        });

        // Start MediaRecorder when we have remote audio
        if (remoteStream.current && remoteStream.current.getTracks().length > 0) {
          try {
            const mediaRecorder = new MediaRecorder(remoteStream.current, { mimeType: "audio/webm;codecs=opus" });
            mediaRecorder.onerror = (err) => console.error("MediaRecorder error:", err);
            mediaRecorder.start();
            setFakeMediaRecorder(mediaRecorder);
          } catch (err) {
            console.error("Failed to start MediaRecorder:", err);
          }
        }
      };

      // Add local audio tracks
      localStream.current.getTracks().forEach(track => {
        track.enabled = true;
        peerConnection.current?.addTrack(track, localStream.current!);
      });

      const { offer, callerId, receiverId, roomId } = incomingCall;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      const updatedChatInputValue = {
        ...chatInputValue,
        calls: chatInputValue.calls.map((call, index) =>
          index === 0 ? { ...call, isAnswered: true } : call
        ),
      };
      setChatInputValue(updatedChatInputValue);

      homeSocket.current.emit("answerCall", { answer, callerId, receiverId, roomId, messageData: updatedChatInputValue });

      if (makeCallAudioRef && makeCallAudioRef.current !== null) {
        makeCallAudioRef.current.pause();
      }

      setIncomingCall(null);
    }

  } catch (error) {
    toast.error
  }
}
export default acceptVoiceCall;