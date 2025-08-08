import { useEffect } from "react";
import { MessageType } from "../../../@types/cattypes";
import { toast } from "react-toastify";

type UseConfirmCallHandlerProps = {
  homeSocket: any;
  peerConnection: React.MutableRefObject<RTCPeerConnection | null>;
  setIsAnswerable: React.Dispatch<React.SetStateAction<boolean>>;
  setChatInputValue: React.Dispatch<React.SetStateAction<MessageType>>;
  makeCallAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  setFakeMediaRecorder: React.Dispatch<React.SetStateAction<MediaRecorder | null>>,
  setEndCall: React.Dispatch<React.SetStateAction<boolean>>;
}


const useConfirmCallHandler = ({
  homeSocket,
  peerConnection,
  setIsAnswerable,
  setChatInputValue,
  makeCallAudioRef,
  setFakeMediaRecorder,
  setEndCall
}: UseConfirmCallHandlerProps) => {
  useEffect(() => {
    if (!homeSocket?.current) return;

    const socket = homeSocket.current;

    const handleConfirmCall = async (data: {
      answer: any;
      callerId: string;
      receiverId: string;
      roomId: string;
      messageData: MessageType;
    }) => {
      setIsAnswerable(false);
      setEndCall(false);
      try {
        setChatInputValue(data.messageData);
        await peerConnection.current?.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );

        if (makeCallAudioRef?.current) {
          makeCallAudioRef.current.pause();
        }

        // Get remote stream tracks
        const remoteTracks = peerConnection.current
          ?.getReceivers()
          .map((receiver) => receiver.track);

        if (remoteTracks) {
          const stream = new MediaStream(remoteTracks);

          // Fake MediaRecorder to handle audio
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: "audio/webm;codecs=opus",
          });

          mediaRecorder.onerror = (err) =>
            console.error("MediaRecorder error:", err);

          mediaRecorder.start();
          setFakeMediaRecorder(mediaRecorder);
        }
      } catch (error: any) {
        toast.error(error.toString());
      }
    };

    socket.on("confirmCall", handleConfirmCall);

    return () => {
      socket.off("confirmCall");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeSocket, makeCallAudioRef, peerConnection,]);
}

export default useConfirmCallHandler;