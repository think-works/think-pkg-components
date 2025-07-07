import { Layout } from "antd";
import cls, { Argument } from "classnames";
import Crumb, { CrumbProps } from "./Crumb";
import Footer, { FooterProps } from "./Footer";
import Header, { HeaderProps } from "./Header";
import { useBreadcrumbVisibility, useSiderVisibility } from "./hooks";
import stl from "./index.module.less";
import Sider, { getSiderCfg, SiderProps } from "./Sider";
import { LayoutWrapperSiderMode } from "./type";

export * from "./type";
export * as layoutWrapperUtils from "./utils";
export * as layoutWrapperHooks from "./hooks";

export type LayoutWrapperProps = {
  className?: Argument;
  style?: React.CSSProperties;
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
  /** 页头属性 */
  headerProps?: HeaderProps;
  /** 页脚属性 */
  footerProps?: FooterProps;
  /**  侧边栏属性 */
  siderProps?: SiderProps;
  /** 面包屑属性 */
  crumbProps?: CrumbProps;
  /** 内容属性 */
  containerProps?: {
    className?: Argument;
    style?: React.CSSProperties;
  };
};

/**
 * 页面布局组件
 */
export const LayoutWrapper = (props: LayoutWrapperProps) => {
  const {
    className,
    style,
    children,
    minPageWidth = 1200,
    header,
    footer,
    headerProps,
    footerProps,
    siderProps,
    crumbProps,
    containerProps,
  } = props;
  const { children: headerChildren = header, ...headerRestProps } =
    headerProps || {};
  const { children: footerChildren = footer, ...footerRestProps } =
    footerProps || {};
  const {
    mode: siderMode = LayoutWrapperSiderMode.VERTICAL,
    ...siderRestProps
  } = siderProps || {};

  const { currentWidth = 0 } = getSiderCfg(siderMode);

  const showSider = useSiderVisibility();
  const showBreadcrumb = useBreadcrumbVisibility();

  return (
    <Layout className={cls(stl.layout, className)} style={style}>
      {headerChildren ? (
        <Header
          {...headerRestProps}
          className={cls(stl.header, headerRestProps.className)}
        >
          {headerChildren}
        </Header>
      ) : null}
      <Layout className={stl.body}>
        {showSider ? (
          <Sider
            mode={siderMode}
            {...siderRestProps}
            className={cls(stl.sider, siderRestProps.className)}
          />
        ) : null}
        <Layout.Content className={stl.content}>
          <div
            className={stl.main}
            style={{
              minWidth: minPageWidth - currentWidth,
            }}
          >
            {showBreadcrumb ? (
              <Crumb
                {...crumbProps}
                className={cls(stl.crumb, crumbProps?.className)}
              />
            ) : null}
            <div
              {...containerProps}
              className={cls(stl.container, containerProps?.className)}
            >
              {children}
            </div>
          </div>
        </Layout.Content>
      </Layout>
      {footerChildren ? (
        <Footer
          {...footerRestProps}
          className={cls(stl.footer, footerRestProps.className)}
        >
          {footerChildren}
        </Footer>
      ) : null}
    </Layout>
  );
};

LayoutWrapper.Header = Header;
LayoutWrapper.Footer = Footer;
LayoutWrapper.Crumb = Crumb;
LayoutWrapper.Sider = Sider;

export default LayoutWrapper;
