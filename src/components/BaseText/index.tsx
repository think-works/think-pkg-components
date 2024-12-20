import cls, { Argument } from "classnames";
import React, { ForwardedRef, forwardRef, HTMLAttributes } from "react";
import stl from "./index.module.less";

export type BaseTextProps = HTMLAttributes<HTMLSpanElement> & {
  className?: Argument;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  type?: "main" | "sub" | "small" | "strong" | "help" | "disabled";
};

/**
 * 基础文本
 */
export const BaseText = forwardRef(function BaseTextCom(
  props: BaseTextProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const { className, style, children, type, ...rest } = props;

  return (
    <span
      ref={ref}
      className={cls(
        stl.baseText,
        {
          [stl.main]: type === "main",
          [stl.sub]: type === "sub",
          [stl.small]: type === "small",
          [stl.strong]: type === "strong",
          [stl.help]: type === "help",
          [stl.disabled]: type === "disabled",
        },
        className,
      )}
      style={style}
      {...rest}
    >
      {children}
    </span>
  );
});

export default BaseText;
