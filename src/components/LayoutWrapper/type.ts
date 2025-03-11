import { MenuProps } from "antd";
import { To } from "react-router-dom";

/** 侧边栏菜单模式 */
export enum LayoutWrapperSiderMode {
  /** 垂直排列 icon-text */
  VERTICAL = "VERTICAL",
  /** 水平排列 icon-text */
  HORIZONTAL = "HORIZONTAL",
}

/** 权限组合模式 */
export type LayoutWrapperAuthCombineMode = "OR" | "AND";
/** 路由权限 */
export type LayoutWrapperRouteAuth = string | number | (string | number)[];
/** 页面布局路由元信息 */
export type LayoutWrapperExtendRouteMeta = Record<string, any> & {
  /** 页面标题 */
  title?: false | string;
  /** 路由面包屑 */
  crumb?: false | string;
  /** 所属菜单 */
  menu?: false | string | string[];
  /** 侧边栏可见性 */
  sider?: boolean;
  /** 面包屑栏可见性 */
  breadcrumb?: boolean;
  /** 路由名称 */
  name?: string;
  /**
   * 路由权限
   * true 仅检查授权状态是否存在(如用户是否已登录)
   * RouteAuth 进一步检查权限码是否符合(如用户所属角色)
   */
  auth?: true | LayoutWrapperRouteAuth;
  /** 权限组合模式 */
  authMode?: LayoutWrapperAuthCombineMode;
};

/** 自定义菜单位置 */
export type LayoutWrapperCustomMenuPosition = "top" | "left";
/** 自定义菜单模式 */
export type LayoutWrapperCustomMenuMode = "append" | "replace";
/** 自定义菜单项 */
export type LayoutWrapperCustomMenuItem = NonNullable<
  MenuProps["items"]
>[number] & {
  /** 菜单顺序 */
  sort?: number;
  /** 激活图标 (选中时切换) */
  activeIcon?: React.ReactNode;
};

/** 命名路由面包屑转换函数入参 */
export type LayoutWrapperCrumbParams = {
  /** 面包屑标题 */
  title?: string;
  /** 面包屑路径 */
  pathname?: string;
};
/** 命名路由面包屑转换函数返回值 */
export type LayoutWrapperCrumbReturn = LayoutWrapperCrumbParams & {
  /** 面包屑目标位置 */
  to?: To;
  /** 面包屑元素 */
  element?: React.ReactNode;
};
/** 命名路由面包屑转换函数 */
export type LayoutWrapperTransformCrumb = (
  params: LayoutWrapperCrumbParams,
) => false | LayoutWrapperCrumbReturn;
