import { GetProps, Table, TableProps } from "antd";
import type { GetRowKey } from "antd/es/table/interface";
import type { ReactComponentLike } from "prop-types";
import React from "react";
import { MenuOutlined } from "@ant-design/icons";
import { DndContext, DndContextProps, DragEndEvent } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const domDataRowKey = "data-row-key";
const sortableColumnKey = "SORTABLE_TABLE_COLUMN_KEY";

const getRowKeyFunc =
  <
    RowKey extends TableProps["rowKey"] = any,
    RecordType = RowKey extends GetRowKey<infer RecordType> ? RecordType : any,
  >(
    rowKey: RowKey,
  ) =>
  (record: RecordType) => {
    if (!rowKey) {
      return rowKey;
    }

    if (typeof rowKey === "function") {
      return rowKey(record);
    }

    return (record as any)?.[rowKey];
  };

type SortableRowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  [domDataRowKey]: string;
};

const SortableRow = (props: SortableRowProps) => {
  const { children, ...rest } = props;
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

  const style: React.CSSProperties = {
    ...rest.style,
    ...(rowId && isDragging ? { position: "relative", zIndex: 10 } : {}),
    transition,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
  };

  return (
    <tr {...rest} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === sortableColumnKey) {
          return React.cloneElement(child as React.ReactElement, {
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
  TableComponent?: ReactComponentLike;
  onDataSourceChange?: (dataSource: RecordType[]) => void;
  dndContextProps?: DndContextProps;
  sortableContextProps?: GetProps<typeof SortableContext>;
};

const SortableTable = (props: SortableTableProps) => {
  const {
    TableComponent = Table,
    onDataSourceChange,
    dndContextProps,
    sortableContextProps,
    rowKey = "key",
    columns = [],
    dataSource = [],
    ...rest
  } = props;

  if (!onDataSourceChange) {
    return <TableComponent {...props} />;
  }

  const rowKeyFunc = getRowKeyFunc(rowKey);
  const sortableColumns = (
    [{ key: sortableColumnKey, width: 32 }] as any[]
  ).concat(columns);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = dataSource.findIndex(
        (item) => rowKeyFunc(item) === active.id,
      );
      const overIndex = dataSource.findIndex(
        (item) => rowKeyFunc(item) === over?.id,
      );
      const list = arrayMove(dataSource as any[], activeIndex, overIndex);
      onDataSourceChange(list);
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
