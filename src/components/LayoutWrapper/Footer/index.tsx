import { Layout } from "antd";
import cls, { Argument } from "classnames";
import { footerExtendClass } from "../utils";
import stl from "./index.module.less";

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
