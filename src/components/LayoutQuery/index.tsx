import cls, { Argument } from "classnames";
import stl from "./index.module.less";

export type LayoutQueryProps = {
  className?: Argument;
  style?: React.CSSProperties;
  filter?: React.ReactNode;
  title?: React.ReactNode;
  action?: React.ReactNode;
  result?: React.ReactNode;
};

const LayoutQuery = (props: LayoutQueryProps) => {
  const { className, style, filter, title, action, result } = props || {};

  return (
    <div className={cls(stl.layoutQuery, className)} style={style}>
      {filter ? <div className={stl.filter}>{filter}</div> : null}
      {title || action ? (
        <div className={stl.tools}>
          <div className={stl.title}>{title}</div>
          <div className={stl.action}>{action}</div>
        </div>
      ) : null}
      {result ? <div className={stl.result}>{result}</div> : null}
    </div>
  );
};

export default LayoutQuery;
