import { Tooltip, TooltipProps } from "antd";
import classNames from "classnames";
import style from "./index.module.less";
import "./static/iconfont/iconfont";
import "./static/iconfont/iconfont.css";

interface Props
  extends React.HTMLAttributes<HTMLSpanElement | HTMLOrSVGElement> {
  mode?: "font" | "svg";
  type: string;
  disabled?: boolean;
  tooltip?: TooltipProps;
}

const XIcon = (props: Props) => {
  const node =
    props.mode !== "svg" ? (
      <i
        {...props}
        className={classNames([
          style["font-icon"],
          `tree-icon-${props.type}`,
          { [style.disabled]: props.disabled },
          props.className,
        ])}
      />
    ) : (
      <svg
        {...props}
        className={classNames([
          style["svg-icon"],
          { [style.disabled]: props.disabled },
          props.className,
        ])}
        aria-hidden="true"
      >
        <use xlinkHref={`#tree-icon-${props.type}`} />
      </svg>
    );
  if (props.tooltip) {
    return <Tooltip {...props.tooltip}>{node}</Tooltip>;
  }
  return node;
};

export default XIcon;
