import { loadStylesheet } from "@/pages/_app";
import { useEffect } from "react";

type ChatAssetsHookProps = {
  reciveMessageAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  makeCallAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
  sendMessageAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

const useChatAssets = ({
  reciveMessageAudioRef,
  makeCallAudioRef,
  sendMessageAudioRef
}: ChatAssetsHookProps) => {
  useEffect(() => {
    loadStylesheet('/css/yet-another-react-lightbox-styles.css')
    if (typeof window !== 'undefined') {
      reciveMessageAudioRef.current = new Audio("/sound/recive-message.mp3");
      makeCallAudioRef.current = new Audio('/sound/incoming-call.mp3')
      sendMessageAudioRef.current = new Audio('/sound/send-message.mp3')
    }
    return () => { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useChatAssets;