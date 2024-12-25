import classNames from "classnames";
import React, { useMemo } from "react";
import { separator } from "@/utils/human";
import { ReactComponent as ArrowSvg } from "./arrow.svg";
import stl from "./index.module.less";

interface StatisticsProps {
  /**
   * @description 标题
   */
  title: string;
  /**
   * @description 值
   */
  value: string | number | React.ReactNode;
  /**
   * @description 值样式
   */
  valueStyle?: React.CSSProperties;
  /**
   * @description 图标
   */
  icon: React.ReactNode;
  /**
   * @description icon 阴影颜色
   */
  shadowColor?: string;
  /**
   * 跳转事件
   * @returns
   */
  onJump?: () => void;
}

/**
 * 统计卡片
 * @param props
 * @returns
 */
export const StatisticsCard = (props: StatisticsProps) => {
  const { icon, title, value, valueStyle, shadowColor, onJump } = props;

  const realValue = useMemo(() => {
    if (typeof value === "number") {
      return separator(value);
    }
    return value;
  }, [value]);

  return (
    <div
      className={classNames(stl.detailStatics, onJump && stl.canJump)}
      onClick={onJump}
    >
      <div className={stl.staticsImage}>
        {icon}
        <div className={stl.shadowBox} style={{ background: shadowColor }} />
      </div>
      <div className={stl.staticsItem}>
        <div className={stl.staticsItemValue} style={valueStyle}>
          {realValue}
        </div>
        <div className={stl.staticsItemContent}>
          {title}
          {onJump && <ArrowSvg fill="#FFF" style={{ marginLeft: 4 }} />}
        </div>
      </div>
    </div>
  );
};
