import { Layout } from "antd";
import cls, { Argument } from "classnames";
import React, { useMemo } from "react";
import { LayoutSiderItemMode } from "../type";
import stl from "./index.module.less";
import LeftMenu from "./LeftMenu";

const HORIZONTAL_WIDTH = 192;
const VERTICAL_WIDTH = 72;

type SiderCfg = {
  mode?: LayoutSiderItemMode;
  collapsed?: boolean;
  siderWidth?: number;
  collapsedWidth?: number;
};

export const getSiderCfg = (mode?: LayoutSiderItemMode): SiderCfg => {
  if (mode === LayoutSiderItemMode.HORIZONTAL) {
    return {
      mode,
      collapsed: false,
      siderWidth: HORIZONTAL_WIDTH,
      collapsedWidth: HORIZONTAL_WIDTH,
    };
  }

  return {
    mode,
    collapsed: true,
    siderWidth: VERTICAL_WIDTH,
    collapsedWidth: VERTICAL_WIDTH,
  };
};

export type SiderProps = {
  className?: Argument;
  /**
   * 侧边栏菜单模式
   */
  mode?: LayoutSiderItemMode;
  /**
   * 顶部扩展
   */
  topExtend?: React.ReactNode;
  /**
   * 底部扩展
   */
  bottomExtend?: React.ReactNode;
  /**
   * 渲染顶部扩展
   */
  renderMenuTop?: (params: SiderCfg) => React.ReactNode;
  /**
   * 渲染底部扩展
   */
  renderMenuBottom?: (params: SiderCfg) => React.ReactNode;
};

const Sider = (props: SiderProps) => {
  const {
    className,
    mode,
    topExtend,
    bottomExtend,
    renderMenuTop,
    renderMenuBottom,
  } = props;

  const siderCfg = useMemo(() => getSiderCfg(mode), [mode]);

  const topCom = useMemo(() => {
    if (topExtend) {
      return topExtend;
    }

    return renderMenuTop?.(siderCfg);
  }, [renderMenuTop, siderCfg, topExtend]);

  const bottomCom = useMemo(() => {
    if (bottomExtend) {
      return bottomExtend;
    }

    return renderMenuBottom?.(siderCfg);
  }, [bottomExtend, renderMenuBottom, siderCfg]);

  return (
    <Layout.Sider
      className={cls(stl.sider, className)}
      theme="light"
      collapsed={siderCfg.collapsed}
      width={siderCfg.siderWidth}
      collapsedWidth={siderCfg.collapsedWidth}
    >
      <div className={stl.top}>{topCom}</div>
      <LeftMenu
        className={stl.menu}
        mode={siderCfg.mode}
        collapsed={siderCfg.collapsed}
      />
      <div className={stl.bottom}>{bottomCom}</div>
    </Layout.Sider>
  );
};

export default Sider;
