import cls, { Argument } from "classnames";
import { BaseText, BaseTextProps } from "../BaseText";
import stl from "./index.module.less";

export type LayoutTitleProps = {
  className?: Argument;
  style?: React.CSSProperties;
  size?: "large" | "middle" | "small";
  divider?: boolean;
  title?: React.ReactNode;
  extend?: React.ReactNode;
  classNames?: {
    title?: Argument;
    extend?: Argument;
  };
  styles?: {
    title?: React.CSSProperties;
    extend?: React.CSSProperties;
  };
};

/**
 * 布局标题
 */
export const LayoutTitle = (props: LayoutTitleProps) => {
  const {
    className,
    style,
    size = "middle",
    divider,
    title,
    extend,
    classNames,
    styles,
  } = props || {};

  let textType: BaseTextProps["type"];
  if (size === "large") {
    textType = "main";
  } else if (size === "middle") {
    textType = "sub";
  } else if (size === "small") {
    textType = "strong";
  }

  return (
    <div
      className={cls(
        stl.layoutTitle,
        {
          [stl.divider]: divider,
        },
        className,
      )}
      style={style}
    >
      <div
        className={cls(stl.title, classNames?.title, {
          [stl.large]: size === "large",
          [stl.middle]: size === "middle",
          [stl.small]: size === "small",
        })}
        style={styles?.title}
      >
        <BaseText type={textType}>{title}</BaseText>
      </div>
      <div
        className={cls(stl.extend, classNames?.extend)}
        style={styles?.extend}
      >
        {extend}
      </div>
    </div>
  );
};

export default LayoutTitle;
