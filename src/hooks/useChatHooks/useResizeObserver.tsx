import { useEffect } from "react";


type ResizeObserverHookProps = {
  inputGroupRef: React.RefObject<HTMLElement>;
  chatFooterRef: React.RefObject<HTMLElement>;
  setSearchInputWidth: (width: number) => void;
  setFooterHeight: (height: number) => void;
};

const useResizeObserver = ({
  inputGroupRef,
  chatFooterRef,
  setSearchInputWidth,
  setFooterHeight,
}: ResizeObserverHookProps) => {
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
  }, [chatFooterRef, inputGroupRef, setFooterHeight, setSearchInputWidth]);
}

export default useResizeObserver;