import { Tabs, TabsProps } from "antd";
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
};

/**
 * 使用 flex 布局样式的 Tabs
 */
export const FlexTabs = (props: FlexTabsProps) => {
  const { className, tabPosition, overflowContent, ...rest } = props;

  return (
    <Tabs
      className={cls(stl.flexTabs, className, {
        [stl.vertical]: tabPosition === "left" || tabPosition === "right",
        [stl.overflow]: overflowContent,
      })}
      tabPosition={tabPosition}
      {...rest}
    />
  );
};

export default FlexTabs;
