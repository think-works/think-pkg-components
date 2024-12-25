import classNames from "classnames";
import React from "react";
import { ReactComponent as ArrowSvg } from "./arrow.svg";
import stl from "./index.module.less";

interface StatisticsProps {
  /**
   * @description 标题
   */
  title: string;
  /**
   * @description 数值
   */
  value: number;
  /**
   * @description 图标
   */
  logo: React.ReactNode;
  /**
   * @description logo 阴影颜色
   */
  shadowColor: string;
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
  const { logo, title, value, shadowColor, onJump } = props;
  return (
    <div
      className={classNames(stl.detailStatics, onJump && stl.canJump)}
      onClick={onJump}
    >
      <div className={stl.staticsImage}>
        {logo}
        <div className={stl.shadowBox} style={{ background: shadowColor }} />
      </div>
      <div className={stl.staticsItem}>
        <div className={stl.staticsItemTitle}>{value}</div>
        <div className={stl.staticsItemContent}>
          {title}
          {onJump && <ArrowSvg fill="#FFF" style={{ marginLeft: 4 }} />}
        </div>
      </div>
    </div>
  );
};
