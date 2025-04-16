import { theme } from "antd";
import cls, { Argument } from "classnames";
import { LayoutTitle, LayoutTitleSize } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutDetailProps = {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    head?: Argument;
    body?: Argument;
    crumb?: Argument;
    content?: Argument;
    main?: Argument;
    statistic?: Argument;
    title?: Argument;
    description?: Argument;
  };
  styles?: {
    head?: React.CSSProperties;
    body?: React.CSSProperties;
    crumb?: React.CSSProperties;
    content?: React.CSSProperties;
    main?: React.CSSProperties;
    statistic?: React.CSSProperties;
    title?: React.CSSProperties;
    description?: React.CSSProperties;
  };
  /** 标题尺寸 */
  titleSize?: LayoutTitleSize;
  /** 头部分割线 */
  divider?: boolean;
  /** 无内边距 */
  rimless?: boolean;
  /** 内容区域紧贴头部 */
  cling?: boolean;
  /**
   * 内容区域高度自适应。
   * 若内容高度低于所在 flex 容器剩余空间则自动撑满，若超过则出现滚动条。
   * 要求内容区域所在 flex 容器必须指定高度，或者其父容器也是 flex 容器。
   */
  overflow?: boolean;
  /** 标题 */
  title?: React.ReactNode;
  /** 扩展 */
  extend?: React.ReactNode;
  /** 面包屑 */
  crumb?: React.ReactNode;
  /** 操作 */
  action?: React.ReactNode;
  /** 描述 */
  description?: React.ReactNode;
  /** 统计 */
  statistic?: React.ReactNode;
  /** 实体配色 */
  entityColor?: React.CSSProperties["color"] | false;
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
    cling,
    overflow,
    title,
    extend,
    crumb,
    action,
    description,
    statistic,
    entityColor,
    children,
  } = props || {};

  const { token } = theme.useToken();
  const startColor = entityColor ?? token.colorPrimaryBgHover;
  const endColor = token.colorBgContainer;

  const topBar = crumb || action;
  const entityBg =
    topBar && startColor
      ? `linear-gradient(${startColor} 0%, ${endColor} 50%)`
      : undefined;

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
          [stl.topBar]: topBar,
          [stl.entityBg]: entityBg,
        })}
        style={{
          background: entityBg,
          ...(styles?.head || {}),
        }}
      >
        {topBar ? (
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
          {title || extend || description ? (
            <div
              className={cls(stl.main, classNames?.main)}
              style={styles?.main}
            >
              {title || extend ? (
                <LayoutTitle
                  className={cls(stl.title, classNames?.title)}
                  style={styles?.title}
                  size={titleSize}
                  title={title}
                  extend={extend}
                />
              ) : null}
              {description ? (
                <div
                  className={cls(stl.description, classNames?.description)}
                  style={styles?.description}
                >
                  {description}
                </div>
              ) : null}
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
          [stl.cling]: cling,
          [stl.overflow]: overflow,
        })}
        style={styles?.body}
      >
        {children}
      </div>
    </div>
  );
};

export default LayoutDetail;
