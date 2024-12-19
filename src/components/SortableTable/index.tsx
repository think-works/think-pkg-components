import { Table, TableProps } from "antd";
import { Argument } from "classnames";
import React, { Key, useMemo } from "react";
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

const domDataRowKey = "data-row-key";
const sortableColumnKey = "SORTABLE_TABLE_COLUMN_KEY";
const draggingStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 10,
};

type GetRowKey<RecordType = any> = (item: RecordType, index?: number) => Key;

type RowKey<RecordType = any> =
  | string
  | keyof RecordType
  | GetRowKey<RecordType>;

const getRowKeyFunc =
  <
    RKey extends RowKey = string,
    RType = RKey extends GetRowKey<infer RecordType> ? RecordType : any,
  >(
    rowKey: RKey,
  ) =>
  (record: RType) => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return (record as any)?.[rowKey];
  };

type SortableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  className?: Argument;
  style?: React.CSSProperties;
  [domDataRowKey]: string;
};

const SortableRow = (props: SortableRowProps) => {
  const { children, className, style, ...rest } = props;
  const rowId = rest[domDataRowKey];

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: rowId,
  });

  const newStyle: React.CSSProperties = {
    ...(style || {}),
    ...(rowId && isDragging ? draggingStyle : {}),
    transition,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
  };

  return (
    <tr
      {...rest}
      className={className}
      style={newStyle}
      ref={setNodeRef}
      {...attributes}
      tabIndex={-1}
    >
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === sortableColumnKey && rowId) {
          return React.cloneElement<any>(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "move" }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

export type SortableTableProps<
  RecordType = any,
  ComponentProps = TableProps<RecordType>,
> = ComponentProps & {
  className?: Argument;
  style?: React.CSSProperties;
  /** 透传 DndContextProps */
  dndContextProps?: DndContextProps;
  /** 透传 SortableContextProps */
  sortableContextProps?: SortableContextProps;
  /** 表格组件 */
  TableComponent?: React.ComponentType;
  /** 隐藏排序手柄 */
  hideSortable?: boolean;
  /** 数据源变更 */
  onDataSourceChange?: (dataSource: RecordType[]) => void;
};

/**
 * 可排序表格
 */
export const SortableTable = (props: SortableTableProps) => {
  const {
    className,
    style,
    dndContextProps,
    sortableContextProps,
    TableComponent = Table,
    hideSortable = false,
    rowKey = "key",
    columns = [],
    dataSource = [],
    onDataSourceChange,
    ...rest
  } = props;

  const rowKeyFunc = getRowKeyFunc(rowKey);

  const sortableColumns = useMemo(() => {
    if (hideSortable) {
      return columns;
    }
    return ([{ key: sortableColumnKey, width: 32 }] as any[]).concat(columns);
  }, [hideSortable, columns]);

  if (!onDataSourceChange) {
    return <TableComponent {...props} />;
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = dataSource.findIndex(
        (item) => rowKeyFunc(item) === active.id,
      );
      const overIndex = dataSource.findIndex(
        (item) => rowKeyFunc(item) === over?.id,
      );
      const list = arrayMove(dataSource as any[], activeIndex, overIndex);
      onDataSourceChange?.(list);
    }
  };

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      {...dndContextProps}
    >
      <SortableContext
        items={dataSource.map((item) => rowKeyFunc(item))}
        strategy={verticalListSortingStrategy}
        {...sortableContextProps}
      >
        <TableComponent
          className={className}
          style={style}
          rowKey={rowKeyFunc}
          dataSource={dataSource}
          columns={sortableColumns}
          components={{ body: { row: SortableRow } }}
          {...rest}
        />
      </SortableContext>
    </DndContext>
  );
};

export default SortableTable;
