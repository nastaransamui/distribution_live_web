import { ChatDataType } from "../../../@types/chatTypes";

type CreatePeerConnectionProps = {
  homeSocket: any,
  currentUserId: string | undefined,
  currentRoom: ChatDataType | null,
  currentRoomId: string | null
}

const peerConnectionConfiguration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] }
const createPeerConnection = (
  {
    homeSocket,
    currentUserId,
    currentRoom,
    currentRoomId,
  }: CreatePeerConnectionProps
) => {
  const pc = new RTCPeerConnection(peerConnectionConfiguration);
  pc.onicecandidate = (event) => {
    if (event.candidate && homeSocket.current) {
      const callerId = currentUserId;
      const receiverId =
        currentRoom?.createrData.userId == callerId ?
          currentRoom?.receiverData.userId :
          currentRoom?.createrData.userId

      homeSocket.current.emit("newIceCandidate", {
        candidate: {
          candidate: event.candidate.candidate,
          sdpMid: event.candidate.sdpMid,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
        },
        callerId,
        receiverId,
        roomId: currentRoomId
      });
    }
  }
  pc.ontrack = (event) => {
    if (event.streams.length > 0) {
      const audioElement = document.getElementById("remoteAudio") as HTMLAudioElement;
      if (audioElement) {
        audioElement.srcObject = event.streams[0];
        audioElement.onloadedmetadata = () => {
          audioElement.play().catch((err) => console.error("Audio play error:", err));
        };
      }
    }
  }
  return pc;
}

export default createPeerConnection;