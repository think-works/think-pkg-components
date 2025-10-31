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
  filterable?:
    | boolean
    | ((keyword: string, node: TreeDataNode) => boolean | void);
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
  const {
    className,
    style,
    classNames,
    styles,
    divider = true,
    filterable = true,

    filterPlaceholder = "搜索",
    filterValue,
    defaultFilterValue,
    filterChangeDebounce = 200,
    onFilterChange,
    filterMatchedKeys: outerFilterMatchedKeys,
    defaultFilterMatchedKeys,

    treeData,
    fieldNames,
    autoExpandParent,
    defaultExpandedKeys,
    expandedKeys,
    onExpand,
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

  /**
   * 直接多层 ref 透传函数，祖父组件调用孙组件函数时，会访问到旧版闭包数据。
   * 至少需要在直接父级组件中用函数包装一次，祖父组件才会访问到新版闭包数据。
   */
  useImperativeHandle(ref, () => ({
    scrollTo: (...args) => refTree.current?.scrollTo?.(...args),
    addNode: (...args) => refTree.current?.addNode?.(...args),
    editNode: (...args) => refTree.current?.editNode?.(...args),
    deleteNode: (...args) => refTree.current?.deleteNode?.(...args),

    prevMatched: (...args) => handlePrevMatched?.(...args),
    nextMatched: handleNextMatched,
  }));

  // #endregion

  // #region 同步外部属性

  const [innerAutoExpandParent, setInnerAutoExpandParent] =
    useState(autoExpandParent);
  const [innerExpandedKeys, setInnerExpandedKeys] = useState(
    expandedKeys || defaultExpandedKeys,
  );

  useEffect(() => {
    setInnerAutoExpandParent(autoExpandParent);
  }, [autoExpandParent]);

  useEffect(() => {
    setInnerExpandedKeys(expandedKeys);
  }, [expandedKeys]);

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

      // 筛选节点标题(仅支持特定数据结构)
      const filterNodes = flatNodes.filter((node) => {
        const { normalTitle } = getFieldValues(node, fieldNames);

        if (typeof normalTitle === "string") {
          return normalTitle?.toLowerCase()?.includes(keyword?.toLowerCase());
        } else if (typeof filterable === "function") {
          return filterable(keyword, node);
        }
      });
      const filterKeys = filterNodes?.map((x) => x.key);

      setInnerFilterMatchedKeys(filterKeys);
    },
    [fieldNames, filterable, flatNodes],
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

  /** 展开节点 */
  const handleExpand = useCallback<GetProp<EditableTreeProps, "onExpand">>(
    (expandedKeys, ...rest) => {
      // 恢复自动展开状态
      setInnerAutoExpandParent(autoExpandParent ?? false);
      setInnerExpandedKeys(expandedKeys);

      onExpand?.(expandedKeys, ...rest);
    },
    [autoExpandParent, onExpand],
  );

  /** 滚动至匹配项 */
  const scrollToFilterMatched = useCallback(
    (matched: number) => {
      const matchedKey = filterMatchedKeys?.[matched];
      if (!matchedKey) {
        return;
      }

      // 展开指定节点的父节点
      setInnerAutoExpandParent(true);
      setInnerExpandedKeys([matchedKey]);

      // 滚动至指定节点(延迟等待节点收起)
      clearTimeout(refTimeout.current);
      refTimeout.current = setTimeout(() => {
        refTree.current?.scrollTo?.({
          key: matchedKey,
          align: "auto",
        });
      }, 20);
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
          title={`第 ${currMatched + 1 || "?"} 项 / 共 ${matchedCount} 项`}
        >
          <span className={stl.count}>
            {currMatched + 1 || "?"}/{matchedCount}
          </span>
        </Tooltip>
      ) : (
        <Tooltip title="无结果">
          <span className={stl.count}>无结果</span>
        </Tooltip>
      ),
    [currMatched, matchedCount, validMatched],
  );

  const counterCom = useMemo(
    () =>
      !showCounter ? null : (
        <div className={stl.counter}>
          <Space size={4}>
            {countCom}
            <Tooltip title="上一个">
              <ArrowUpOutlined
                className={cls(stl.filterIcon, {
                  [stl.disabled]: !validMatched,
                })}
                onClick={handlePrevMatched}
              />
            </Tooltip>
            <Tooltip title="下一个">
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
    [countCom, handleNextMatched, handlePrevMatched, showCounter, validMatched],
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
        autoExpandParent={innerAutoExpandParent}
        defaultExpandedKeys={defaultExpandedKeys}
        expandedKeys={innerExpandedKeys}
        onExpand={handleExpand}
        nodeWrapperRender={handleNodeWrapperRender}
        {...rest}
      />
    </div>
  );
});

export default FilterTree;
