import cls, { Argument } from "classnames";
import { LayoutTitle } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutSimpleProps = {
  className?: Argument;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  extend?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: {
    head?: Argument;
    body?: Argument;
  };
  styles?: {
    head?: React.CSSProperties;
    body?: React.CSSProperties;
  };
};

/**
 * 简单布局
 */
export const LayoutSimple = (props: LayoutSimpleProps) => {
  const { className, style, title, extend, children, classNames, styles } =
    props || {};

  return (
    <div
      className={cls(stl.layoutSimple, className, {
        [stl.showTitle]: title || extend,
      })}
      style={style}
    >
      {title || extend ? (
        <LayoutTitle
          className={cls(stl.head, classNames?.head)}
          style={styles?.head}
          size="middle"
          title={title}
          extend={extend}
        />
      ) : null}
      <div className={cls(stl.body, classNames?.body)} style={styles?.body}>
        {children}
      </div>
    </div>
  );
};

export default LayoutSimple;
