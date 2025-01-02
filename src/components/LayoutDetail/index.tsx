import cls, { Argument } from "classnames";
import { LayoutTitle, LayoutTitleSize } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutDetailProps = {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    head?: Argument;
    body?: Argument;
    extend?: Argument;
    crumb?: Argument;
    title?: Argument;
    action?: Argument;
    description?: Argument;
    statistic?: Argument;
    main?: Argument;
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
    main?: React.CSSProperties;
    content?: React.CSSProperties;
  };
  /** 标题尺寸 */
  titleSize?: LayoutTitleSize;
  /** 分割线 */
  divider?: boolean;
  /** 无内边距 */
  rimless?: boolean;
  /** 内容区域紧贴头部 */
  clingContent?: boolean;
  /**
   * 内容区域高度自适应。
   * 若内容高度低于所在 flex 容器剩余空间则自动撑满，若超过则出现滚动条。
   * 要求内容区域所在 flex 容器必须指定高度，或者其父容器也是 flex 容器。
   */
  overflowContent?: boolean;
  crumb?: React.ReactNode;
  /** 标题 */
  title?: React.ReactNode;
  /** 标题扩展区域 */
  titleExtend?: React.ReactNode;
  action?: React.ReactNode;
  description?: React.ReactNode;
  statistic?: React.ReactNode;
  children?: React.ReactNode;
};

/**
 * 详情布局
 */
export const LayoutDetail = (props: LayoutDetailProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    titleSize = "middle",
    divider = true,
    rimless,
    clingContent,
    overflowContent,
    crumb,
    title,
    titleExtend,
    action,
    description,
    statistic,
    children,
  } = props || {};

  return (
    <div
      className={cls(stl.layoutDetail, className, {
        [stl.rimless]: rimless,
      })}
      style={style}
    >
      <div
        className={cls(stl.head, classNames?.head, {
          [stl.divider]: divider,
        })}
        style={styles?.head}
      >
        {crumb || action ? (
          <div
            className={cls(stl.crumb, classNames?.crumb)}
            style={styles?.crumb}
          >
            <div>{crumb}</div>
            <div>{action}</div>
          </div>
        ) : null}
        <div
          className={cls(stl.content, classNames?.content)}
          style={styles?.content}
        >
          {title || description || titleExtend ? (
            <div
              className={cls(stl.main, classNames?.main)}
              style={styles?.main}
            >
              {title || titleExtend ? (
                <LayoutTitle
                  className={cls(stl.title, classNames?.title)}
                  style={styles?.title}
                  size={titleSize}
                  title={title}
                  extend={titleExtend}
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
              </div>
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
        className={cls(stl.body, classNames?.body, {
          [stl.cling]: clingContent,
          [stl.overflow]: overflowContent,
        })}
        style={styles?.body}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutDetail;
