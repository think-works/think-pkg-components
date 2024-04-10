import cls, { Argument } from "classnames";
import LayoutTitle, { LayoutTitleProps } from "../LayoutTitle";
import stl from "./index.module.less";

export type LayoutPanelProps = LayoutTitleProps & {
  className?: Argument;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  stickyTitle?: boolean;
  clingContent?: boolean;
  classNames?: {
    title?: Argument;
    content?: Argument;
  };
  styles?: {
    title?: React.CSSProperties;
    content?: React.CSSProperties;
  };
};

/**
 * 布局面板
 */
const LayoutPanel = (props: LayoutPanelProps) => {
  const {
    className,
    style,
    children,
    stickyTitle,
    clingContent,
    title,
    extend,
    divider,
    classNames,
    styles,
    ...rest
  } = props || {};
  const cling = clingContent ?? !divider;

  return (
    <div className={cls(stl.layoutPanel, className)} style={style}>
      {title || extend ? (
        <LayoutTitle
          className={cls(
            stl.title,
            {
              [stl.sticky]: stickyTitle,
            },
            classNames?.title,
          )}
          style={styles?.title}
          size="large"
          title={title}
          extend={extend}
          divider={divider}
          {...rest}
        />
      ) : null}
      {children ? (
        <div
          className={cls(
            stl.content,
            {
              [stl.cling]: cling,
            },
            classNames?.content,
          )}
          style={styles?.content}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default LayoutPanel;
