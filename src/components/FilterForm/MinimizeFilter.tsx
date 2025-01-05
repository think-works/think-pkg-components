import {
  Button,
  ButtonProps,
  Form,
  FormInstance,
  FormProps,
  Popover,
  Space,
} from "antd";
import cls, { Argument } from "classnames";
import { isArray, isString, pick } from "lodash-es";
import {
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FilterOutlined } from "@ant-design/icons";
import { types } from "@/components";
import { useDebounce } from "@/hooks";
import RouteTable from "../RouteTable";
import stl from "./index.module.less";
import StandardFilter, { StandardFilterProps } from "./StandardFilter";

/** 筛选项的有效性计数器 */
const filterValidCounter = (
  obj?: Record<string, any>,
  options?: {
    validKeys?: string[];
    detectUndefined?: boolean;
    detectNull?: boolean;
    detectArray?: boolean;
    detectEmpty?: boolean;
    detectSpace?: boolean;
  },
) => {
  const {
    validKeys,
    detectUndefined = true,
    detectNull = true,
    detectArray = true,
    detectEmpty = true,
    detectSpace,
  } = options || {};

  // 检查 key
  const rawObj = obj || {};
  const validObj = validKeys?.length ? pick(rawObj, validKeys) : rawObj;

  // 检查 value
  const rawList = Object.values(validObj || {});
  const validList = rawList.filter((val) => {
    if (detectUndefined && val === undefined) {
      return false;
    }
    if (detectNull && val === null) {
      return false;
    }
    if (detectArray && isArray(val) && val.length === 0) {
      return false;
    }
    if (detectEmpty && isString(val) && val.length === 0) {
      return false;
    }
    if (detectSpace && isString(val) && val.trim().length === 0) {
      return false;
    }
    return true;
  });

  return validList.length;
};

export type MinimizeFilterProps = FormProps & {
  className?: Argument;
  style?: React.CSSProperties;

  /** 扩展操作 */
  extend?: React.ReactNode;
  /** 筛选项 */
  items?: React.ReactElement[];

  /** 更多筛选项 */
  moreFilterItems?: StandardFilterProps["items"];
  /** 更多筛选项属性 */
  moreFilterProps?: Omit<StandardFilterProps, "form" | "initialValues">;
  /** 更多筛选项的有效性计数器 */
  moreFilterValidCounter?: (values?: Record<string, any>) => number;

  /** 筛选项值变更-防抖毫秒时间间隔(-1 禁止在 onValuesChange 事件中触发 onFilterChange 事件) */
  filterChangeDebounce?: number;

  /** 更多按钮文案 */
  moreText?: React.ReactNode;
  /** 更多按钮属性(false 不显示更多按钮) */
  moreProps?: false | ButtonProps;

  /** 初始化筛选项值 */
  onInitValues?: (values?: Record<string, any>) => void;
  /** 筛选项值变更 */
  onFilterChange?: (values: Record<string, any>) => void;
};

/**
 * 最小化可筛选表单
 */
export const MinimizeFilter = (props: MinimizeFilterProps) => {
  const {
    className,
    style,
    form: outerForm,
    initialValues,
    onValuesChange,
    extend,
    items,
    moreFilterItems,
    moreFilterProps,
    moreFilterValidCounter = filterValidCounter,
    filterChangeDebounce = 500,
    moreText,
    moreProps,
    onInitValues,
    onFilterChange,
    ...rest
  } = props;

  // 更多表单-属性
  const {
    items: moreItems = moreFilterItems,
    onFilterChange: onMoreFilterChange,
    ...restMoreFilter
  } = moreFilterProps || {};

  // 更多表单-表单实例
  const [moreFilterForm] = Form.useForm();

  // 更多表单-筛选项值
  const [moreFilterValues, setMoreFilterValues] =
    useState<Record<string, any>>();

  // 更多表单-筛选项名
  const moreFilterNames = useMemo(
    () =>
      moreItems
        ?.map((item) => {
          if (isValidElement(item)) {
            return (item?.props as any)?.name;
          } else if (isValidElement(item?.children)) {
            return (item?.children?.props as any)?.name;
          }
        })
        .filter(types.truthy),
    [moreItems],
  );

  // 更多表单-筛选项值的有效性计数器
  const moreFilterValidCount = useMemo(
    () =>
      moreFilterValidCounter(moreFilterValues, {
        validKeys: moreFilterNames,
      }),
    [moreFilterNames, moreFilterValidCounter, moreFilterValues],
  );

  // 最小化表单-气泡卡片
  const [openPopover, setOpenPopover] = useState(false);

  // 最小化表单-优先使用外部实例
  const [innerForm] = Form.useForm();
  const form = (outerForm || innerForm) as FormInstance<Record<string, any>>;

  // 最小化表单-用路由参数初始化
  const initValues = RouteTable.useSearchFilterValue();
  const refInitValues = useRef(initialValues || initValues);
  const refOnInitValues = useRef(onInitValues);

  // 最小化表单-组件实例化时触发一次初始化
  useEffect(() => {
    refOnInitValues.current?.(refInitValues.current);
    // 初始化 更多表单-筛选项值
    setMoreFilterValues(refInitValues.current);
  }, []);

  // 最小化表单-气泡卡片 开启时重置 更多表单
  useEffect(() => {
    if (openPopover) {
      const clonedValues = { ...(moreFilterValues || {}) };
      moreFilterForm.resetFields();
      moreFilterForm.setFieldsValue(clonedValues);
    }
  }, [moreFilterForm, moreFilterValues, openPopover]);

  // 最小化表单-触发筛选项变更
  const handleFilterChange = useCallback(
    (moreValues?: Record<string, any>) => {
      const formValues = form.getFieldsValue();
      // 合并 最小化表单 和 更多表单 的筛选项值
      const values = { ...(formValues || {}), ...(moreValues || {}) };
      onFilterChange?.(values);
    },
    [form, onFilterChange],
  );

  // 最小化表单-触发筛选项变更-防抖
  const handleFilterChangeDebounce = useDebounce(
    handleFilterChange,
    filterChangeDebounce >= 0 ? filterChangeDebounce : 0,
  );

  // 最小化表单-表单值变更
  const handleValuesChange = useCallback<
    NonNullable<FormProps["onValuesChange"]>
  >(
    (changedValues, allValues) => {
      // 触发 传入的同名函数
      onValuesChange?.(changedValues, allValues);

      if (filterChangeDebounce >= 0) {
        // 触发 最小化表单-触发筛选项变更-防抖
        handleFilterChangeDebounce(moreFilterValues);
      }
    },
    [
      filterChangeDebounce,
      handleFilterChangeDebounce,
      moreFilterValues,
      onValuesChange,
    ],
  );

  // 最小化表单-按下回车
  const handleKeyDown = useCallback(
    (e: any) => {
      if (e?.key === "Enter" || e?.keyCode === 13) {
        // 触发 最小化表单-触发筛选项变更
        handleFilterChange(moreFilterValues);
      }
    },
    [handleFilterChange, moreFilterValues],
  );

  // 更多表单-筛选项值变更
  const handleMoreFilterChange = useCallback(
    (values: Record<string, any>) => {
      // 触发 传入的同名函数
      onMoreFilterChange?.(values);
      // 触发 最小化表单-触发筛选项变更
      handleFilterChange(values);
      // 更新 更多表单-筛选项值
      setMoreFilterValues(values);
      // 关闭 最小化表单-气泡卡片
      setOpenPopover(false);
    },
    [handleFilterChange, onMoreFilterChange],
  );

  const moreAction =
    moreProps === false ? null : (
      <Popover
        trigger="click"
        fresh={true}
        destroyTooltipOnHide={false}
        open={openPopover}
        onOpenChange={setOpenPopover}
        content={
          <div className={stl.popoverPanel}>
            <StandardFilter
              itemColSpan={12}
              items={moreItems}
              form={moreFilterForm}
              initialValues={{}} // 会在打开气泡卡片时，手动初始化更多表单
              onFilterChange={handleMoreFilterChange}
              {...restMoreFilter}
            />
          </div>
        }
      >
        <Button
          icon={<FilterOutlined />}
          ghost={moreFilterValidCount > 0}
          type={moreFilterValidCount > 0 ? "primary" : "default"}
          {...moreProps}
        >
          {moreText ||
            `更多筛选 ${moreFilterValidCount > 0 ? `(${moreFilterValidCount})` : ""}`}
        </Button>
      </Popover>
    );

  return (
    <Form
      className={cls(stl.filterForm, stl.minimizeFilter, className)}
      style={style}
      layout="inline"
      form={form}
      initialValues={refInitValues.current}
      onValuesChange={handleValuesChange}
      {...rest}
    >
      <Space>
        <Space onKeyDown={handleKeyDown}>{items}</Space>
        {moreAction}
        {extend}
      </Space>
    </Form>
  );
};

MinimizeFilter.filterValidCounter = filterValidCounter;

export default MinimizeFilter;
