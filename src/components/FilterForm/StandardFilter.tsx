import {
  Button,
  Col,
  ColProps,
  Form,
  FormInstance,
  FormProps,
  Row,
  Space,
} from "antd";
import { ButtonProps } from "antd/lib";
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

  /** 扩展操作 */
  extend?: React.ReactNode;
  /** 筛选项(Form.Item 的 name 仅支持字符串) */
  items?: FilterFormItemType[];

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
  /** 点击查询按钮 */
  onSubmit?: (values: Record<string, any>) => void;
  /** 点击重置按钮 */
  onReset?: (values: Record<string, any>) => void;
  /** 筛选项值变更 */
  onFilterChange?: (values: Record<string, any>) => void;
};

/**
 * 标准可筛选表单
 */
export const StandardFilter = (props: StandardFilterProps) => {
  const {
    className,
    style,
    form: outerForm,
    initialValues,
    extend,
    items,
    visibleCount = 3,
    defaultUnfold,
    itemColSpan,
    itemLabelSpan,
    submitText,
    resetText,
    submitProps,
    resetProps,
    onInitValues,
    onSubmit,
    onReset,
    onFilterChange,
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
    refOnInitValues.current?.(refInitValues.current);
  }, []);

  // 点击重置按钮
  const handleReset = useCallback(() => {
    const values = {};

    onReset?.(values);
    onFilterChange?.(values);
  }, [onFilterChange, onReset]);

  // 点击查询按钮
  const handleSubmit = useCallback(() => {
    const formValues = form.getFieldsValue();
    const values = { ...(formValues || {}) };

    onSubmit?.(values);
    onFilterChange?.(values);
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
          <Col {...colProps} className={clsName} key={colProps.key}>
            {children}
          </Col>
        );
      }),
    [itemColSpan, items, unfold, visibleCount],
  );

  const actionCol = useMemo(
    () => (
      <Col flex="auto" className={stl.actionCol}>
        <Form.Item>
          <Space>
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
                htmlType="reset"
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
      extend,
      handleReset,
      handleSubmit,
      resetProps,
      resetText,
      showUnfold,
      submitProps,
      submitText,
      unfold,
    ],
  );

  return (
    <Form
      className={cls(stl.filterForm, stl.standardFilter, className)}
      style={style}
      layout="inline"
      form={form}
      initialValues={refInitValues.current}
      labelCol={{ span: itemLabelSpan }}
      {...rest}
    >
      <Row className={stl.row} gutter={[16, 8]}>
        {itemCols}
        {actionCol}
      </Row>
    </Form>
  );
};

export default StandardFilter;
