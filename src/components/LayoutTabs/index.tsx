import cls, { Argument } from "classnames";
import BaseText from "../BaseText";
import FlexTabs, { FlexTabsProps } from "../FlexTabs";
import stl from "./index.module.less";

export type LayoutTabsProps = FlexTabsProps & {
  className?: Argument;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  extend?: React.ReactNode;
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
};

/**
 * Tabs 布局
 */
export const LayoutTabs = (props: LayoutTabsProps) => {
  const { className, style, title, extend, classNames, styles, ...rest } =
    props || {};

  const extraLeft = title ? (
    <BaseText
      className={cls(stl.title, classNames?.title)}
      style={styles?.title}
      type="sub"
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
        tabBarExtraContent={extraContent}
        {...rest}
      />
    </div>
  );
};

export default LayoutTabs;
