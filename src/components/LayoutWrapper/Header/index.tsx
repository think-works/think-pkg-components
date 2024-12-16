import { Layout } from "antd";
import cls, { Argument } from "classnames";
import stl from "./index.module.less";

export type HeaderProps = {
  className?: Argument;
  children?: React.ReactNode;
};

const Header = (props: HeaderProps) => {
  const { className, children } = props;

  return (
    <Layout.Header className={cls(stl.header, className)}>
      {children}
    </Layout.Header>
  );
};

export default Header;
