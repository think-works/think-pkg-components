import cls, { Argument } from "classnames";
import { HTMLAttributes, useCallback, useEffect, useRef } from "react";
import { useComponentsLocale } from "@/i18n/hooks";
import stl from "./index.module.less";
import { querySize, updateSize } from "./utils";

export type Mouse = {
  /** 激活状态 */
  a?: boolean;
  /** 宽度 */
  w?: number;
  /** 高度 */
  h?: number;
  /** 横坐标 */
  x?: number;
  /** 纵坐标 */
  y?: number;
};

export type Size = {
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
};

export type DragHandlerProps = HTMLAttributes<HTMLDivElement> & {
  className?: Argument;
  /** 持久化存储 Key */
  storage?: string;
  /**
   * 逆转差值变更
   * false 与页面坐标 x/y 轴方向一致(拖拽面板在拖拽容器上方/左侧，拖拽把手在拖拽面板底部/右侧)
   * true 与页面坐标 x/y 轴方向相反(拖拽面板在拖拽容器下方/右侧，拖拽把手在拖拽面板顶部/左侧)
   */
  reverse?: boolean;
  /**
   * 目标拖拽方式
   * row 上下拖拽调整高度
   * col 左右拖拽调整宽度
   */
  resize?: "row" | "col";
  /** 目标默认尺寸 */
  dftSize?: Size;
  /** 目标最小尺寸 */
  minSize?: Size;
  /** 目标最大尺寸 */
  maxSize?: Size;
  /** 目标尺寸变更 */
  onChange?: (size: Size) => void;
  /** 拖拽状态变更 */
  onDragging?: (dragging: boolean) => void;
};

/**
 * 拖拽手柄
 */
const DragHandler = (props: DragHandlerProps) => {
  const {
    className,
    children,
    storage,
    reverse,
    resize,
    dftSize,
    minSize = {
      width: 0,
      height: 0,
    },
    maxSize = {
      width: Number.MAX_SAFE_INTEGER,
      height: Number.MAX_SAFE_INTEGER,
    },
    onChange,
    onDragging,
    ...rest
  } = props;
  const { width: minWidth, height: minHeight } = minSize || {};
  const { width: maxWidth, height: maxHeight } = maxSize || {};

  const { locale } = useComponentsLocale();

  // 查询持久化值
  const query = useCallback(() => {
    if (storage) {
      return querySize(storage);
    }
  }, [storage]);

  // 更新持久化值
  const update = useCallback(
    (size: Size) => {
      if (storage) {
        updateSize(storage, size);
      }
    },
    [storage],
  );

  // 修正当前值
  const amend = useCallback(
    (size: Size): Size => {
      const { width, height } = size;

      let w = width;
      let h = height;

      if (Number(width) < Number(minWidth)) {
        w = minWidth;
      } else if (Number(width) > Number(maxWidth)) {
        w = maxWidth;
      }

      if (Number(height) < Number(minHeight)) {
        h = minHeight;
      } else if (Number(height) > Number(maxHeight)) {
        h = maxHeight;
      }

      return {
        width: w,
        height: h,
      };
    },
    [minWidth, maxWidth, minHeight, maxHeight],
  );

  // 优先使用持久化值
  const { width: dftWidth, height: dftHeight } = amend(
    query() || dftSize || minSize,
  );

  // 修正后的默认尺寸
  const refWidth = useRef<number | undefined>(dftWidth);
  const refHeight = useRef<number | undefined>(dftHeight);

  const refMouse = useRef<Mouse>({});

  const handleMouseMove = useCallback(
    (e: any) => {
      const curr = refMouse.current;
      const { a, w, h, x, y } = curr;

      if (!a) {
        return;
      }

      // 计算偏移量
      const dx = e.clientX - Number(x);
      const dy = e.clientY - Number(y);

      // 计算新尺寸
      const { width: nw, height: nh } = amend({
        width: w && (reverse ? w - dx : w + dx),
        height: h && (reverse ? h - dy : h + dy),
      });

      // 记录当前尺寸
      refWidth.current = nw;
      refHeight.current = nh;

      // 无变化时忽略
      if (w === nw && h === nh) {
        return;
      }

      const ns = {
        width: nw,
        height: nh,
      };

      update(ns);

      if (onChange) {
        onChange(ns);
      }
    },
    [reverse, amend, update, onChange],
  );

  const handleMouseUp = useCallback(() => {
    const curr = refMouse.current;

    // 重置起点位置
    curr.a = false;
    curr.w = undefined;
    curr.h = undefined;
    curr.x = undefined;
    curr.y = undefined;

    document.documentElement.style.webkitUserSelect = "";
    document.documentElement.style.userSelect = "";

    if (onDragging) {
      onDragging(false);
    }
  }, [onDragging]);

  const handleMouseDown = useCallback(
    (e: any) => {
      const curr = refMouse.current;

      // 记录起点位置
      curr.a = true;
      curr.w = refWidth.current;
      curr.h = refHeight.current;
      curr.x = e.clientX;
      curr.y = e.clientY;

      document.documentElement.style.webkitUserSelect = "none";
      document.documentElement.style.userSelect = "none";

      if (onDragging) {
        onDragging(true);
      }
    },
    [onDragging],
  );

  const handleDoubleClick = useCallback(() => {
    let ns = {
      width: refWidth.current,
      height: refHeight.current,
    };

    // 最大化/最小化
    if (
      Number(ns.width) < Number(maxWidth) ||
      Number(ns.height) < Number(maxHeight)
    ) {
      ns = {
        width: maxWidth,
        height: maxHeight,
      };
    } else if (
      Number(ns.width) > Number(minWidth) ||
      Number(ns.height) > Number(minHeight)
    ) {
      ns = {
        width: minWidth,
        height: minHeight,
      };
    }

    refWidth.current = ns.width;
    refHeight.current = ns.height;

    update(ns);

    if (onChange) {
      onChange(ns);
    }
  }, [update, minWidth, maxWidth, minHeight, maxHeight, onChange]);

  // 事件监听和移除
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp, {
      passive: true,
    });
    document.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);

  // 使用持久化值触发一次 onChange
  useEffect(() => {
    let size = query();

    if (!size) {
      return;
    }

    size = amend(size);

    if (onChange) {
      onChange(size);
    }
  }, [query, amend, onChange]);

  return (
    <div
      className={cls(
        stl.dragHandler,
        {
          [stl.row]: resize === "row",
          [stl.col]: resize === "col",
          [stl.reverse]: reverse,
        },
        className,
      )}
      title={
        resize === "row"
          ? locale.DragContainer.verticalDragTip
          : resize === "col"
            ? locale.DragContainer.horizontalDragTip
            : ""
      }
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      {...rest}
    >
      {children}
    </div>
  );
};

export default DragHandler;
