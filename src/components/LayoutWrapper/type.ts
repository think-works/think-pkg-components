import { FooterProps } from "./Footer";

/**
 * 权限组合模式
 */
export type AuthCombineMode = "OR" | "AND";
/**
 * 路由权限
 */
export type RouteAuth = string | number | (string | number)[];
export interface ExtendRouteMeta extends Record<string, any> {
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
  /**
   * 页面顶部
   */
  header?: React.ReactNode;
  /**
   * 页面内容
   */
  children: React.ReactNode;
  /**
   * 页面内容配置参数
   * @description 配置参数在非自定义 content 时生效
   */
  childrenProps?: {
    /**
     * 页面内容最小宽度
     * @default 1200
     */
    minFullWidth?: number;
    /*
     * 面包屑模式
     * title 标题模式
     */
    crumbMode?: "title";
  };
  /**
   * 页面底部
   */
  footer?: React.ReactNode;
  /**
   * 页面底部配置参数
   * @description 配置参数在非自定义 footer 时生效
   */
  footerProps?: FooterProps;
  /**
   * 页面侧边栏
   * @description 侧边栏内容 默认使用组件内侧边栏
   */
  sider?: React.ReactNode;
  /**
   * 侧边栏配置参数
   * @description 配置参数在非自定义 sider 时生效
   */
  siderProps?: {
    /**
     * 侧边栏宽度
     * @default 160
     */
    siderWidth?: number;
    /**
     * 侧边栏收缩宽度
     * @default theme.styleConfig.bizLayoutHeader
     */
    collapsedWidth?: number;
    /**
     * 自定义菜单上方内容
     */
    siderMenuTop?: React.ReactNode;
    /**
     * 自定义菜单下方内容
     */
    siderMenuBottom?: React.ReactNode;
  };
}
