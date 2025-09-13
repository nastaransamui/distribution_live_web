import Tooltip from "@mui/material/Tooltip";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useState, useRef, useEffect, useCallback } from "react";

const RenderExpandableCell = (props: GridRenderCellParams) => {

  const [isOverflowed, setIsOverflow] = useState(false);
  const { value } = props;
  const formatValue = props.formattedValue;

  const textElementRef = useRef<HTMLSpanElement | null>(null);
  const checkOverflow = useCallback(() => {
    const el = textElementRef.current;
    if (!el) return;
    // use scrollWidth and bounding rect width (more reliable across browsers/inline text)
    const scrollW = Math.round(el.scrollWidth);
    const clientW = Math.floor(el.getBoundingClientRect().width);
    setIsOverflow(scrollW > clientW);
  }, []);

  useEffect(() => {
    // Let layout & webfonts settle and then measure
    const rafId = requestAnimationFrame(checkOverflow);

    // Re-check on window resize
    const onResize = () => {
      // use rAF to avoid layout thrash
      requestAnimationFrame(checkOverflow);
    };
    window.addEventListener("resize", onResize);

    // Use ResizeObserver to catch parent/container changes (if supported)
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && textElementRef.current) {
      ro = new ResizeObserver(() => {
        requestAnimationFrame(checkOverflow);
      });
      ro.observe(textElementRef.current);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
    };
  }, [formatValue, checkOverflow]); // re-run when content changes

  return (
    <Tooltip arrow title={formatValue !== '' ? formatValue : formatValue} disableHoverListener={!isOverflowed} followCursor>
      <span
        ref={textElementRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: 'inline-block',
          maxWidth: '100%',
        }}
      >
        {formatValue}
      </span>
    </Tooltip>
  );
};

export default RenderExpandableCell;