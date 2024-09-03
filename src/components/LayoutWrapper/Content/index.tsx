import { Layout } from "antd";
import cls, { Argument } from "classnames";
import { useBreadcrumbVisibility } from "../hooks";
import Crumb from "./Crumb";
import stl from "./index.module.less";

export type ContentProps = {
  className?: Argument;
  collapsed?: boolean;
  children?: React.ReactNode;
  crumbMode?: "title";
  siderWidth: number;
  minFullWidth: number;
  collapsedWidth: number;
};

const Content = (props: ContentProps) => {
  const {
    className,
    collapsed,
    minFullWidth,
    collapsedWidth,
    crumbMode,
    siderWidth,
    children,
  } = props;
  const showBreadcrumb = useBreadcrumbVisibility();

  return (
    <Layout.Content
      className={cls(stl.content, className)}
      style={{
        minWidth: minFullWidth - (collapsed ? collapsedWidth : siderWidth),
      }}
    >
      {showBreadcrumb ? (
        <Crumb className={stl.defaultCrumb} crumbMode={crumbMode} />
      ) : null}
      <div className={stl.container}>{children}</div>
    </Layout.Content>
  );
};

export default Content;
