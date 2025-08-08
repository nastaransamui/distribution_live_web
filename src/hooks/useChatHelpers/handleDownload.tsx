import clearRecording from "./clearRecording";

type HandleDownloadProps = {
  audioBlobRef: React.MutableRefObject<Blob | null>,
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>,
}

const handleDownload = (
  {
    audioBlobRef,
    setAudioBlob,
  }: HandleDownloadProps
) => {
  if (audioBlobRef.current) {
    const url = URL.createObjectURL(audioBlobRef.current);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => {
      clearRecording({ setAudioBlob, audioBlobRef })
    }, 200);
  }
};

export default handleDownload;