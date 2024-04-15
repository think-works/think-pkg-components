import cls, { Argument } from "classnames";
import BaseText, { BaseTextProps } from "../BaseText";
import stl from "./index.module.less";

export type LayoutTitleProps = Omit<BaseTextProps, "title"> & {
  className?: Argument;
  style?: React.CSSProperties;
  size?: "large" | "middle" | "small";
  title?: React.ReactNode;
  extend?: React.ReactNode;
  divider?: boolean;
};

/**
 * 布局标题
 */
export const LayoutTitle = (props: LayoutTitleProps) => {
  const {
    className,
    style,
    size = "middle",
    title,
    extend,
    divider,
    ...rest
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
        className={cls(stl.title, {
          [stl.large]: size === "large",
          [stl.middle]: size === "middle",
          [stl.small]: size === "small",
        })}
      >
        <BaseText type={textType} {...rest}>
          {title}
        </BaseText>
      </div>
      <div className={stl.extend}>{extend}</div>
    </div>
  );
};

export default LayoutTitle;
