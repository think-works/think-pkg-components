import cls, { Argument } from "classnames";
import { BaseText, BaseTextType } from "../BaseText";
import stl from "./index.module.less";

export type LayoutTitleSize = "large" | "middle" | "small";

export type LayoutTitleProps = {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    title?: Argument;
    extend?: Argument;
  };
  styles?: {
    title?: React.CSSProperties;
    extend?: React.CSSProperties;
  };
  /** 尺寸 */
  size?: LayoutTitleSize;
  /** 分割线 */
  divider?: boolean;
  /** 标题 */
  title?: React.ReactNode;
  /** 扩展 */
  extend?: React.ReactNode;
};

export const layoutTitleSize2BaseTextType = (
  size: LayoutTitleSize | undefined,
) => {
  let type: BaseTextType | undefined;

  if (size === "large") {
    type = "main";
  } else if (size === "middle") {
    type = "sub";
  } else if (size === "small") {
    type = "strong";
  }

  return type;
};

/**
 * 标题布局
 */
export const LayoutTitle = (props: LayoutTitleProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    size = "middle",
    divider,
    title,
    extend,
  } = props || {};

  const textType = layoutTitleSize2BaseTextType(size);

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
