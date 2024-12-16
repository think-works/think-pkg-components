import { Layout } from "antd";
import cls, { Argument } from "classnames";
import React from "react";
import { LayoutSiderItemMode } from "../type";
import stl from "./index.module.less";
import LeftMenu from "./LeftMenu";

export type SiderProps = {
  className?: Argument;
  /**
   * 自定义菜单上方内容
   * @param siderWidth 侧边栏实际宽度 展开时为 siderWidth 收缩时为 collapsedWidth
   */
  renderMenuTop?: (params: {
    siderWidth: number;
    collapsed?: boolean;
  }) => React.ReactNode;
  /**
   * 自定义菜单下方内容
   * @param siderWidth 侧边栏实际宽度 展开时为 siderWidth 收缩时为 collapsedWidth
   */
  renderMenuBottom?: (params: {
    siderWidth: number;
    collapsed?: boolean;
  }) => React.ReactNode;
  collapsed?: boolean;
  /**
   * 侧边栏菜单展示模式
   */
  mode: LayoutSiderItemMode;
  siderWidth: number;
};

const Sider = (props: SiderProps) => {
  const {
    className,
    mode,
    renderMenuTop,
    renderMenuBottom,
    siderWidth,
    collapsed,
  } = props;
  return (
    <Layout.Sider
      className={cls(
        stl.sider,
        mode === LayoutSiderItemMode.HORIZONTAL && stl.horizontalSider,
        className,
      )}
      theme="light"
      width={siderWidth}
      collapsedWidth={siderWidth}
      collapsed={collapsed}
    >
      {renderMenuTop?.({
        siderWidth: siderWidth,
        collapsed,
      })}
      <LeftMenu mode={mode} collapsed={collapsed} />
      {renderMenuBottom?.({
        siderWidth: siderWidth,
        collapsed,
      })}
    </Layout.Sider>
  );
};

export default Sider;
