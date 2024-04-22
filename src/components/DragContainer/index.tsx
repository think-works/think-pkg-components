import cls, { Argument } from "classnames";
import {
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
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
  /** 子组件样式 */
  classNames?: {
    dragHandler?: Argument;
    dragPanel?: Argument;
    contentPanel?: Argument;
  };
  /** 持久化存储 Key */
  storage?: string;
  /** 停放位置 */
  placement: Placement;
  /** 容器子节点 */
  children?: ReactNode;
  /** 拖拽面板子节点 */
  dragPanelChildren?: ReactNode;
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
    classNames,
    storage,
    placement,
    children,
    dragPanelChildren,
    dragThrottle,
    draggableParams,
    dragHandlerProps,
    ...rest
  } = props;

  const isResizeRow = placement === "top" || placement === "bottom";
  const isResizeCol = placement === "left" || placement === "right";
  const isReverse = placement === "bottom" || placement === "right";

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    /**
     * 因为 hooks 会在 render 阶段执行，而 ref 会在 commit 阶段赋值。
     * 因此初次执行 useDraggable 时 refContainer.current 为无效值。
     * 如果当前组件或祖先组件没有后续状态更新， useDraggable 就无法再次执行。
     * https://react.dev/learn/manipulating-the-dom-with-refs#when-react-attaches-the-refs
     */
    setLoaded(true);
  }, []);

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
    dragThrottle ?? 100,
  );

  let dragHandler;
  if (isResizeRow) {
    dragHandler = (
      <DragHandler
        key={dftHeight} // 算出默认值后强制销毁重建
        className={cls(stl.dragHandler, classNames?.dragHandler)}
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
        className={cls(stl.dragHandler, classNames?.dragHandler)}
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
        className={cls(stl.dragPanel, classNames?.dragPanel)}
        style={{ width: panelWidth, height: panelHeight }}
      >
        {dragPanelChildren}
        {loaded ? dragHandler : null}
      </div>
      <div
        className={cls(stl.contentPanel, classNames?.contentPanel, {
          [stl.row]: isResizeRow,
          [stl.col]: isResizeCol,
        })}
      >
        {children}
      </div>
    </div>
  );
};

DragContainer.DraggingIcon = DraggingIcon;
DragContainer.DragHandler = DragHandler;
DragContainer.useDraggable = useDraggable;

export default DragContainer;
