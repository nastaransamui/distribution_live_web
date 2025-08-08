
type ClearRecordingProps = {
  setAudioBlob: React.Dispatch<React.SetStateAction<Blob | null>>,
  audioBlobRef: React.MutableRefObject<Blob | null>
}
const clearRecording = (
  {
    setAudioBlob,
    audioBlobRef
  }: ClearRecordingProps
) => {
  setAudioBlob(null);
  audioBlobRef.current = null;
};
export default clearRecording;