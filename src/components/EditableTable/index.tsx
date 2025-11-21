import { Button, Space, Table, TableProps, Tooltip } from "antd";
import type { ColumnType } from "antd/lib/table/interface";
import cls from "classnames";
import { cloneDeep, get, set } from "lodash-es";
import {
  cloneElement,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useComponentsLocale } from "@/i18n/hooks";
import { uuid4 } from "@/utils/cryptos";
import { isType } from "@/utils/tools";
import SortableTable from "../SortableTable";
import DecoupleAutoComplete from "./DecoupleAutoComplete";
import DecoupleInput from "./DecoupleInput";
import DecoupleTextArea from "./DecoupleTextArea";
import EditableHeader from "./EditableHeader";
import stl from "./index.module.less";

const isFunction = (val: any) =>
  isType<(...rest: any[]) => any>(val, "Function");

type DataRow = Record<string, any>;

type Column = ColumnType<any>;

type RenderParams = Parameters<Required<Column>["render"]>;

type ActionResult = {
  /** 禁止操作 */
  disabled?: boolean;
  /** 提示 */
  tooltip?: string;
  /** 操作扩展 */
  extend?: ReactNode;
};

type ActionRender = (
  text: RenderParams[0],
  record: RenderParams[1],
  index: RenderParams[2],
) => ActionResult;

export type EditableTableColumn = Column & {
  disabled?: boolean | ((record: DataRow) => boolean | string);
  /** value 别名 */
  valuePropName?: string;
  /** onChange 别名 */
  changePropName?: string;
  /** onChange 事件值转换器 */
  changeEventConverter?: (event: any) => any;
};
/**
 * 给每一行的数据补充 rowKey ，内部使用
 * @param list
 * @param rowKey
 * @returns
 */
const addRowsKey = (list: DataRow[], rowKey = "") => {
  return list.map((item) => {
    const key = item[rowKey];
    if (!key) {
      item[rowKey] = uuid4();
    }
    return item;
  });
};

export type EditableTableProps = Omit<
  TableProps<any>,
  "dataSource" | "columns" | "onChange"
> & {
  /**
   * 指定拖拽的 rowKey
   */
  rowKey?: string;
  /** readOnly */
  readOnly?: boolean;
  /** 禁止新建 */
  disabledAdd?: boolean;
  /** 默认行数据 */
  defaultRowValue?: DataRow;
  /** 数据源 */
  dataSource?: DataRow[];
  /** 列配置 */
  columns?: EditableTableColumn[];
  /** 操作列配置 */
  actionColumn?: false | Column;
  /** 操作列渲染 */
  actionRender?: ActionRender;
  /** 最后一个操作列 */
  lastActionRender?: React.ReactNode;
  /** 可以拖拽，非 readOnly，编辑状态有效 */
  canDrag?: boolean;
  /** 数据变更 */
  onDataChange?: (data: DataRow[]) => any;
  /** 表单专用 */
  onChange?: (data: DataRow[]) => any;
  /** 行删除 */
  onRowDelete?: (row: DataRow, idx: number) => any;
};

/**
 * 可编辑表格
 *
 * 默认实现下单元格为受控组件，如需非受控组件可通过修改 valuePropName 为 defaultValue 实现。
 * 适用场景：
 * 使用 <Input /> 时，因重复渲染造成单元格实例不稳定，表现为光标位置总是跳到最后一个字符之后。
 */
export const EditableTable = (props: EditableTableProps) => {
  const {
    className,
    readOnly,
    disabledAdd,
    defaultRowValue,
    dataSource,
    columns,
    actionColumn,
    actionRender,
    lastActionRender,
    onDataChange,
    onChange,
    onRowDelete,
    canDrag = false,
    rowKey,
    size = "small",
    ...rest
  } = props;

  const { locale } = useComponentsLocale();

  const [itemList, setItemList] = useState<DataRow[]>([]);
  const itemCount = itemList.length;
  const [innerRowKey, setInnerRowKey] = useState(rowKey || "innerRowKey");
  // 指定 key
  // Warning: [antd: Table] `index` parameter of `rowKey` function is deprecated. There is no guarantee that it will work as expected.
  const normalRowKey = useCallback(
    (row: DataRow, idx?: number) => idx ?? itemList.findIndex((x) => x === row),
    [itemList],
  );
  // 排除内部使用的 rowKey，校验这行是否有有效值
  const verifyRow = useCallback(
    (row: DataRow) =>
      row &&
      Object.keys(row)
        .filter((key) => key != innerRowKey)
        .some((key) => {
          const val = row[key];
          const dftVal = (defaultRowValue ?? {})[key];

          return (
            val !== undefined && val !== null && val !== "" && val !== dftVal
          );
        }),
    [defaultRowValue, innerRowKey],
  );

  // 新建行
  const addRow = useCallback(
    (rows: DataRow[]) => {
      const list = [
        ...rows,
        {
          ...(defaultRowValue ?? {}),
        },
      ];

      return list;
    },
    [defaultRowValue],
  );

  // 移除行
  const removeRow = useCallback(
    (rows: DataRow[], row: DataRow) => rows.filter((x) => x !== row),
    [],
  );

  // 清理最后一行
  const clearLastRow = useCallback(
    (rows: DataRow[]) => {
      if (rows.length) {
        const lastIdx = rows.length - 1;
        const lastRow = rows[lastIdx];
        const isValid = verifyRow(lastRow);

        if (!isValid) {
          return rows.slice(0, lastIdx);
        }
      }

      return rows;
    },
    [verifyRow],
  );

  // 数据处理
  useEffect(() => {
    let rows = [...(dataSource ?? [])];

    if (!readOnly) {
      // 编辑模式下，追加新建行
      if (!disabledAdd) {
        rows = addRow(rows);
      }
    } else {
      // 如果最后一行无效，则剔除最后一行
      rows = clearLastRow(rows);
    }
    /**
     * 如果可拖拽，数据增加 rowKey
     */
    if (canDrag) {
      rows = addRowsKey(rows, innerRowKey);
    }

    setItemList(rows);
  }, [
    canDrag,
    readOnly,
    disabledAdd,
    dataSource,
    innerRowKey,
    addRow,
    clearLastRow,
  ]);

  useEffect(() => {
    if (rowKey) {
      setInnerRowKey(rowKey);
    } else {
      setInnerRowKey("innerRowKey");
    }
  }, [rowKey]);
  // 处理值变更
  const handleChange = useCallback(
    (list: DataRow[] | undefined = undefined) => {
      if (readOnly) {
        return;
      }

      if (isFunction(onDataChange) || isFunction(onChange)) {
        let rows = [...(list ?? itemList ?? [])];
        rows = clearLastRow(rows);
        if (onChange) onChange(rows);
        if (onDataChange) onDataChange(rows);
      }
    },
    [readOnly, itemList, clearLastRow, onDataChange, onChange],
  );

  // 处理行删除
  const handleDelete = useCallback(
    (row: DataRow, idx: number) => {
      if (isFunction(onRowDelete)) {
        onRowDelete(row, idx);
      }

      // 函数式组件没有提供类似 setState(updater, callback) 的支持
      const list = removeRow(itemList, row);
      setItemList(list);
      handleChange(list);
    },
    [itemList, removeRow, handleChange, onRowDelete],
  );

  const handleSort = useCallback(
    (v: any[]) => {
      const list = cloneDeep(v);
      setItemList(list);
      handleChange(list);
    },
    [setItemList, handleChange],
  );

  // 组装列配置
  const colList = useMemo(() => {
    const list: any[] = (columns ?? [])
      .filter((x) => x)
      .map((col) => {
        const {
          valuePropName = "value",
          changePropName = "onChange",
          changeEventConverter = (event: any) => {
            const field = valuePropName;
            if (event && event.target && event.target[field] !== undefined) {
              return event.target[field];
            }
            return event;
          },
          className: colCls,
          dataIndex,
          render,
          ...colRest
        } = col;

        const colRender = (text: any, record: any, rowIdx: any) => {
          const disabled =
            typeof col.disabled === "function"
              ? col.disabled(record)
              : col.disabled;
          if (!!disabled === true) {
            if (typeof disabled === "string") {
              return <span className={stl.col}>{disabled}</span>;
            }
            return <span className={stl.col}>{`${text}`}</span>;
          }
          // 兜底
          if (!render) {
            // return <span className={stl.default}>{ get(record, dataIndex as any) }</span>;
            return get(record, dataIndex as any);
          }

          // 渲染列
          const children = render?.(text, record, rowIdx) ?? null;

          // 检查列
          if (!isValidElement(children)) {
            return children;
          }

          // 事件处理
          const rawProps: any = children?.props ?? {};
          const rawChange = rawProps[changePropName];
          const colChange = (value: any) => {
            if (isFunction(rawChange)) {
              rawChange(value);
            }

            const val = changeEventConverter(value);
            set(record, dataIndex as any, val);
            handleChange();
          };

          // 监听变更
          const childProps = {
            [valuePropName]: get(record, dataIndex as any),
            [changePropName]: colChange,
            ...rawProps,
          };

          // 克隆组件
          return cloneElement(children, childProps);
        };

        return {
          className: cls(stl.cell, colCls),
          dataIndex,
          render: colRender,
          ...colRest,
        };
      });

    // 编辑模式下，追加操作列
    if (!readOnly && actionColumn !== false) {
      const { className: colCls, ...colRest } = actionColumn ?? {};

      const colRender = (text: any, record: any, rowIdx: any) => {
        // 最后一行
        const isLastRow = rowIdx === itemCount - 1;

        // 渲染操作列
        const actionResult = actionRender?.(text, record, rowIdx) ?? {};
        const { disabled, tooltip, extend } = actionResult;

        // 追加新建行，没有操作列
        return isLastRow ? (
          lastActionRender
        ) : (
          <Space>
            <Tooltip title={tooltip}>
              <Button
                type="text"
                tabIndex={-1}
                disabled={disabled}
                size={size}
                onClick={() => handleDelete(record, rowIdx)}
              >
                <DeleteOutlined />
              </Button>
            </Tooltip>

            {extend}
          </Space>
        );
      };

      list.push({
        className: cls(stl.action, colCls),
        dataIndex: "__action",
        render: colRender,
        title: locale.common.actionText,
        align: "center",
        width: 50,
        ...colRest,
      });
    }
    return list;
  }, [
    columns,
    readOnly,
    actionColumn,
    handleChange,
    locale.common.actionText,
    itemCount,
    actionRender,
    lastActionRender,
    size,
    handleDelete,
  ]);

  if (canDrag && !readOnly) {
    return (
      <SortableTable
        TableComponent={Table}
        rowHoverable={false}
        bordered
        pagination={false}
        columns={colList}
        className={cls(stl.table, className)}
        size={size}
        dndContextProps={{
          cancelDrop: () => false,
        }}
        rowKey={innerRowKey}
        dataSource={itemList}
        onDataSourceChange={handleSort}
        locale={{ emptyText: locale.common.emptyContent }}
        {...rest}
      />
    );
  }

  return (
    <Table
      rowHoverable={false}
      bordered
      pagination={false}
      columns={colList}
      className={cls(stl.table, className)}
      size={size}
      rowKey={rowKey || normalRowKey}
      dataSource={itemList}
      locale={{ emptyText: locale.common.emptyContent }}
      {...rest}
    />
  );
};

EditableTable.DecoupleInput = DecoupleInput;
EditableTable.DecoupleTextArea = DecoupleTextArea;
EditableTable.EditableHeader = EditableHeader;
EditableTable.DecoupleAutoComplete = DecoupleAutoComplete;

export default EditableTable;
