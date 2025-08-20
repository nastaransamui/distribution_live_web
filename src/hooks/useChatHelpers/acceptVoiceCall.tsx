import { toast } from "react-toastify";
import openMediaDevices from "./openMediaDevices";
import createPeerConnection from "./createPeerConnection";
import { ChatDataType, IncomingCallType, MessageType } from "../../../@types/chatTypes";

type AcceptVoiceCallProps = {
  setIsAnswerable: React.Dispatch<React.SetStateAction<boolean>>,
  incomingCall: IncomingCallType | null,
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
  fakeMediaRecorder: MediaRecorder | null;
  setIncomingCall: React.Dispatch<React.SetStateAction<IncomingCallType | null>>,
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
    fakeMediaRecorder,
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
      peerConnection.current = createPeerConnection({ homeSocket, currentUserId, currentRoom, currentRoomId, incomingCall });

      // Listen for incoming remote tracks
      peerConnection.current.ontrack = (event) => {

        // Ensure remoteStream exists
        if (!remoteStream.current) {
          remoteStream.current = new MediaStream();
        }

        // Add track if not already present
        if (event.track && !remoteStream.current.getTracks().some(t => t.id === event.track.id)) {
          remoteStream.current.addTrack(event.track);
        }

        // Attach to audio element
        const audioEl = document.getElementById("remoteAudio") as HTMLAudioElement | null;
        if (audioEl && audioEl.srcObject !== remoteStream.current) {
          audioEl.srcObject = remoteStream.current;
          audioEl.onloadedmetadata = () => audioEl.play().catch(err => console.warn("audio play failed", err));
        }

        // Start MediaRecorder ONLY ONCE
        if (!fakeMediaRecorder && event.track.kind === "audio") {
          try {
            const mediaRecorder = new MediaRecorder(remoteStream.current, {
              mimeType: "audio/webm;codecs=opus",
            });
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

      // setIncomingCall(null);
    }

  } catch (error) {
    toast.error
  }
}
export default acceptVoiceCall;