import { useEffect } from "react";

type UseIceCandidateProps = {
  homeSocket: any;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>
}

const useIceCandidate = ({
  homeSocket,
  peerConnection,
}: UseIceCandidateProps) => {
  //IceCandidate
  useEffect(() => {
    if (!homeSocket?.current) return;
    const socket = homeSocket.current;

    socket.on("iceCandidate", async (data: { candidate: any, callerId: string, receiverId: string, roomId: string }) => {
      if (peerConnection.current !== null) {
        try {
          // // Added comment: Ensure remote description is set before adding ICE candidate.
          if (peerConnection.current.remoteDescription !== null) {
            await peerConnection.current.addIceCandidate(data.candidate); // // ICE candidate added
          }
        } catch (err) {
          console.error("Error adding received ice candidate", err);

        }
      }

    })

    return () => {
      socket.off("iceCandidate")
    }
  }, [homeSocket, peerConnection])
}

export default useIceCandidate;