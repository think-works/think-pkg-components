import cls, { Argument } from "classnames";
import { LayoutTitle } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutDetailProps = {
  className?: Argument;
  style?: React.CSSProperties;
  clingContent?: boolean;
  crumb?: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
  description?: React.ReactNode;
  statistic?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: {
    head?: Argument;
    body?: Argument;
    extend?: Argument;
    crumb?: Argument;
    title?: Argument;
    action?: Argument;
    description?: Argument;
    statistic?: Argument;
    content?: Argument;
  };
  styles?: {
    head?: React.CSSProperties;
    body?: React.CSSProperties;
    extend?: React.CSSProperties;
    crumb?: React.CSSProperties;
    title?: React.CSSProperties;
    action?: React.CSSProperties;
    description?: React.CSSProperties;
    statistic?: React.CSSProperties;
    content?: React.CSSProperties;
  };
};

/**
 * 布局详情
 */
export const LayoutDetail = (props: LayoutDetailProps) => {
  const {
    className,
    style,
    clingContent,
    crumb,
    title,
    action,
    description,
    statistic,
    children,
    classNames,
    styles,
  } = props || {};

  return (
    <div className={cls(stl.layoutDetail, className)} style={style}>
      <div className={cls(stl.head, classNames?.head)} style={styles?.head}>
        {crumb ? (
          <div
            className={cls(stl.crumb, classNames?.crumb)}
            style={styles?.crumb}
          >
            {crumb}
          </div>
        ) : null}
        {title || action ? (
          <LayoutTitle
            className={cls(stl.title, classNames?.title)}
            style={styles?.title}
            size="large"
            title={title}
            extend={action}
          />
        ) : null}
        <div
          className={cls(stl.extend, classNames?.extend)}
          style={styles?.extend}
        >
          {description ? (
            <div
              className={cls(stl.description, classNames?.description)}
              style={styles?.description}
            >
              {description}
            </div>
          ) : null}
          {statistic ? (
            <div
              className={cls(stl.statistic, classNames?.statistic)}
              style={styles?.statistic}
            >
              {statistic}
            </div>
          ) : null}
        </div>
      </div>
      <div
        className={cls(
          stl.body,
          {
            [stl.cling]: clingContent,
          },
          classNames?.body,
        )}
        style={styles?.body}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutDetail;
