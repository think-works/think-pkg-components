import { Layout } from "antd";
import cls, { Argument } from "classnames";
import stl from "./index.module.less";

export type HeaderProps = {
  className?: Argument;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const Header = (props: HeaderProps) => {
  const { className, style, children } = props;

  return (
    <Layout.Header className={cls(stl.header, className)} style={style}>
      {children}
    </Layout.Header>
  );
};

export default Header;
