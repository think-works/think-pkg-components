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
import { pick } from "lodash-es";
import {
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FilterOutlined } from "@ant-design/icons";
import { useDebounce } from "@/hooks";
import {
  isType,
  jsonTryParse,
  jsonTryStringify,
  normalizeObject,
} from "@/utils/tools";
import { truthy } from "@/utils/types";
import { useComponentsLocale } from "../ConfigProvider";
import RouteTable from "../RouteTable";
import stl from "./index.module.less";
import StandardFilter, { StandardFilterProps } from "./StandardFilter";

const isString = (val: any) => isType<string>(val, "String");
const isArray = (val: any) => isType<any[]>(val, "Array");

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
  classNames?: {
    popover?: Argument;
    popoverContent?: Argument;
  };
  styles?: {
    popover?: React.CSSProperties;
    popoverContent?: React.CSSProperties;
  };

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

  /** 定制筛选项边框样式 */
  outlinedItem?: boolean;
  /** 筛选项值变更-防抖毫秒时间间隔(-1 禁止在 onValuesChange 事件中触发 onFilterChange 事件) */
  filterChangeDebounce?: number;
  /** 预处理筛选项值(true 递归清理前后空格) */
  normalizeValues?: StandardFilterProps["normalizeValues"];

  /** 更多按钮文案 */
  moreText?: React.ReactNode;
  /** 更多按钮属性(false 不显示更多按钮) */
  moreProps?: false | ButtonProps;

  /** 初始化筛选项值 */
  onInitValues?: StandardFilterProps["onInitValues"];
  /** 筛选项值变更 */
  onFilterChange?: StandardFilterProps["onFilterChange"];
};

/**
 * 最小化可筛选表单
 */
export const MinimizeFilter = (props: MinimizeFilterProps) => {
  const {
    className,
    style,
    classNames,
    styles,
    form: outerForm,
    initialValues,
    onValuesChange,
    extend,
    items,
    moreFilterItems,
    moreFilterProps,
    moreFilterValidCounter = filterValidCounter,
    outlinedItem = true,
    filterChangeDebounce = 200,
    normalizeValues,
    moreText,
    moreProps,
    onInitValues,
    onFilterChange,
    ...rest
  } = props;

  const { locale } = useComponentsLocale();

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
        .filter(truthy),
    [moreItems],
  );

  // 更多表单-筛选项名-字符串化防止表单项不稳定
  const moreFilterNamesStr = useMemo(
    () => jsonTryStringify(moreFilterNames),
    [moreFilterNames],
  );

  // 更多表单-筛选项值的有效性计数器
  const moreFilterValidCount = useMemo(() => {
    const names = jsonTryParse(moreFilterNamesStr);
    const count = moreFilterValidCounter(moreFilterValues, {
      validKeys: names,
    });
    return count;
  }, [moreFilterNamesStr, moreFilterValidCounter, moreFilterValues]);

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
    const initVal = refInitValues.current;
    refOnInitValues.current?.(initVal);
    form.setFieldsValue(initVal || {}); // 不使用 initialValues
  }, [form]);

  // 最小化表单-初始化 更多表单-筛选项值
  useEffect(() => {
    const initVal = refInitValues.current;
    const names = jsonTryParse(moreFilterNamesStr);
    const moreInitVal = names?.length ? pick(initVal, names) : {};
    setMoreFilterValues(moreInitVal);
  }, [moreFilterNamesStr]);

  // 最小化表单-气泡卡片 开启时重置 更多表单
  useEffect(() => {
    if (openPopover) {
      const clonedValues = { ...(moreFilterValues || {}) };
      moreFilterForm.resetFields();
      moreFilterForm.setFieldsValue(clonedValues);
    }
  }, [moreFilterForm, moreFilterValues, openPopover]);

  // 最小化表单-触发筛选项变更
  const handleFilterChange = useCallback<
    NonNullable<StandardFilterProps["onFilterChange"]>
  >(
    (moreValues, action) => {
      // 点击重置按钮
      if (action === "reset") {
        form.resetFields(); // 清空表单
      }

      // 合并 最小化表单 和 更多表单 的筛选项值
      let values = form.getFieldsValue();
      values = Object.assign({}, values, moreValues); // 浅层克隆

      // 递归清理前后空格
      if (normalizeValues) {
        const options =
          normalizeValues === true
            ? {
                trimVal: true,
                clearRecursion: true,
              }
            : normalizeValues;
        values = normalizeObject(values, options);
      }

      onFilterChange?.(values, action);
    },
    [form, normalizeValues, onFilterChange],
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
      // 触发 最小化表单-传入的同名函数
      onValuesChange?.(changedValues, allValues);

      if (filterChangeDebounce >= 0) {
        // 触发 最小化表单-触发筛选项变更-防抖
        handleFilterChangeDebounce(moreFilterValues || {}, "submit");
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
        handleFilterChange(moreFilterValues || {}, "submit");
      }
    },
    [handleFilterChange, moreFilterValues],
  );

  // 更多表单-筛选项值变更
  const handleMoreFilterChange = useCallback<
    NonNullable<StandardFilterProps["onFilterChange"]>
  >(
    (values, action) => {
      // 触发 更多表单-传入的同名函数
      onMoreFilterChange?.(values, action);
      // 触发 最小化表单-触发筛选项变更
      handleFilterChange(values, action);
      // 更新 更多表单-筛选项值
      setMoreFilterValues(values);
      // 关闭 最小化表单-气泡卡片
      setOpenPopover(false);
    },
    [handleFilterChange, onMoreFilterChange],
  );

  // 更多筛选按钮
  const moreButtonActive = moreFilterValidCount > 0;
  const moreButtonText =
    moreText ||
    (items?.length ? locale.FilterForm.moreFilter : locale.common.filterText) +
      (moreButtonActive ? ` (${moreFilterValidCount})` : "");

  const moreAction =
    moreProps === false || !moreItems?.length ? null : (
      <Popover
        className={cls(classNames?.popover)}
        style={styles?.popover}
        trigger="click"
        fresh={true}
        destroyOnHidden={false}
        destroyTooltipOnHide={false}
        open={openPopover}
        onOpenChange={setOpenPopover}
        content={
          <div
            className={cls(stl.popoverContent, classNames?.popoverContent, {
              [stl.outlined]: outlinedItem,
            })}
            style={styles?.popoverContent}
          >
            <StandardFilter
              submitText={locale.common.filterText}
              itemColSpan={12} // 两列布局
              initialValues={{}} // 会在打开气泡卡片时，手动初始化更多表单
              visibleCount={Number.MAX_SAFE_INTEGER} // 不显示展开收起
              items={moreItems}
              form={moreFilterForm}
              onFilterChange={handleMoreFilterChange}
              {...restMoreFilter}
            />
          </div>
        }
      >
        <Button
          icon={<FilterOutlined />}
          ghost={moreButtonActive}
          type={moreButtonActive ? "primary" : "default"}
          {...moreProps}
        >
          {moreButtonText}
        </Button>
      </Popover>
    );

  return (
    <Form
      className={cls(stl.minimizeFilter, className, {
        [stl.outlined]: outlinedItem,
      })}
      style={style}
      layout="inline"
      form={form}
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

/** 筛选项的有效性计数器 */
MinimizeFilter.filterValidCounter = filterValidCounter;

export default MinimizeFilter;
