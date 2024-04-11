import cls, { Argument } from "classnames";
import { HTMLAttributes } from "react";
import { ReactComponent as IconCol } from "./assets/col.svg";
import { ReactComponent as IconRow } from "./assets/row.svg";
import stl from "./index.module.less";

export type DraggingIconProps = HTMLAttributes<HTMLDivElement> & {
  className?: Argument;
  /**
   * 目标拖拽方式
   * row 上下拖拽调整高度
   * col 左右拖拽调整宽度
   */
  resize?: "row" | "col";
};

/**
 * 拖拽中图标
 */
const DraggingIcon = (props: DraggingIconProps) => {
  const { className, resize, ...rest } = props;

  let node;
  if (resize === "row") {
    node = <IconRow className={stl.icon} />;
  } else if (resize === "col") {
    node = <IconCol className={stl.icon} />;
  }

  return (
    <div className={cls(stl.draggingIcon, className)} {...rest}>
      {node}
    </div>
  );
};

export default DraggingIcon;
