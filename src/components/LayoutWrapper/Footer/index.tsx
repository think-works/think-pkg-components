import { Layout } from "antd";
import cls, { Argument } from "classnames";
import stl from "./index.module.less";

export type FooterProps = {
  className?: Argument;
  children?: React.ReactNode;
};

const Footer = (props: FooterProps) => {
  const { className, children } = props;

  return (
    <Layout.Footer className={cls(stl.footer, className)}>
      {children}
    </Layout.Footer>
  );
};

export default Footer;
