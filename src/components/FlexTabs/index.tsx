import { Segmented, SegmentedProps, Tabs, TabsProps } from "antd";
import cls, { Argument } from "classnames";
import { isValidElement } from "react";
import stl from "./index.module.less";

export type FlexTabsProps = TabsProps & {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    tabBar?: Argument;
    segmented?: Argument;
  };
  styles?: {
    tabBar?: React.CSSProperties;
    segmented?: React.CSSProperties;
  };
  /** 内容区域紧贴头部 */
  cling?: boolean;
  /**
   * 内容区域高度自适应。
   * 若内容高度低于所在 flex 容器剩余空间则自动撑满，若超过则出现滚动条。
   * 要求内容区域所在 flex 容器必须指定高度，或者其父容器也是 flex 容器。
   */
  overflow?: boolean;
  /** 使用 Segmented 渲染 Tabs 导航区域 */
  segmentedTabBar?: boolean | SegmentedProps;
};

/**
 * 使用 flex 布局样式的 Tabs
 */
export const FlexTabs = (props: FlexTabsProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    size,
    items,
    tabPosition = "top",
    tabBarExtraContent,
    cling,
    overflow,
    segmentedTabBar,
    ...rest
  } = props;

  let extraLeft: React.ReactNode;
  let extraRight: React.ReactNode;

  if (tabBarExtraContent) {
    const valid = isValidElement(tabBarExtraContent);
    if (valid) {
      extraRight = tabBarExtraContent as React.ReactNode;
    } else {
      const { left, right } = tabBarExtraContent as Exclude<
        TabsProps["tabBarExtraContent"],
        React.ReactNode
      >;
      extraLeft = left;
      extraRight = right;
    }
  }

  const extraContent =
    extraLeft || extraRight
      ? { left: extraLeft, right: extraRight }
      : undefined;

  const renderTabBar: TabsProps["renderTabBar"] = (tabBarProps) => {
    const { activeKey, onTabClick } = tabBarProps;
    const segmentedProps =
      (typeof segmentedTabBar === "boolean" ? undefined : segmentedTabBar) ||
      {};

    return (
      <div
        className={cls(stl.tabBar, classNames?.tabBar)}
        style={styles?.tabBar}
      >
        <div className={stl.extraLeft}>{extraLeft}</div>
        <div className={stl.content}>
          <Segmented
            className={cls(stl.segmented, classNames?.segmented)}
            style={styles?.segmented}
            size={size}
            value={activeKey}
            vertical={tabPosition === "left" || tabPosition === "right"}
            onChange={(val) => onTabClick(val as string, undefined as any)}
            options={(items || [])?.map(
              ({ key, disabled, icon, label }, idx) => ({
                disabled,
                icon,
                label,
                value: key || idx,
              }),
            )}
            {...segmentedProps}
          />
        </div>
        <div className={stl.extraRight}>{extraRight}</div>
      </div>
    );
  };

  return (
    <Tabs
      className={cls(
        stl.flexTabs,
        className,
        tabPosition ? stl[tabPosition] : null,
        {
          [stl.cling]: cling,
          [stl.overflow]: overflow,
        },
      )}
      style={style}
      size={size}
      items={items}
      tabPosition={tabPosition}
      tabBarExtraContent={extraContent}
      renderTabBar={segmentedTabBar ? renderTabBar : undefined}
      {...rest}
    />
  );
};

export default FlexTabs;
