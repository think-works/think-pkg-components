import { useEffect, useState } from "react";
import { querySize } from "./utils";

export type Placement =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "topLeft"
  | "topRight"
  | "bottomLeft"
  | "bottomRight"
  | "leftTop"
  | "leftBottom"
  | "rightTop"
  | "rightBottom";

export type DraggableParams = {
  /**  容器选择器 */
  selector: string | Element;
  /** 停放位置 */
  placement: Placement;
  /** 持久化存储 Key */
  storage?: string;
  /** 顶部安全区 */
  safeAreaTop?: number;
  /** 底部安全区 */
  safeAreaBottom?: number;
  /** 左侧安全区 */
  safeAreaLeft?: number;
  /** 右侧安全区 */
  safeAreaRight?: number;
  /** 默认高度比例 */
  dftHeightRatio?: number;
  /** 默认宽度比例 */
  dftWidthRatio?: number;
};

/**
 * 在一个确定尺寸的容器中，除安全区域外的剩余空间中，拖拽目标尺寸。
 */
const useDraggable = (params: DraggableParams) => {
  const {
    selector,
    placement,
    storage,
    safeAreaTop = 0,
    safeAreaBottom = 0,
    safeAreaLeft = 0,
    safeAreaRight = 0,
    dftHeightRatio = 0,
    dftWidthRatio = 0,
  } = params;

  const [minHeight, setMinHeight] = useState<number>(0);
  const [maxHeight, setMaxHeight] = useState<number>(Number.MAX_SAFE_INTEGER);
  const [dftHeight, setDftHeight] = useState<number>(0);

  const [minWidth, setMinWidth] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>(Number.MAX_SAFE_INTEGER);
  const [dftWidth, setDftWidth] = useState<number>(0);

  useEffect(() => {
    let container;
    if (typeof selector === "string") {
      container = document.querySelector(selector);
    } else {
      container = selector;
    }

    if (!container) {
      return;
    }

    const { width: storageWidth, height: storageHeight } =
      (storage && querySize(storage)) || {};

    const _placement = placement.toLowerCase();
    const withs = (key: string) => {
      return _placement.startsWith(key) || _placement.endsWith(key);
    };

    // 容器尺寸
    const rect = container.getBoundingClientRect();

    // 可拖拽区域
    const rectHeight = rect.height - safeAreaTop - safeAreaBottom;
    const rectWidth = rect.width - safeAreaLeft - safeAreaRight;

    // 容器比例
    const rectRatioHeight = rect.height * dftHeightRatio;
    const rectRatioWidth = rect.width * dftWidthRatio;

    // 计算高度
    if (withs("top") || withs("bottom")) {
      let _minHeight = 0;
      let _maxHeight = Number.MAX_SAFE_INTEGER;
      let _dftHeight = storageHeight || rectRatioHeight || 0;

      if (withs("top")) {
        _minHeight = safeAreaTop;
        _maxHeight = safeAreaTop + rectHeight;
      }

      if (withs("bottom")) {
        _minHeight = safeAreaBottom;
        _maxHeight = safeAreaBottom + rectHeight;
      }

      // 修正默认高度
      if (_dftHeight <= _minHeight) {
        _dftHeight = _minHeight;
      } else if (_dftHeight >= _maxHeight) {
        _dftHeight = _maxHeight;
      }

      setMinHeight(_minHeight);
      setMaxHeight(_maxHeight);
      setDftHeight(_dftHeight);
    }

    // 计算宽度
    if (withs("left") || withs("right")) {
      let _minWidth = 0;
      let _maxWidth = Number.MAX_SAFE_INTEGER;
      let _dftWidth = storageWidth || rectRatioWidth || 0;

      if (withs("left")) {
        _minWidth = safeAreaLeft;
        _maxWidth = safeAreaLeft + rectWidth;
      }

      if (withs("right")) {
        _minWidth = safeAreaRight;
        _maxWidth = safeAreaRight + rectWidth;
      }

      // 修正默认宽度
      if (_dftWidth <= _minWidth) {
        _dftWidth = _minWidth;
      } else if (_dftWidth >= _maxWidth) {
        _dftWidth = _maxWidth;
      }

      setMinWidth(_minWidth);
      setMaxWidth(_maxWidth);
      setDftWidth(_dftWidth);
    }
  }, [
    selector,
    placement,
    storage,
    safeAreaTop,
    safeAreaBottom,
    safeAreaLeft,
    safeAreaRight,
    dftHeightRatio,
    dftWidthRatio,
  ]);

  return {
    /** 目标最小高度 */
    minHeight,
    /** 目标最大高度 */
    maxHeight,
    /** 目标默认高度 */
    dftHeight,

    /** 目标最小宽度 */
    minWidth,
    /** 目标最大宽度 */
    maxWidth,
    /** 目标默认宽度 */
    dftWidth,
  };
};

export default useDraggable;
