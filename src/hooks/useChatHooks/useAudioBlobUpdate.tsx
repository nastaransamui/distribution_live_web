import { useEffect } from "react";

type UseAudioBlobUpdateProps = {
  isRecording: boolean;
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  recordingBlob?: Blob;
  audioBlobRef: React.MutableRefObject<Blob | null>;
}

const useAudioBlobUpdate = ({
  isRecording,
  setAudioBlob,
  recordingBlob,
  audioBlobRef,
}: UseAudioBlobUpdateProps) => {
  useEffect(() => {
    if (recordingBlob) {
      setAudioBlob(recordingBlob);
      audioBlobRef.current = recordingBlob;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordingBlob, isRecording]);
}

export default useAudioBlobUpdate;