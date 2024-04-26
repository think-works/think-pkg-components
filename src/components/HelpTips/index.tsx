import { Tooltip } from "antd";
import cls, { Argument } from "classnames";
import React from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import type { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import stl from "./index.module.less";

export type HelpTipsProps = AntdIconProps & {
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
      <QuestionCircleOutlined
        className={cls(stl.helpTips, className)}
        {...rest}
      />
    </Tooltip>
  );
};

export default HelpTips;
