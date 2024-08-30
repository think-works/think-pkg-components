import { Layout } from "antd";
import cls, { Argument } from "classnames";
import React from "react";
import stl from "./index.module.less";
import LeftMenu from "./LeftMenu";

/**
 * 侧边栏扩展类名
 */
const siderExtendClass = `Layout-Sider-Extend-${Date.now()}`;
export type SiderProps = {
  className?: Argument;
  /**
   * 自定义菜单上方内容
   */
  siderMenuTop?: React.ReactNode;
  /**
   * 自定义菜单下方内容
   */
  siderMenuBottom?: React.ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  siderWidth: number;
  collapsedWidth: number;
};

const Sider = (props: SiderProps) => {
  const {
    className,
    siderMenuTop,
    siderMenuBottom,
    siderWidth,
    collapsedWidth,
    collapsed,
    onCollapse,
  } = props;

  return (
    <Layout.Sider
      className={cls(stl.sider, className)}
      collapsible
      theme="light"
      width={siderWidth}
      collapsedWidth={collapsedWidth}
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      {siderMenuTop}
      <LeftMenu />
      {siderMenuBottom}
      <div className={cls(stl.extend, siderExtendClass)} />
    </Layout.Sider>
  );
};

export default Sider;
