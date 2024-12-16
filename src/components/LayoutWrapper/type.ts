import { Argument } from "classnames";
import { CrumbProps } from "./Crumb";
import { FooterProps } from "./Footer";
import { HeaderProps } from "./Header";
import { SiderProps } from "./Sider";

/**
 * 侧边栏菜单模式
 */
export enum LayoutSiderItemMode {
  /**
   * 垂直排列 icon-text
   */
  VERTICAL = "VERTICAL",
  /**
   * 水平排列 icon-text
   */
  HORIZONTAL = "HORIZONTAL",
}

/**
 * 权限组合模式
 */
type AuthCombineMode = "OR" | "AND";
/**
 * 路由权限
 */
type RouteAuth = string | number | (string | number)[];
/**
 * 页面布局路由元信息
 */
export interface LayoutWrapperExtendRouteMeta extends Record<string, any> {
  /**
   * 页面标题
   */
  title?: false | string;
  /**
   * 路由面包屑
   */
  crumb?: false | string;
  /**
   * 所属菜单
   */
  menu?: false | string | string[];
  /**
   * 侧边栏可见性
   */
  sider?: boolean;
  /**
   * 面包屑栏可见性
   */
  breadcrumb?: boolean;
  /**
   * 路由名称
   */
  name?: string;
  /**
   * 路由权限
   * true 仅检查授权状态是否存在(如用户是否已登录)
   * RouteAuth 进一步检查权限码是否符合(如用户所属角色)
   */
  auth?: true | RouteAuth;
  /**
   * 权限组合模式
   */
  authMode?: AuthCombineMode;
}

/**
 * 页面布局组件参数
 */
export interface LayoutWrapperProps {
  className?: Argument;
  children?: React.ReactNode;
  /**
   * 最小页面宽度
   * 默认值 1200
   */
  minPageWidth?: number;
  /**
   * 页面顶部
   * 快捷属性，等同于 headerProps.children
   */
  header?: React.ReactNode;
  /**
   * 页面底部
   * 快捷属性，等同于 footerProps.children
   */
  footer?: React.ReactNode;
  /**
   * 页头属性
   */
  headerProps?: HeaderProps;
  /**
   * 页脚属性
   */
  footerProps?: FooterProps;
  /**
   * 侧边栏属性
   */
  siderProps?: SiderProps;
  /**
   * 面包屑属性
   */
  crumbProps?: CrumbProps;
}
