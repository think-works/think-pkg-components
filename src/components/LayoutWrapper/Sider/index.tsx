import { Layout } from "antd";
import cls, { Argument } from "classnames";
import React, { useEffect, useMemo, useState } from "react";
import { listenBrowserTheme } from "@/common/themes";
import { LayoutWrapperSiderMode } from "../type";
import stl from "./index.module.less";
import LeftMenu from "./LeftMenu";

const HORIZONTAL_WIDTH = 192;
const VERTICAL_WIDTH = 80;

export type SiderCfg = {
  /** 菜单模式 */
  mode?: LayoutWrapperSiderMode;
  /** 收起状态 */
  collapsed?: boolean;
  /** 展开宽度 */
  siderWidth?: number;
  /** 收起宽度 */
  collapsedWidth?: number;
  /** 当前宽度 */
  currentWidth?: number;
};

export const getSiderCfg = (mode?: LayoutWrapperSiderMode): SiderCfg => {
  if (mode === LayoutWrapperSiderMode.HORIZONTAL) {
    return {
      mode,
      collapsed: false,
      siderWidth: HORIZONTAL_WIDTH,
      collapsedWidth: HORIZONTAL_WIDTH,
      currentWidth: HORIZONTAL_WIDTH,
    };
  }

  return {
    mode,
    collapsed: true,
    siderWidth: VERTICAL_WIDTH,
    collapsedWidth: VERTICAL_WIDTH,
    currentWidth: VERTICAL_WIDTH,
  };
};

export type SiderProps = {
  className?: Argument;
  style?: React.CSSProperties;
  /**
   * 侧边栏菜单模式
   */
  mode?: LayoutWrapperSiderMode;
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
    style,
    mode,
    topExtend,
    bottomExtend,
    renderMenuTop,
    renderMenuBottom,
  } = props;

  const [siderTheme, setSiderTheme] = useState("light");
  useEffect(() => {
    return listenBrowserTheme((value) => {
      setSiderTheme(value === "dark" ? "dark" : "light");
    });
  }, []);

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
      className={cls(
        stl.sider,
        mode === LayoutWrapperSiderMode.HORIZONTAL && stl.horizontalSider,
        className,
      )}
      style={style}
      theme={siderTheme as any}
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
