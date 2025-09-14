import { useRouter } from "next/router";
import { useEffect } from "react";


type ResizeObserverHookProps = {
  inputGroupRef: React.RefObject<HTMLElement | null>;
  chatFooterRef: React.RefObject<HTMLElement | null>;
  setSearchInputWidth: (width: number) => void;
  setFooterHeight: (height: number) => void;
};

const useResizeObserver = ({
  inputGroupRef,
  chatFooterRef,
  setSearchInputWidth,
  setFooterHeight,
}: ResizeObserverHookProps) => {
  const router = useRouter();
  useEffect(() => {

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.target === inputGroupRef.current && entry.contentRect.width > 0) {
          setSearchInputWidth(entry.contentRect.width);
        }
        if (entry.target === chatFooterRef.current && entry.contentRect.height > 0) {
          setFooterHeight(entry.contentRect.height);
        }
      }
    });

    // Observe elements after a slight delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (inputGroupRef.current) {
        resizeObserver.observe(inputGroupRef.current);
      }
      if (chatFooterRef.current) {
        resizeObserver.observe(chatFooterRef.current);
      }
    }, 0);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [chatFooterRef, inputGroupRef, setFooterHeight, setSearchInputWidth, router.asPath]);
}

export default useResizeObserver;