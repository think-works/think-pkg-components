import { GetProp, Input, InputProps, Space, Tooltip, TreeDataNode } from "antd";
import cls, { Argument } from "classnames";
import {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  Key,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useDebounce } from "@/hooks";
import { useComponentsLocale } from "@/i18n/hooks";
import EditableTree, {
  EditableTreeProps,
  EditableTreeRef,
} from "./EditableTree";
import stl from "./index.module.less";
import { getFieldValues, getFlatNodes } from "./utils";

export type FilterTreeRef = EditableTreeRef & {
  /** 上一个匹配项 */
  prevMatched?: () => void;
  /** 下一个匹配项 */
  nextMatched?: () => void;
};

export type FilterTreeProps = EditableTreeProps & {
  className?: string;
  style?: CSSProperties;
  classNames?: EditableTreeProps["classNames"] & {
    filter?: Argument;
    editable?: Argument;
  };
  styles?: EditableTreeProps["styles"] & {
    filter?: CSSProperties;
    editable?: CSSProperties;
  };
  /** 分割线 */
  divider?: boolean;
  /** 可筛选 */
  filterable?: boolean | ((keyword: string, node: TreeDataNode) => boolean);
  /** 筛选占位符 */
  filterPlaceholder?: string;
  /** 筛选值 */
  filterValue?: string;
  /** 默认筛选值 */
  defaultFilterValue?: string;
  /** 筛选值变更-防抖毫秒时间间隔(-1 仅在 Enter 事件中触发) */
  filterChangeDebounce?: number;
  /** 筛选值变化 */
  onFilterChange?: GetProp<InputProps, "onChange">;
  /** 筛选匹配项 Key */
  filterMatchedKeys?: Key[];
  /** 默认筛选匹配项 Key */
  defaultFilterMatchedKeys?: Key[];
};

export const FilterTree = forwardRef(function FilterTreeCom(
  props: FilterTreeProps,
  ref: ForwardedRef<FilterTreeRef>,
) {
  const { locale, formatLocaleText } = useComponentsLocale();

  const {
    className,
    style,
    classNames,
    styles,
    divider = true,
    filterable = true,

    filterPlaceholder = locale.common.filterText,
    filterValue,
    defaultFilterValue,
    filterChangeDebounce = 200,
    onFilterChange,
    filterMatchedKeys: outerFilterMatchedKeys,
    defaultFilterMatchedKeys,

    treeData,
    fieldNames,
    nodeTitleRender,
    nodeWrapperRender,
    ...rest
  } = props;

  const refTimeout = useRef<any>(undefined);
  useEffect(() => {
    const timer = refTimeout.current;
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // #region 导出 Ref

  const refTree = useRef<EditableTreeRef>(null);

  useImperativeHandle(ref, () => ({
    scrollTo: (...args) => refTree.current?.scrollTo?.(...args),

    expandAll: (...args) => refTree.current?.expandAll?.(...args),
    ensureVisible: (...args) => refTree.current?.ensureVisible?.(...args),

    addNode: (...args) => refTree.current?.addNode?.(...args),
    editNode: (...args) => refTree.current?.editNode?.(...args),
    deleteNode: (...args) => refTree.current?.deleteNode?.(...args),

    prevMatched: handlePrevMatched,
    nextMatched: handleNextMatched,
  }));

  // #endregion

  // #region 处理筛选值

  // 内部 筛选匹配项 Key
  const [innerFilterMatchedKeys, setInnerFilterMatchedKeys] = useState(
    defaultFilterMatchedKeys,
  );

  /** 平面化节点 */
  const flatNodes = useMemo(
    () => (treeData ? getFlatNodes(treeData, fieldNames) : []),
    [fieldNames, treeData],
  );

  /** 筛选值变更-内部 */
  const handleFilterChangeInner = useCallback<GetProp<InputProps, "onChange">>(
    (e) => {
      const keyword = e.target.value?.trim();
      if (!keyword) {
        setInnerFilterMatchedKeys(undefined);
        return;
      }

      const filterNodes = flatNodes.filter((node) => {
        // 外部函数筛选
        if (typeof filterable === "function") {
          return filterable(keyword, node);
        }

        // 筛选节点标题(仅支持特定数据结构)
        const { normalTitle } = getFieldValues(node, fieldNames);
        let child =
          typeof normalTitle === "function" ? normalTitle(node) : normalTitle;
        if (nodeTitleRender) {
          child = nodeTitleRender(node);
        }
        if (typeof child === "string") {
          return child?.toLowerCase()?.includes(keyword?.toLowerCase());
        }
      });
      const filterKeys = filterNodes?.map((x) => x.key);

      setInnerFilterMatchedKeys(filterKeys);
    },
    [fieldNames, filterable, flatNodes, nodeTitleRender],
  );

  /** 筛选值变更-原始 */
  const handleFilterChangeOriginal = useCallback<
    GetProp<InputProps, "onChange">
  >(
    (e) => {
      // 清除当前匹配项
      setCurrMatched(-1);

      handleFilterChangeInner(e);
      onFilterChange?.(e);
    },
    [handleFilterChangeInner, onFilterChange],
  );

  /** 筛选值变更-防抖 */
  const handleFilterChangeDebounce = useDebounce(
    handleFilterChangeOriginal,
    filterChangeDebounce >= 0 ? filterChangeDebounce : 0,
  );

  /** 筛选值变更 */
  const handleFilterChange = useCallback<GetProp<InputProps, "onChange">>(
    (e) => {
      if (filterChangeDebounce >= 0) {
        // 触发 筛选值变更-防抖
        handleFilterChangeDebounce(e);
      }
    },
    [filterChangeDebounce, handleFilterChangeDebounce],
  );

  // #endregion

  // #region 处理匹配项

  // 匹配项(从 0 开始)
  const [currMatched, setCurrMatched] = useState(-1);

  // 优先使用外部 筛选匹配项 Key
  const filterMatchedKeys = outerFilterMatchedKeys || innerFilterMatchedKeys;

  // 检查计数器有效性
  const showCounter = !!filterMatchedKeys;
  const matchedCount = filterMatchedKeys?.length ?? 0;
  const validMatched = matchedCount > 0;

  /** 滚动至匹配项 */
  const scrollToFilterMatched = useCallback(
    (matched: number) => {
      const matchedKey = filterMatchedKeys?.[matched];
      if (!matchedKey) {
        return;
      }

      // 滚动节点
      refTree.current?.ensureVisible?.(matchedKey);
    },
    [filterMatchedKeys],
  );

  /** 上一个匹配项 */
  const handlePrevMatched = useCallback(() => {
    if (!validMatched) {
      return;
    }

    // 循环切换匹配项
    let prevMatched = currMatched - 1;
    prevMatched = prevMatched < 0 ? matchedCount - 1 : prevMatched;

    setCurrMatched(prevMatched);
    scrollToFilterMatched(prevMatched);
  }, [currMatched, validMatched, matchedCount, scrollToFilterMatched]);

  /** 下一个匹配项 */
  const handleNextMatched = useCallback(() => {
    if (!validMatched) {
      return;
    }

    // 循环切换匹配项
    let nextMatched = currMatched + 1;
    nextMatched = nextMatched > matchedCount - 1 ? 0 : nextMatched;

    setCurrMatched(nextMatched);
    scrollToFilterMatched(nextMatched);
  }, [currMatched, validMatched, matchedCount, scrollToFilterMatched]);

  /** 按下回车 */
  const handleFilterKeyDown = useCallback(
    (e: any) => {
      if (e?.key === "Enter" || e?.keyCode === 13) {
        if (validMatched) {
          if (e.shiftKey) {
            // 触发 上一个匹配项
            handlePrevMatched();
          } else {
            // 触发 下一个匹配项
            handleNextMatched();
          }
        } else {
          // 触发 筛选值变更
          handleFilterChangeOriginal(e);
        }
      }
    },
    [
      handleFilterChangeOriginal,
      handleNextMatched,
      handlePrevMatched,
      validMatched,
    ],
  );

  /** 渲染节点 */
  const handleNodeWrapperRender = useCallback<
    GetProp<EditableTreeProps, "nodeWrapperRender">
  >(
    (children, nodeData, ...rest) => {
      let child = children;

      const { normalKey } = getFieldValues(nodeData, fieldNames);
      const matchedKey = filterMatchedKeys?.[currMatched];

      // 匹配项包装一层
      if (filterMatchedKeys?.includes(normalKey)) {
        child = (
          <div
            className={cls(stl.matchedContainer, {
              [stl.active]: normalKey === matchedKey,
            })}
          >
            {children}
          </div>
        );
      }

      // 外部节点包装一层
      if (nodeWrapperRender) {
        child = nodeWrapperRender(child, nodeData, ...rest);
      }

      return child;
    },
    [currMatched, fieldNames, filterMatchedKeys, nodeWrapperRender],
  );

  // #endregion

  // #region 渲染筛选组件

  const countCom = useMemo(
    () =>
      validMatched ? (
        <Tooltip
          title={formatLocaleText(locale.LayoutTree.itemPosition, {
            index: currMatched + 1 || "?",
            count: matchedCount,
          })}
        >
          <span className={stl.count}>
            {currMatched + 1 || "?"}/{matchedCount}
          </span>
        </Tooltip>
      ) : (
        <Tooltip title={locale.common.emptyResult}>
          <span className={stl.count}>{locale.common.emptyResult}</span>
        </Tooltip>
      ),
    [
      currMatched,
      locale.LayoutTree.itemPosition,
      locale.common.emptyResult,
      matchedCount,
      formatLocaleText,
      validMatched,
    ],
  );

  const counterCom = useMemo(
    () =>
      !showCounter ? null : (
        <div className={stl.counter}>
          <Space size={4}>
            {countCom}
            <Tooltip title={locale.LayoutTree.previousText}>
              <ArrowUpOutlined
                className={cls(stl.filterIcon, {
                  [stl.disabled]: !validMatched,
                })}
                onClick={handlePrevMatched}
              />
            </Tooltip>
            <Tooltip title={locale.LayoutTree.nextText}>
              <ArrowDownOutlined
                className={cls(stl.filterIcon, {
                  [stl.disabled]: !validMatched,
                })}
                onClick={handleNextMatched}
              />
            </Tooltip>
          </Space>
        </div>
      ),
    [
      countCom,
      handleNextMatched,
      handlePrevMatched,
      locale.LayoutTree.nextText,
      locale.LayoutTree.previousText,
      showCounter,
      validMatched,
    ],
  );

  const filterCom = useMemo(
    () => (
      <div
        className={cls(stl.filter, classNames?.filter, {
          [stl.divider]: divider,
        })}
        style={styles?.filter}
      >
        <Input
          className={stl.input}
          allowClear
          variant="borderless"
          prefix={<SearchOutlined />}
          placeholder={filterPlaceholder}
          value={filterValue}
          defaultValue={defaultFilterValue}
          onChange={handleFilterChange}
          onKeyDown={handleFilterKeyDown}
        />
        {counterCom}
      </div>
    ),
    [
      classNames?.filter,
      counterCom,
      defaultFilterValue,
      divider,
      filterPlaceholder,
      filterValue,
      handleFilterChange,
      handleFilterKeyDown,
      styles?.filter,
    ],
  );

  // #endregion

  return (
    <div className={cls(stl.filterTree, className)} style={style}>
      {filterable ? filterCom : null}
      <EditableTree
        ref={refTree}
        className={cls(stl.editableTree, classNames?.editable)}
        style={styles?.editable}
        treeData={treeData}
        fieldNames={fieldNames}
        nodeTitleRender={nodeTitleRender}
        nodeWrapperRender={handleNodeWrapperRender}
        {...rest}
      />
    </div>
  );
});

export default FilterTree;
