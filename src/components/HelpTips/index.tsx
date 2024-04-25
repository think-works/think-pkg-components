import { Tooltip } from "antd";
import cls, { Argument } from "classnames";
import React, { HTMLAttributes } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import stl from "./index.module.less";

export type HelpTipsProps = HTMLAttributes<HTMLSpanElement> & {
  className?: Argument;
  style?: React.CSSProperties;
  /** 提示内容 */
  tips?: React.ReactNode;
};

/**
 * 问号提示
 */
export const HelpTips = (props: HelpTipsProps) => {
  const { className, tips, ...rest } = props;

  return (
    <Tooltip title={tips}>
      <span className={cls(stl.helpTips, className)} {...rest}>
        <QuestionCircleOutlined />
      </span>
    </Tooltip>
  );
};

export default HelpTips;
