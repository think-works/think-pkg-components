import { forwardRef } from "react";
import Scrollbar from "./Scrollbar";
import type { ScrollbarBase } from "./types";
import { isEnableStyle } from "./utils";

export interface MacScrollbarProps extends ScrollbarBase {}

export const MacScrollbar = forwardRef<HTMLDivElement, MacScrollbarProps>(
  function MacScrollbarCom(
    { suppressScrollX, suppressScrollY, style, children, ...props },
    ref,
  ) {
    const currentStyle = {
      overflowX: isEnableStyle(suppressScrollX),
      overflowY: isEnableStyle(suppressScrollY),
      ...style,
    };

    return (
      <Scrollbar
        style={currentStyle}
        innerRef={ref}
        suppressScrollX={suppressScrollX}
        suppressScrollY={suppressScrollY}
        {...props}
      >
        {children}
      </Scrollbar>
    );
  },
);
