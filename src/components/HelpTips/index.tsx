import { Tooltip } from "antd";
import classNames from "classnames";
import React from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./style.module.less";

export interface HelpTipsProps {
  /**
   * 提示内容
   */
  tips?: string | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
/**
 * 问号提示
 * @param props
 * @returns
 */
const HelpTips = (props: HelpTipsProps) => {
  const { tips, style, className } = props;
  return (
    <Tooltip title={tips}>
      <span className={classNames(styles.helpIcon, className)} style={style}>
        <QuestionCircleOutlined />
      </span>
    </Tooltip>
  );
};

export default HelpTips;
