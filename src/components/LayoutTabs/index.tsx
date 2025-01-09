import cls, { Argument } from "classnames";
import BaseText from "../BaseText";
import FlexTabs, { FlexTabsProps } from "../FlexTabs";
import { LayoutTitleSize, layoutTitleSize2BaseTextType } from "../LayoutTitle";
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
  /** 标题尺寸 */
  titleSize?: LayoutTitleSize;
  /** 无内边距 */
  rimless?: boolean;
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
    titleSize = "middle",
    tabPosition = "top",
    rimless,
    title,
    extend,
    ...rest
  } = props || {};

  const textType = layoutTitleSize2BaseTextType(titleSize || size);

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
    <div
      className={cls(
        stl.layoutTabs,
        className,
        tabPosition ? stl[tabPosition] : null,
        {
          [stl.rimless]: rimless,
        },
      )}
      style={style}
    >
      <FlexTabs
        className={cls(stl.tabs, classNames?.tabs)}
        style={styles?.tabs}
        size={size}
        tabPosition={tabPosition}
        tabBarExtraContent={extraContent}
        classNames={{ tabBar: stl.tabBar }}
        {...rest}
      />
    </div>
  );
};

export default LayoutTabs;
