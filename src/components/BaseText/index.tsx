import cls, { Argument } from "classnames";
import React, { HTMLAttributes } from "react";
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
export const BaseText = (props: BaseTextProps) => {
  const { className, style, children, type, ...rest } = props;

  return (
    <span
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
};

export default BaseText;
