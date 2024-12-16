import { Layout } from "antd";
import cls from "classnames";
import Crumb from "./Crumb";
import Footer from "./Footer";
import Header from "./Header";
import { useBreadcrumbVisibility, useSiderVisibility } from "./hooks";
import stl from "./index.module.less";
import Sider, { getSiderCfg } from "./Sider";
import { LayoutSiderItemMode, LayoutWrapperProps } from "./type";

export * from "./type";
export * as layoutWrapperUtils from "./utils";
export * as layoutWrapperHooks from "./hooks";

/**
 * 页面布局组件
 */
export const LayoutWrapper = (props: LayoutWrapperProps) => {
  const {
    className,
    children,
    minPageWidth = 1200,
    header,
    footer,
    headerProps,
    footerProps,
    siderProps,
    crumbProps,
  } = props;
  const { children: headerChildren = header, ...headerRestProps } =
    headerProps || {};
  const { children: footerChildren = footer, ...footerRestProps } =
    footerProps || {};
  const { mode: siderMode = LayoutSiderItemMode.VERTICAL, ...siderRestProps } =
    siderProps || {};

  const { collapsed, siderWidth, collapsedWidth } = getSiderCfg(siderMode);
  const currentWidth = (collapsed ? collapsedWidth : siderWidth) || 0;

  const showSider = useSiderVisibility();
  const showBreadcrumb = useBreadcrumbVisibility();

  return (
    <Layout className={cls(stl.layout, className)}>
      {headerChildren ? (
        <Header {...headerRestProps}>{headerChildren}</Header>
      ) : null}
      <Layout
        className={stl.main}
        style={showSider ? { marginLeft: currentWidth } : undefined}
      >
        {showSider ? (
          <Sider className={stl.sider} mode={siderMode} {...siderRestProps} />
        ) : null}
        <Layout.Content
          className={stl.content}
          style={{
            minWidth: minPageWidth - currentWidth,
          }}
        >
          {showBreadcrumb ? <Crumb {...crumbProps} /> : null}
          <div className={stl.container}>{children}</div>
        </Layout.Content>
      </Layout>
      {footerChildren ? (
        <Footer {...footerRestProps}>{footerChildren}</Footer>
      ) : null}
    </Layout>
  );
};

export default LayoutWrapper;
