import { Segmented, SegmentedProps, Tabs, TabsProps } from "antd";
import cls, { Argument } from "classnames";
import BaseText from "../BaseText";
import stl from "./index.module.less";

export type FlexTabsProps = TabsProps & {
  className?: Argument;
  style?: React.CSSProperties;
  tabBarClassName?: Argument;
  tabBarStyle?: Argument;
  title?: React.ReactNode;
  extend?: React.ReactNode;
  /** 内容区域紧贴头部 */
  clingContent?: boolean;
  /**
   * 内容区域高度自适应。
   * 若内容高度低于所在 flex 容器剩余空间则自动撑满，若超过则出现滚动条。
   * 要求内容区域所在 flex 容器必须指定高度，或者其父容器也是 flex 容器。
   */
  overflowContent?: boolean;
  /** 使用 Segmented 渲染 Tabs 导航区域 */
  segmentedTabBar?: boolean | SegmentedProps;
};

/**
 * 使用 flex 布局样式的 Tabs
 */
export const FlexTabs = (props: FlexTabsProps) => {
  const {
    className,
    tabBarClassName,
    tabBarStyle,
    title,
    extend,
    size,
    items,
    tabPosition = "top",
    tabBarExtraContent,
    clingContent,
    overflowContent,
    segmentedTabBar,
    ...rest
  } = props;

  const renderTabBar: TabsProps["renderTabBar"] = (tabBarProps) => {
    const { activeKey, onTabClick } = tabBarProps;
    const segmentedProps =
      (typeof segmentedTabBar === "boolean" ? undefined : segmentedTabBar) ||
      {};

    let extraLeft: React.ReactNode;
    let extraRight: React.ReactNode;
    if (title) {
      extraLeft = (
        <BaseText className={stl.title} type="sub">
          {title}
        </BaseText>
      );
    }
    if (extend) {
      extraRight = extend;
    }
    if (tabBarExtraContent) {
      const { left, right } = tabBarExtraContent as Exclude<
        TabsProps["tabBarExtraContent"],
        React.ReactNode
      >;
      extraLeft = left;
      extraRight = right || (tabBarExtraContent as React.ReactNode);
    }

    return (
      <div className={cls(stl.tabBar, tabBarClassName)} style={tabBarStyle}>
        <div className={stl.extraLeft}>{extraLeft}</div>
        <div className={stl.segmented}>
          <Segmented
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
          [stl.cling]: clingContent,
          [stl.overflow]: overflowContent,
        },
      )}
      size={size}
      items={items}
      tabPosition={tabPosition}
      tabBarExtraContent={tabBarExtraContent}
      renderTabBar={segmentedTabBar ? renderTabBar : undefined}
      {...rest}
    />
  );
};

export default FlexTabs;
