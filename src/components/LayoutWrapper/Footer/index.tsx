import { Layout } from "antd";
import cls, { Argument } from "classnames";
import stl from "./index.module.less";

/**
 * 页脚扩展类名
 */
const footerExtendClass = `Layout-Footer-Extend-${Date.now()}`;
export type FooterProps = {
  className?: Argument;
};

const Footer = (props: FooterProps) => {
  const { className } = props;

  return (
    <Layout.Footer className={cls(stl.footer, className, footerExtendClass)} />
  );
};

export default Footer;
