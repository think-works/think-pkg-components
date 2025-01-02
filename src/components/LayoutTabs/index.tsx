import cls, { Argument } from "classnames";
import BaseText, { BaseTextProps } from "../BaseText";
import FlexTabs, { FlexTabsProps } from "../FlexTabs";
import stl from "./index.module.less";

export type LayoutTabsProps = FlexTabsProps & {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    title?: Argument;
    extend?: Argument;
    tabs?: Argument;
  };
  styles?: {
    title?: React.CSSProperties;
    extend?: React.CSSProperties;
    tabs?: React.CSSProperties;
  };
  /** 标题 */
  title?: React.ReactNode;
  /** 扩展 */
  extend?: React.ReactNode;
};

/**
 * Tabs 布局
 */
export const LayoutTabs = (props: LayoutTabsProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    size = "middle",
    title,
    extend,
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

  const extraLeft = title ? (
    <BaseText
      className={cls(stl.title, classNames?.title)}
      style={styles?.title}
      type={textType}
    >
      {title}
    </BaseText>
  ) : undefined;

  const extraRight = extend ? (
    <div className={cls(stl.extend, classNames?.extend)} style={styles?.extend}>
      {extend}
    </div>
  ) : undefined;

  const extraContent =
    extraLeft || extraRight
      ? { left: extraLeft, right: extraRight }
      : undefined;

  return (
    <div className={cls(stl.layoutTabs, className)} style={style}>
      <FlexTabs
        className={cls(stl.tabs, classNames?.tabs)}
        style={styles?.tabs}
        size={size}
        tabBarExtraContent={extraContent}
        {...rest}
      />
    </div>
  );
};

export default LayoutTabs;
