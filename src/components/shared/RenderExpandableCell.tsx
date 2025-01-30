import Tooltip from "@mui/material/Tooltip";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useState, useRef, useEffect } from "react";

const RenderExpandableCell = (props: GridRenderCellParams) => {

  const [isOverflowed, setIsOverflow] = useState(false);
  const { value } = props;
  const formatValue = Array.isArray(value) ? value.toString() : value
  const textElementRef = useRef<HTMLSpanElement | null>(null);

  const checkOverflow = () => {
    // Using getBoundingClientRect, instead of scrollWidth and clientWidth, to get width with fractional accuracy
    const clientWidth = textElementRef.current!.getBoundingClientRect().width;

    textElementRef.current!.style.overflow = 'visible';
    const contentWidth = textElementRef.current!.getBoundingClientRect().width;
    textElementRef.current!.style.overflow = 'hidden';

    setIsOverflow(contentWidth > clientWidth);
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
    };
  }, []);
  return (
    <Tooltip arrow title={formatValue} disableHoverListener={!isOverflowed} followCursor>
      <span
        ref={textElementRef}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {formatValue}
      </span>
    </Tooltip>
  );
};

export default RenderExpandableCell;