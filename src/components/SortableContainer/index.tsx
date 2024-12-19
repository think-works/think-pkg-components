import { Argument } from "classnames";
import cls from "classnames";
import { ReactNode } from "react";
import { MenuOutlined } from "@ant-design/icons";
import { DndContext, DndContextProps, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  SortableContextProps,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import stl from "./index.module.less";

type SortableItemConfig = {
  [key: string]: any;
  className?: Argument;
  style?: React.CSSProperties;
  key?: string | number;
  children?: ReactNode;
  /** 隐藏排序手柄 */
  hideSortable?: boolean;
  /** 拖拽中样式 */
  draggingStyle?: React.CSSProperties;
  /** 排序手柄样式 */
  handleStyle?: React.CSSProperties;
};

type SortableItemProps = SortableItemConfig & {
  itemKey?: string | number;
};

const SortableItem = (props: SortableItemProps) => {
  const {
    className,
    style,
    itemKey,
    children,
    hideSortable,
    draggingStyle = {
      position: "relative",
      zIndex: 10,
    },
    handleStyle = {
      touchAction: "none",
      cursor: "move",
    },
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: itemKey!,
  });

  const newStyle: React.CSSProperties = {
    ...(style || {}),
    ...(itemKey && isDragging ? draggingStyle : {}),
    transition,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
  };

  return (
    <div
      className={cls(stl.sortableItem, className)}
      style={newStyle}
      ref={setNodeRef}
      {...attributes}
      tabIndex={-1}
    >
      {hideSortable ? null : (
        <MenuOutlined
          className={stl.handle}
          ref={setActivatorNodeRef}
          style={handleStyle}
          {...listeners}
        />
      )}
      {children}
    </div>
  );
};

export type SortableContainerProps = {
  className?: Argument;
  style?: React.CSSProperties;
  /** 透传 DndContextProps */
  dndContextProps?: DndContextProps;
  /** 透传 SortableContextProps */
  sortableContextProps?: SortableContextProps;
  /** 隐藏排序手柄 */
  hideSortable?: boolean;
  /** 排序项 */
  items?: SortableItemConfig[];
  /** 排序项变更 */
  onItemChange?: (items: SortableItemConfig[]) => void;
};

export const SortableContainer = (props: SortableContainerProps) => {
  const {
    className,
    style,
    dndContextProps,
    sortableContextProps,
    hideSortable = false,
    items = [],
    onItemChange,
  } = props;

  const getItemKey = (item: SortableItemConfig, idx: number) => item.key ?? idx;

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = items.findIndex(
        (item, idx) => getItemKey(item, idx) === active.id,
      );
      const overIndex = items.findIndex(
        (item, idx) => getItemKey(item, idx) === over?.id,
      );
      const list = arrayMove(items, activeIndex, overIndex);
      onItemChange?.(list);
    }
  };

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      {...dndContextProps}
    >
      <SortableContext
        items={items.map((item, idx) => getItemKey(item, idx))}
        strategy={verticalListSortingStrategy}
        {...sortableContextProps}
      >
        <div className={cls(stl.sortableContainer, className)} style={style}>
          {items.map((item, idx) => {
            const { key, ...rest } = item;
            const itemKey = getItemKey(item, idx);
            return (
              <SortableItem
                key={itemKey}
                itemKey={itemKey}
                hideSortable={hideSortable}
                {...rest}
              />
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableContainer;
