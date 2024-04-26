import { Radio, RadioGroupProps, Tabs, TabsProps } from "antd";
import cls, { Argument } from "classnames";
import stl from "./index.module.less";

export type FlexTabsProps = TabsProps & {
  className?: Argument;
  /**
   * 内容区域高度自适应。
   * 若内容高度低于所在 flex 容器剩余空间则自动撑满，若超过则出现滚动条。
   * 要求内容区域所在 flex 容器必须指定高度，或者其父容器也是 flex 容器。
   */
  overflowContent?: boolean;
  /** 使用 Radio.Group 渲染 Tabs 导航区域 */
  radioGroupTabBar?: boolean | RadioGroupProps;
};

/**
 * 使用 flex 布局样式的 Tabs
 */
export const FlexTabs = (props: FlexTabsProps) => {
  const {
    className,
    size,
    items,
    tabPosition = "top",
    overflowContent,
    radioGroupTabBar,
    ...rest
  } = props;

  const renderTabBar: TabsProps["renderTabBar"] = (tabBarProps) => {
    const { activeKey, onTabClick } = tabBarProps;
    const groupProps =
      (typeof radioGroupTabBar === "boolean" ? undefined : radioGroupTabBar) ||
      {};

    return (
      <div className={stl.radioGroupNav}>
        <Radio.Group
          optionType="button"
          size={size}
          value={activeKey}
          onChange={(e) => onTabClick(e.target.value, undefined as any)}
          options={items?.map(({ key, label, disabled }, idx) => ({
            value: key || idx,
            label,
            disabled,
          }))}
          {...groupProps}
        />
      </div>
    );
  };

  return (
    <Tabs
      className={cls(
        stl.flexTabs,
        className,
        {
          [stl.overflow]: overflowContent,
        },
        tabPosition ? stl[tabPosition] : null,
      )}
      size={size}
      items={items}
      tabPosition={tabPosition}
      renderTabBar={radioGroupTabBar ? renderTabBar : undefined}
      {...rest}
    />
  );
};

export default FlexTabs;
