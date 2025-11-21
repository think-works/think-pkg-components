import { Table, TableProps, Tooltip } from "antd";
import cls, { Argument } from "classnames";
import type { Reference } from "rc-table";
import { ForwardedRef, forwardRef, useMemo } from "react";
import { separator } from "@/utils/human";
import { isBlank, isType, msecToString } from "@/utils/tools";
import { useComponentsLocale } from "../ConfigProvider";
import stl from "./index.module.less";

const isString = (val: any) => isType<string>(val, "String");
const isNumber = (val: any) => isType<number>(val, "Number");
const isBoolean = (val: any) => isType<boolean>(val, "Boolean");

const isBlankString = (text?: string) =>
  isBlank(text, {
    detectEmpty: true,
  });

export const BaseTableDefaultPageSize = 20;

type TableColumn<RecordType = any> = NonNullable<
  TableProps<RecordType>["columns"]
>[number];

export type BaseTableColumn<RecordType = any> = TableColumn<RecordType> & {
  /** 渲染无数据占位符 */
  renderPlaceholder?: boolean | React.ReactNode;
  /** 渲染数字千分位分割 */
  renderSeparator?: boolean | number;
  /** 渲染时间序列化格式 */
  renderDateTime?: boolean | string;
  /** 渲染单行超出隐藏 */
  renderEllipsis?: boolean | number;
  /** 渲染多行超出隐藏 */
  renderMultiLine?: boolean | number;
  /** 渲染 Tooltip  */
  renderTooltip?: boolean;
};

export type BaseTableProps<RecordType = any> = Omit<
  TableProps<RecordType>,
  "columns"
> & {
  className?: Argument;
  /** 表格列描述 */
  columns?: BaseTableColumn<RecordType>[];
  /** 表格左下角扩展 */
  extend?: React.ReactNode;
  /** 粘性分页 */
  stickyPagination?: boolean;
  /** 透传表格属性 */
  tableProps?: Record<string, any>;
};

/**
 * 基础表格
 */
export const BaseTable = forwardRef(function BaseTableCom(
  props: BaseTableProps,
  ref: ForwardedRef<Reference>,
) {
  const {
    className,
    columns,
    pagination,
    extend,
    tableProps,
    stickyPagination,
    ...rest
  } = props || {};

  const { locale, replaceTextVars } = useComponentsLocale();

  const cols = useMemo(
    () =>
      (columns || []).map((col: any) => {
        let render = col.render;
        const {
          width,
          renderPlaceholder,
          renderSeparator,
          renderDateTime,
          renderEllipsis,
          renderMultiLine,
          renderTooltip,
          ...rest
        } = col;

        if (renderPlaceholder) {
          ((_render) => {
            render = (text: any, record: any, index: any) => {
              const content = _render ? _render(text, record, index) : text;
              const placeholder =
                renderPlaceholder === true ? "-" : renderPlaceholder;
              return isBlankString(content) ? placeholder : content;
            };
          })(render); // 闭包引用
        }

        if (renderSeparator) {
          ((_render) => {
            render = (text: any, record: any, index: any) => {
              const content = _render ? _render(text, record, index) : text;
              const len = isNumber(renderSeparator) ? renderSeparator : 0;
              return separator(content, len);
            };
          })(render); // 闭包引用
        }

        if (renderDateTime) {
          ((_render) => {
            render = (text: any, record: any, index: any) => {
              const content = _render ? _render(text, record, index) : text;
              const format = isString(renderDateTime)
                ? renderDateTime
                : "YYYY-MM-DD HH:mm:ss";
              return isNumber(content)
                ? msecToString(content, format)
                : content;
            };
          })(render); // 闭包引用
        }

        if (renderEllipsis) {
          ((_render) => {
            render = (text: any, record: any, index: any) => {
              const content = _render ? _render(text, record, index) : text;
              let maxWidth = undefined;
              if (isNumber(renderEllipsis)) {
                maxWidth = `${renderEllipsis}px`;
              } else if (isNumber(width)) {
                maxWidth = `${width}px`;
              } else if (isString(width)) {
                maxWidth = width;
              }
              return (
                <div
                  className={stl.ellipsis}
                  style={{
                    maxWidth: maxWidth,
                  }}
                  title={isString(content) ? content : undefined}
                >
                  {content}
                </div>
              );
            };
          })(render); // 闭包引用
        }

        if (renderMultiLine) {
          ((_render) => {
            render = (text: any, record: any, index: any) => {
              const content = _render ? _render(text, record, index) : text;
              const line = isNumber(renderMultiLine) ? renderMultiLine : 1;
              return (
                <div
                  className={stl.multiLine}
                  style={{
                    WebkitLineClamp: line,
                  }}
                  title={isString(content) ? content : undefined}
                >
                  {content}
                </div>
              );
            };
          })(render); // 闭包引用
        }

        if (renderTooltip) {
          ((_render) => {
            render = (text: any, record: any, index: any) => {
              const content = _render ? _render(text, record, index) : text;
              return isBlankString(text) ? (
                content
              ) : (
                <Tooltip placement="topLeft" title={content}>
                  <div className={stl.tooltip}>{content}</div>
                </Tooltip>
              );
            };
          })(render); // 闭包引用
        }

        // 如果 render 无变更，返回原始的列配置，以便支持 Table.EXPAND_COLUMN 等模式
        if (render === col.render) {
          return col;
        }

        return { ...rest, width, render };
      }),
    [columns],
  );

  return (
    <div className={cls(stl.baseTable, className)}>
      <Table
        ref={ref}
        className={stl.table}
        columns={cols}
        pagination={
          isBoolean(pagination)
            ? pagination
            : {
                className: cls(stl.pagination, {
                  [stl.extend]: extend,
                  [stl.sticky]: stickyPagination,
                }),
                showSizeChanger: true,
                showTotal: (total) => (
                  <div className={stl.total}>
                    <div className={stl.extend}>{extend}</div>
                    <div className={stl.count}>
                      {replaceTextVars(locale.BaseTable.totalCount, {
                        count: total,
                      })}
                    </div>
                  </div>
                ),
                ...(pagination || {}),
              }
        }
        {...rest}
        {...(tableProps || {})}
      />
    </div>
  );
});

export default BaseTable;
