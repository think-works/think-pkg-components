import { Layout } from "antd";
import { useCallback, useState } from "react";
import { theme } from "@/common/_export";
import { appLayoutConfigKey, queryLocal, updateLocal } from "@/utils/storage";
import Content from "./Content";
import Footer from "./Footer";
import { useSiderVisibility } from "./hooks";
import stl from "./index.module.less";
import Sider from "./Sider";
import { LayoutWrapperProps } from "./type";

const storageVal = queryLocal(appLayoutConfigKey);
const defaultCollapsed = storageVal?.collapsed || false;

export const LayoutWrapper = (props: LayoutWrapperProps) => {
  const { children, header, sider, childrenProps, footer, siderProps } = props;
  const { minFullWidth = 1200, crumbMode } = childrenProps || {};
  const {
    siderWidth = 160,
    collapsedWidth = theme.styleConfig.bizLayoutHeader,
    renderMenuTop,
    renderMenuBottom,
  } = siderProps || {};
  const showSider = useSiderVisibility();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const handleCollapse = useCallback((val: boolean) => {
    setCollapsed(val);

    updateLocal(appLayoutConfigKey, {
      collapsed: val,
    });
  }, []);

  let innerSider: React.ReactNode = (
    <Sider
      className={stl.sider}
      collapsed={collapsed}
      siderWidth={siderWidth}
      collapsedWidth={collapsedWidth}
      onCollapse={handleCollapse}
      renderMenuTop={renderMenuTop}
      renderMenuBottom={renderMenuBottom}
    />
  );
  // 如果传入了自定义侧边栏，则使用自定义侧边栏
  if (sider) {
    innerSider = sider;
  }

  return (
    <Layout className={stl.layout}>
      {header}
      <Layout
        className={stl.main}
        style={
          showSider
            ? {
                marginLeft: collapsed ? collapsedWidth : siderWidth,
              }
            : undefined
        }
      >
        {showSider ? innerSider : undefined}
        <Content
          crumbMode={crumbMode}
          className={stl.content}
          siderWidth={siderWidth}
          minFullWidth={minFullWidth}
          collapsedWidth={collapsedWidth}
        >
          {children}
        </Content>
      </Layout>
      {footer ? footer : <Footer className={stl.footer} />}
    </Layout>
  );
};
export * as layoutWrapperUtils from "./utils";
export * as layoutWrapperHooks from "./hooks";
export * from "./type";
export default LayoutWrapper;
