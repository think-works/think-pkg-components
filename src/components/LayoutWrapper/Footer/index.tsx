import { Layout } from "antd";
import cls, { Argument } from "classnames";
import stl from "./index.module.less";

export type FooterProps = {
  className?: Argument;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

const Footer = (props: FooterProps) => {
  const { className, style, children } = props;

  return (
    <Layout.Footer className={cls(stl.footer, className)} style={style}>
      {children}
    </Layout.Footer>
  );
};

export default Footer;
