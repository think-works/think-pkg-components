import { isEqual } from "lodash-es";
import {
  ForwardedRef,
  forwardRef,
  ReactElement,
  RefAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { normalizeObject } from "@/utils/tools";
import { BaseTableDefaultPageSize, BaseTableRef } from "../BaseTable";
import FetchTable, {
  FetchTableData,
  FetchTablePaging,
  FetchTableParams,
  FetchTableProps,
} from "../FetchTable";

export type FilterTableParams<FilterType = Record<string, any>> =
  FetchTableParams & {
    filter?: FilterType;
  };

export type FilterTableGetData<
  FilterType = Record<string, any>,
  DataItem = any,
> = (
  params: FilterTableParams<FilterType>,
) => void | Promise<void | FetchTableData<DataItem>>;

export type FilterTableProps<
  RecordType = any,
  FilterType = Record<string, any>,
  DataItem = any,
> = Omit<FetchTableProps<RecordType>, "pageNo" | "pageSize" | "fetchData"> & {
  /** 默认页索引 */
  defaultPage?: number;
  /** 默认页尺寸 */
  defaultSize?: number;
  /** 筛选数据 */
  filter?: FilterType;
  /** 获取数据函数 */
  fetchData?: FilterTableGetData<FilterType, DataItem>;
};

/**
 * 可筛选表格
 */
const FilterTableCom = forwardRef(function FilterTableCom<
  RecordType = any,
  FilterType = Record<string, any>,
  DataItem = any,
>(
  props: FilterTableProps<RecordType, FilterType, DataItem>,
  ref: ForwardedRef<BaseTableRef>,
) {
  const {
    defaultPage,
    defaultSize,
    filter: propsFilter,
    fetchData,
    onPagingChange,
    refreshKey: propsRefreshKey,
    ...rest
  } = props;

  const [filterKey, setFilterKey] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pageNo, setPageNo] = useState(defaultPage || 1);
  const [pageSize, setPageSize] = useState(
    defaultSize || BaseTableDefaultPageSize,
  );

  const prevPropsFilterRef = useRef(propsFilter);
  useEffect(() => {
    // 浅层对比 props.filter 和上一次 props.filter
    if (propsFilter === prevPropsFilterRef.current) {
      return;
    }

    // 清理无效属性，避免干扰深层对比
    const normalizePropsFilter =
      propsFilter &&
      normalizeObject(propsFilter, {
        clearUndefined: true,
        clearRecursion: true,
      });
    const normalizePrevPropsFilter =
      prevPropsFilterRef.current &&
      normalizeObject(prevPropsFilterRef.current, {
        clearUndefined: true,
        clearRecursion: true,
      });

    // 深层对比当前 props.filter 和 上一次 props.filter
    if (isEqual(normalizePropsFilter, normalizePrevPropsFilter)) {
      // filter 没变，刷新当前分页 (如：筛选条件不变时多次点击查询以实现刷新效果)
      setRefreshKey((prev) => prev + 1); // 触发 FetchTable 内刷新
    } else {
      // filter 变更，强制刷新，重置分页 (如：筛选条件变更时显隐动态列和清理排序状态)
      setPageNo(1);
      setFilterKey((prev) => prev + 1); // 触发 FetchTable 销毁重建
    }

    prevPropsFilterRef.current = propsFilter;
  }, [propsFilter]);

  useEffect(() => {
    onPagingChange?.({
      pageNo,
      pageSize,
    });
  }, [onPagingChange, pageNo, pageSize]);

  const handleFetchData = useCallback(
    (params: FilterTableParams<FilterType>) =>
      fetchData?.({
        ...params,
        filter: propsFilter,
      }),
    [fetchData, propsFilter],
  );

  const handlePagingChange = useCallback((nextPaging: FetchTablePaging) => {
    const { pageNo, pageSize } = nextPaging;
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  return (
    <FetchTable
      ref={ref}
      key={filterKey}
      refreshKey={`${propsRefreshKey}-${refreshKey}`}
      pageNo={pageNo}
      pageSize={pageSize}
      fetchData={handleFetchData}
      onPagingChange={handlePagingChange}
      {...rest}
    />
  );
});

type FilterTableComponent = <
  RecordType = any,
  FilterType = Record<string, any>,
  DataItem = any,
>(
  props: FilterTableProps<RecordType, FilterType, DataItem> &
    RefAttributes<BaseTableRef>,
) => ReactElement | null;

export const FilterTable = FilterTableCom as FilterTableComponent;

export default FilterTable;
