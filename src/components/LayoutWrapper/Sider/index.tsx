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
   * @param siderWidth 侧边栏实际宽度 展开时为 siderWidth 收缩时为 collapsedWidth
   */
  renderMenuTop?: (siderWidth: number, collapsed?: boolean) => React.ReactNode;
  /**
   * 自定义菜单下方内容
   * @param siderWidth 侧边栏实际宽度 展开时为 siderWidth 收缩时为 collapsedWidth
   */
  renderMenuBottom?: (
    siderWidth: number,
    collapsed?: boolean,
  ) => React.ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  siderWidth: number;
  collapsedWidth: number;
};

const Sider = (props: SiderProps) => {
  const {
    className,
    renderMenuTop,
    renderMenuBottom,
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
      {renderMenuTop?.(collapsed ? collapsedWidth : siderWidth, collapsed)}
      <LeftMenu />
      {renderMenuBottom?.(collapsed ? collapsedWidth : siderWidth, collapsed)}
      <div className={cls(stl.extend, siderExtendClass)} />
    </Layout.Sider>
  );
};

export default Sider;
