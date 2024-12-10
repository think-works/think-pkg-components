import { Layout } from "antd";
import { useMemo } from "react";
import Content from "./Content";
import Crumb from "./Content/Crumb";
import Footer from "./Footer";
import { useSiderVisibility } from "./hooks";
import stl from "./index.module.less";
import Sider from "./Sider";
import { LayoutSiderItemMode, LayoutWrapperProps } from "./type";

const HORIZONTAL_WIDTH = 192;
const VERTICAL_WIDTH = 70;

/**
 * 页面布局组件
 * @param props
 * @returns
 */
const LayoutWrapper = (props: LayoutWrapperProps) => {
  const { children, header, sider, childrenProps, footer, siderProps } = props;
  const { minFullWidth = 1200, crumbMode } = childrenProps || {};
  const {
    mode = LayoutSiderItemMode.VERTICAL,
    renderSiderWidth,
    renderMenuTop,
    renderMenuBottom,
  } = siderProps || {};
  const showSider = useSiderVisibility();

  const siderWidth = useMemo(() => {
    if (renderSiderWidth) {
      return renderSiderWidth(mode);
    }
    if (mode === LayoutSiderItemMode.HORIZONTAL) {
      return HORIZONTAL_WIDTH;
    }
    return VERTICAL_WIDTH;
  }, [mode, renderSiderWidth]);

  const collapsed = useMemo(() => {
    if (mode === LayoutSiderItemMode.HORIZONTAL) {
      return false;
    }
    return true;
  }, [mode]);

  let innerSider: React.ReactNode = (
    <Sider
      mode={mode}
      className={stl.sider}
      collapsed={collapsed}
      siderWidth={siderWidth}
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
                marginLeft: siderWidth,
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
        >
          {children}
        </Content>
      </Layout>
      {footer ? footer : <Footer className={stl.footer} />}
    </Layout>
  );
};

LayoutWrapper.Crumb = Crumb;

export { LayoutWrapper };
