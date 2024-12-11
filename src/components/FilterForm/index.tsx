import { Button, Col, ColProps, Form, FormProps, Row, Space } from "antd";
import { ButtonProps } from "antd/lib";
import cls, { Argument } from "classnames";
import React, { isValidElement, useMemo, useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import RouteTable from "../RouteTable";
import stl from "./index.module.less";

type FilterFormItemConfig = {
  key?: React.Key;
  colProps?: ColProps;
  children?: React.ReactNode;
};

type FilterFormItem = React.ReactNode | FilterFormItemConfig;

export type FilterFormProps = Omit<FormProps, "action"> & {
  className?: Argument;
  style?: React.CSSProperties;
  /** 默认展开 */
  defaultOpen?: boolean;
  /** Col.span 属性 */
  itemColSpan?: number;
  /** Form.labelCol.span 属性 */
  itemLabelSpan?: number;
  /** 收起时显示的筛选项数量 */
  maxItemCount?: number;
  /** 扩展操作 */
  action?: React.ReactNode;
  /** 筛选项 */
  items?: FilterFormItem[];
  /** 查询按钮文本 */
  submitText?: React.ReactNode;
  /** 重置按钮文本 */
  resetText?: React.ReactNode;
  /** 查询按钮属性 */
  submitProps?: ButtonProps;
  /** 重置按钮属性(false 不显示重置按钮) */
  resetProps?: false | ButtonProps;
  /** 点击查询按钮 */
  onSubmit?: (values: Record<string, any>) => void;
  /** 点击重置按钮 */
  onReset?: (values: Record<string, any>) => void;
  /** 筛选项变更 */
  onFilterChange?: (values: Record<string, any>) => void;
};

/**
 * 可筛选表单
 */
export const FilterForm = (props: FilterFormProps) => {
  const {
    className,
    style,
    defaultOpen,
    itemColSpan,
    itemLabelSpan,
    maxItemCount = 3,
    action,
    items,
    submitText,
    resetText,
    submitProps,
    resetProps,
    onSubmit,
    onReset,
    onFilterChange,
    ...rest
  } = props;
  const showMore = (items?.length || 0) > maxItemCount;

  const [form] = Form.useForm();
  const [open, setOpen] = useState(defaultOpen);

  const filterValue = RouteTable.useSearchFilterValue();
  const initialValues = filterValue || {};

  const handleReset = () => {
    const values = {};
    if (typeof onReset === "function") {
      onReset(values);
    }
    if (typeof onFilterChange === "function") {
      onFilterChange(values);
    }
  };

  const handleSubmit = () => {
    const formValues = form.getFieldsValue();
    const values = { ...formValues };
    if (typeof onSubmit === "function") {
      onSubmit(values);
    }
    if (typeof onFilterChange === "function") {
      onFilterChange(values);
    }
  };

  const list = useMemo(() => {
    const _items = items?.map((item, idx) => {
      let children: React.ReactNode;
      let colProps = {
        key: idx,
        span: itemColSpan,
      };
      let clsName: Argument =
        !open && idx >= maxItemCount ? stl.hideCol : undefined;

      if (isValidElement(item)) {
        colProps.key = item?.key || (item?.props as any)?.name || colProps.key;
        children = item;
      } else {
        const { children: child, colProps: col } = (item ||
          {}) as FilterFormItemConfig;
        children = child;
        colProps = Object.assign({}, colProps, col);
        clsName = cls(clsName, col?.className);
      }

      return (
        <Col {...colProps} className={clsName} key={colProps.key}>
          {children}
        </Col>
      );
    });

    return _items;
  }, [itemColSpan, items, maxItemCount, open]);

  return (
    <Form
      className={cls(stl.filterForm, className)}
      style={style}
      name="filter"
      layout="inline"
      form={form}
      labelCol={{ span: itemLabelSpan }}
      initialValues={initialValues}
      {...rest}
    >
      <Row className={stl.row} gutter={[0, 8]}>
        {list}
        <Col flex="auto" className={stl.actionCol}>
          <Form.Item>
            <Space>
              {resetProps === false ? null : (
                <Button
                  type="default"
                  htmlType="reset"
                  onClick={handleReset}
                  {...resetProps}
                >
                  {resetText || "重置"}
                </Button>
              )}
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleSubmit}
                {...submitProps}
              >
                {submitText || "查询"}
              </Button>
              {action}
              {showMore ? (
                <a onClick={() => setOpen(!open)}>
                  <Space size={4}>
                    {open ? (
                      <>
                        <span>收起</span>
                        <UpOutlined />
                      </>
                    ) : (
                      <>
                        <span>展开</span>
                        <DownOutlined />
                      </>
                    )}
                  </Space>
                </a>
              ) : null}
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FilterForm;
