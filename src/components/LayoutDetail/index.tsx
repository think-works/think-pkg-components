import cls, { Argument } from "classnames";
import { LayoutTitle } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutDetailProps = {
  className?: Argument;
  style?: React.CSSProperties;
  /** 头部分割线 */
  divider?: boolean;
  /** 内容区域紧贴头部 */
  clingContent?: boolean;
  /**
   * 内容区域高度自适应。
   * 若内容高度低于所在 flex 容器剩余空间则自动撑满，若超过则出现滚动条。
   * 要求内容区域所在 flex 容器必须指定高度，或者其父容器也是 flex 容器。
   */
  overflowContent?: boolean;
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
    divider = true,
    clingContent,
    overflowContent,
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
      <div
        className={cls(stl.head, classNames?.head, {
          [stl.divider]: divider,
        })}
        style={styles?.head}
      >
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
            [stl.overflow]: overflowContent,
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
