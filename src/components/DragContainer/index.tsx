import cls, { Argument } from "classnames";
import {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { useThrottle } from "@/hooks";
import DraggingIcon from "./DraggingIcon";
import DragHandler, { DragHandlerProps, Size } from "./DragHandler";
import stl from "./index.module.less";
import useDraggable, { DraggableParams } from "./useDraggable";

type Placement = "top" | "bottom" | "left" | "right";

export type DragContainerProps = HTMLAttributes<HTMLDivElement> & {
  /** 容器样式 */
  className?: Argument;
  /** 面板样式 */
  panelClassName?: Argument;
  /** 手柄样式 */
  handlerClassName?: Argument;
  /** 持久化存储 Key */
  storage?: string;
  /** 停放位置 */
  placement: Placement;
  /** 容器子节点 */
  children?: ReactNode;
  /** 面板子节点 */
  panelChildren?: ReactNode;
  /** 拖拽防抖 */
  dragThrottle?: number;
  draggableParams?: Partial<DraggableParams>;
  dragHandlerProps?: Partial<DragHandlerProps>;
};

/**
 * 拖拽容器
 */
export const DragContainer = (props: DragContainerProps) => {
  const {
    className,
    panelClassName,
    handlerClassName,
    storage,
    placement,
    children,
    panelChildren,
    dragThrottle,
    draggableParams,
    dragHandlerProps,
    ...rest
  } = props;
  const isResizeRow = placement === "top" || placement === "bottom";
  const isResizeCol = placement === "left" || placement === "right";
  const isReverse = placement === "bottom" || placement === "right";

  const refContainer = useRef<HTMLDivElement>(null);
  const [curWidth, setCurWidth] = useState<number>(0);
  const [curHeight, setCurHeight] = useState<number>(0);

  const { minWidth, minHeight, maxWidth, maxHeight, dftWidth, dftHeight } =
    useDraggable({
      selector: refContainer.current!,
      placement,
      storage,
      ...draggableParams,
    });

  const panelWidth = curWidth || dftWidth || draggableParams?.safeAreaLeft;
  const panelHeight = curHeight || dftHeight || draggableParams?.safeAreaBottom;

  const handleDragChange = useThrottle(
    useCallback(
      (size: Size) => {
        const width = size.width || minWidth;
        const height = size.height || minHeight;
        setCurWidth(width);
        setCurHeight(height);
      },
      [minHeight, minWidth],
    ),
    dragThrottle || 100,
  );

  let dragHandler;
  if (isResizeRow) {
    dragHandler = (
      <DragHandler
        key={dftHeight} // 算出默认值后强制销毁重建
        className={cls(stl.dragHandler, handlerClassName)}
        resize="row"
        reverse={isReverse}
        storage={storage}
        dftSize={{ height: dftHeight }}
        minSize={{ height: minHeight }}
        maxSize={{ height: maxHeight }}
        onChange={handleDragChange}
        {...dragHandlerProps}
      />
    );
  } else if (isResizeCol) {
    dragHandler = (
      <DragHandler
        key={dftWidth} // 算出默认值后强制销毁重建
        className={cls(stl.dragHandler, handlerClassName)}
        resize="col"
        reverse={isReverse}
        storage={storage}
        dftSize={{ width: dftWidth }}
        minSize={{ width: minWidth }}
        maxSize={{ width: maxWidth }}
        onChange={handleDragChange}
        {...dragHandlerProps}
      />
    );
  }

  return (
    <div
      className={cls(
        stl.dragContainer,
        {
          [stl.row]: isResizeRow,
          [stl.col]: isResizeCol,
          [stl.reverse]: isReverse,
        },
        className,
      )}
      ref={refContainer}
      {...rest}
    >
      <div
        className={cls(stl.dragPanel, panelClassName)}
        style={{ width: panelWidth, height: panelHeight }}
      >
        {panelChildren}
        {dragHandler}
      </div>
      <div className={stl.normalPanel}>{children}</div>
    </div>
  );
};

DragContainer.DraggingIcon = DraggingIcon;
DragContainer.DragHandler = DragHandler;
DragContainer.useDraggable = useDraggable;

export default DragContainer;
