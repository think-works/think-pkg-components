import cls, { Argument } from "classnames";
import { LayoutTitle } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutQueryProps = {
  className?: Argument;
  style?: React.CSSProperties;
  bordered?: boolean;
  filter?: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: {
    head?: Argument;
    body?: Argument;
    tools?: Argument;
    result?: Argument;
  };
  styles?: {
    head?: React.CSSProperties;
    body?: React.CSSProperties;
    tools?: React.CSSProperties;
    result?: React.CSSProperties;
  };
};

/**
 * 布局查询
 */
export const LayoutQuery = (props: LayoutQueryProps) => {
  const {
    className,
    style,
    bordered,
    filter,
    title,
    action,
    children,
    classNames,
    styles,
  } = props || {};

  return (
    <div className={cls(stl.layoutQuery, className)} style={style}>
      {filter ? (
        <div
          className={cls(stl.head, classNames?.head, {
            [stl.bordered]: bordered,
          })}
          style={styles?.head}
        >
          {filter}
        </div>
      ) : null}
      <div
        className={cls(stl.body, classNames?.body, {
          [stl.bordered]: bordered,
        })}
        style={styles?.body}
      >
        {title || action ? (
          <LayoutTitle
            className={cls(stl.tools, classNames?.tools)}
            style={styles?.tools}
            size="middle"
            title={title}
            extend={action}
          />
        ) : null}
        <div
          className={cls(stl.result, classNames?.result)}
          style={styles?.result}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutQuery;
