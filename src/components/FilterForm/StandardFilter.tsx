import {
  Button,
  ButtonProps,
  Col,
  ColProps,
  Form,
  FormInstance,
  FormProps,
  Row,
  Space,
} from "antd";
import cls, { Argument } from "classnames";
import React, {
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import RouteTable from "../RouteTable";
import stl from "./index.module.less";

export type FilterFormItemConfig = {
  key?: React.Key;
  colProps?: ColProps;
  children?: React.ReactElement;
};

export type FilterFormItemType = React.ReactElement | FilterFormItemConfig;

export type StandardFilterProps = FormProps & {
  className?: Argument;
  style?: React.CSSProperties;
  classNames?: {
    row?: Argument;
    col?: Argument;
    actionCol?: Argument;
  };
  styles?: {
    row?: React.CSSProperties;
    col?: React.CSSProperties;
    actionCol?: React.CSSProperties;
  };

  /** 扩展操作 */
  extend?: React.ReactNode;
  /** 筛选项(Form.Item 的 name 仅支持字符串) */
  items?: FilterFormItemType[];

  /** 定制筛选项边框样式 */
  outlinedItem?: boolean;
  /** 收起时可见的筛选项数量 */
  visibleCount?: number;
  /** 默认展开 */
  defaultUnfold?: boolean;
  /** Col.span 属性 */
  itemColSpan?: number;
  /** Form.labelCol.span 属性 */
  itemLabelSpan?: number;

  /** 查询按钮文本(false 不显示查询按钮)*/
  submitText?: false | React.ReactNode;
  /** 重置按钮文本(false 不显示重置按钮) */
  resetText?: false | React.ReactNode;
  /** 查询按钮属性 */
  submitProps?: ButtonProps;
  /** 重置按钮属性 */
  resetProps?: ButtonProps;

  /** 初始化筛选项值 */
  onInitValues?: (values?: Record<string, any>) => void;
  /** 筛选项值变更 */
  onFilterChange?: (
    values: Record<string, any>,
    action?: "submit" | "reset",
  ) => void;
  /** 点击查询按钮 */
  onSubmit?: (values: Record<string, any>) => void;
  /** 点击重置按钮 */
  onReset?: (values: Record<string, any>) => void;
};

/**
 * 标准可筛选表单
 */
export const StandardFilter = (props: StandardFilterProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    form: outerForm,
    initialValues,
    extend,
    items,
    outlinedItem,
    visibleCount = 3,
    defaultUnfold,
    itemColSpan,
    itemLabelSpan,
    submitText,
    resetText,
    submitProps,
    resetProps,
    onInitValues,
    onFilterChange,
    onSubmit,
    onReset,
    ...rest
  } = props;

  // 显示展开/收起按钮
  const showUnfold = (items?.length || 0) > visibleCount;

  // 展开/收起状态
  const [unfold, setUnfold] = useState(defaultUnfold);

  // 优先使用外部实例
  const [innerForm] = Form.useForm();
  const form = (outerForm || innerForm) as FormInstance<Record<string, any>>;

  // 用路由参数初始化
  const initValues = RouteTable.useSearchFilterValue();
  const refInitValues = useRef(initialValues || initValues);
  const refOnInitValues = useRef(onInitValues);

  // 组件实例化时触发一次初始化
  useEffect(() => {
    const initVal = refInitValues.current;
    refOnInitValues.current?.(initVal);
    form.setFieldsValue(initVal || {}); // 不使用 initialValues
  }, [form]);

  // 点击重置按钮
  const handleReset = useCallback(() => {
    form.resetFields(); // 清空表单
    const values = form.getFieldsValue();

    onFilterChange?.(values, "reset");
    onReset?.(values);
  }, [form, onFilterChange, onReset]);

  // 点击查询按钮
  const handleSubmit = useCallback(() => {
    let values = form.getFieldsValue();
    values = Object.assign({}, values); // 浅层克隆

    onFilterChange?.(values, "submit");
    onSubmit?.(values);
  }, [form, onFilterChange, onSubmit]);

  const itemCols = useMemo(
    () =>
      items?.map((item, idx) => {
        let children: React.ReactNode;
        let colProps = {
          key: idx as React.Key,
          span: itemColSpan,
        };

        // 隐藏多余的表单项
        let clsName: Argument =
          !unfold && idx >= visibleCount ? stl.hideCol : undefined;

        // 提取表单项的 key
        if (isValidElement(item)) {
          children = item;
          colProps.key =
            item?.key || (item?.props as any)?.name || colProps.key;
        } else if (isValidElement(item?.children)) {
          const { colProps: col, children: child } = item || {};

          children = child;
          colProps.key =
            item?.key ||
            child?.key ||
            (child?.props as any)?.name ||
            colProps.key;

          colProps = Object.assign({}, colProps, col);
          clsName = cls(clsName, col?.className);
        }

        return (
          <Col
            {...colProps}
            key={colProps.key}
            className={cls(clsName, classNames?.col)}
            style={styles?.col}
          >
            {children}
          </Col>
        );
      }),
    [classNames?.col, itemColSpan, items, styles?.col, unfold, visibleCount],
  );

  const actionCol = useMemo(
    () => (
      <Col
        flex="auto"
        className={cls(stl.actionCol, classNames?.actionCol)}
        style={styles?.actionCol}
      >
        <Form.Item className={stl.actionItem}>
          <Space className={stl.actionSpace}>
            {showUnfold ? (
              <a onClick={() => setUnfold(!unfold)}>
                <Space size={4}>
                  {unfold ? (
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
            {resetText === false ? null : (
              <Button
                type="default"
                htmlType="button"
                onClick={handleReset}
                {...resetProps}
              >
                {resetText || "重置"}
              </Button>
            )}
            {submitText === false ? null : (
              <Button
                type="primary"
                htmlType="submit"
                onClick={handleSubmit}
                {...submitProps}
              >
                {submitText || "查询"}
              </Button>
            )}
            {extend}
          </Space>
        </Form.Item>
      </Col>
    ),
    [
      classNames?.actionCol,
      extend,
      handleReset,
      handleSubmit,
      resetProps,
      resetText,
      showUnfold,
      styles?.actionCol,
      submitProps,
      submitText,
      unfold,
    ],
  );

  return (
    <Form
      className={cls(stl.standardFilter, className, {
        [stl.outlined]: outlinedItem,
      })}
      style={style}
      layout="inline"
      form={form}
      initialValues={refInitValues.current}
      labelCol={{ span: itemLabelSpan }}
      {...rest}
    >
      <Row
        className={cls(stl.row, classNames?.row)}
        style={styles?.row}
        gutter={[16, 8]}
      >
        {itemCols}
        {actionCol}
      </Row>
    </Form>
  );
};

export default StandardFilter;
