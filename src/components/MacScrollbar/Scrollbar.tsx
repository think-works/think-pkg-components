import React, { useImperativeHandle, useRef } from "react";
import "./Scrollbar.less";
import type { ScrollbarBase } from "./types";
import useScrollbar from "./useScrollbar";

export interface ScrollbarProps extends ScrollbarBase {
  innerRef?: React.Ref<HTMLDivElement | null>;
}

export default function ScrollBar({
  className = "",
  onScroll,
  onMouseEnter,
  onMouseLeave,
  innerRef,
  children,
  suppressScrollX,
  suppressScrollY,
  suppressAutoHide,
  trackGap,
  trackStyle,
  thumbStyle,
  minThumbSize,
  ...props
}: ScrollbarProps) {
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(innerRef, () => scrollBoxRef.current!);

  const [
    horizontalBar,
    verticalBar,
    updateLayerNow,
    updateLayerThrottle,
    hideScrollbar,
  ] = useScrollbar(scrollBoxRef, {
    trackGap,
    trackStyle,
    thumbStyle,
    minThumbSize,
    suppressAutoHide,
  });

  function handleScroll(evt: React.UIEvent<HTMLDivElement, UIEvent>) {
    if (onScroll) {
      onScroll(evt);
    }
    updateLayerThrottle();
  }

  function handleMouseEnter(evt: React.MouseEvent<HTMLDivElement>) {
    if (onMouseEnter) {
      onMouseEnter(evt);
    }
    updateLayerNow();
  }

  function handleMouseLeave(evt: React.MouseEvent<HTMLDivElement>) {
    if (onMouseLeave) {
      onMouseLeave(evt);
    }
    hideScrollbar();
  }

  return (
    <div
      className={`ms-container${className && ` ${className}`}`}
      ref={scrollBoxRef}
      onScroll={handleScroll}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className={"ms-track-box ms-theme"}>
        {!suppressScrollX && horizontalBar}
        {!suppressScrollY && verticalBar}
      </div>
      {children}
    </div>
  );
}
