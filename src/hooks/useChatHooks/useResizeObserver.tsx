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
        if (entry.target === inputGroupRef.current) {
          setSearchInputWidth(entry.contentRect.width);
        }
        if (entry.target === chatFooterRef.current) {
          setFooterHeight(entry.contentRect.height);
        }
      }
    });

    if (inputGroupRef.current) resizeObserver.observe(inputGroupRef.current);
    if (chatFooterRef.current) resizeObserver.observe(chatFooterRef.current);

    return () => resizeObserver.disconnect(); // Cleanup on unmount
  }, [chatFooterRef, inputGroupRef, setFooterHeight, setSearchInputWidth]);
}

export default useResizeObserver;