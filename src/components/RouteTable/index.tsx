import { isEqual, isPlainObject, omit, pick } from "lodash-es";
import {
  ForwardedRef,
  forwardRef,
  ReactElement,
  RefAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router";
import {
  isType,
  jsonTryParse,
  jsonTryStringify,
  normalizeObject,
  parseQuery,
  stringifyQuery,
} from "@/utils/tools";
import { BaseTableDefaultPageSize, BaseTableRef } from "../BaseTable";
import { FetchTablePaging } from "../FetchTable";
import FilterTable, { FilterTableProps } from "../FilterTable";

const isNumber = (val: any) => isType<number>(val, "Number");

// #region 路由辅助函数

const QUERY_PAGE_KEY = "pageNo";
const QUERY_SIZE_KEY = "pageSize";
const QUERY_FILTER_KEY = "filter";

type ParsedPageSearch = {
  /** 页索引 */
  pageNo?: number;
  /** 页尺寸 */
  pageSize?: number;
  /** 筛选数据 */
  filter?: Record<string, any>;
};

/**
 * 清理查询参数中的分页参数
 */
const clearPageSearch = (search: string) => {
  const query = parseQuery(search);
  const newQuery = omit(query, [
    QUERY_PAGE_KEY,
    QUERY_SIZE_KEY,
    QUERY_FILTER_KEY,
  ]);

  return stringifyQuery(newQuery);
};

/**
 * 从查询参数中获取分页参数
 */
const parsePageSearch = (search: string) => {
  const query = parseQuery(search);

  // 空字符串值认为是 undefined
  const pageStr = query[QUERY_PAGE_KEY] || undefined;
  const sizeStr = query[QUERY_SIZE_KEY] || undefined;
  const filterStr = query[QUERY_FILTER_KEY] || undefined;

  // 尝试解析字符串为原始值
  const pageVal = jsonTryParse(pageStr) ?? undefined;
  const sizeVal = jsonTryParse(sizeStr) ?? undefined;
  const filterVal = jsonTryParse(filterStr) ?? undefined;

  // 值有效才会保留在结果中
  const parsed: ParsedPageSearch = {};

  parsed.pageNo = isNumber(pageVal) ? pageVal : undefined;
  parsed.pageSize = isNumber(sizeVal) ? sizeVal : undefined;
  parsed.filter = isPlainObject(filterVal) ? filterVal : undefined;

  return parsed;
};

/**
 * 更新查询参数中的分页参数
 */
const updatePageSearch = (search: string, diff: ParsedPageSearch) => {
  const query = parseQuery(search);

  // 值有效才会更新查询参数
  const _diff: Record<string, any> = {};
  const { pageNo, pageSize, filter } = diff;

  if ("pageNo" in diff) {
    _diff[QUERY_PAGE_KEY] = isNumber(pageNo)
      ? jsonTryStringify(pageNo)
      : undefined;
  }
  if ("pageSize" in diff) {
    _diff[QUERY_SIZE_KEY] = isNumber(pageSize)
      ? jsonTryStringify(pageSize)
      : undefined;
  }
  if ("filter" in diff) {
    _diff[QUERY_FILTER_KEY] = isPlainObject(filter)
      ? jsonTryStringify(filter)
      : undefined;
  }

  const newQuery = { ...query, ..._diff };
  const pageQuery = pick(newQuery, [
    QUERY_PAGE_KEY,
    QUERY_SIZE_KEY,
    QUERY_FILTER_KEY,
  ]);
  const otherQuery = omit(newQuery, [
    QUERY_PAGE_KEY,
    QUERY_SIZE_KEY,
    QUERY_FILTER_KEY,
  ]);

  return stringifyQuery({ ...pageQuery, ...otherQuery });
};

/**
 * 清理路由查询参数中的分页查询参数
 */
const useClearPageSearch = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const clear = useCallback(() => {
    const clearedSearch = clearPageSearch(search);
    navigate({ search: clearedSearch }, { replace: true });
  }, [search, navigate]);

  return clear;
};

/**
 * 从路由查询参数中获取分页查询参数
 */
const useParsePageSearch = () => {
  const { search } = useLocation();
  const query = useMemo(() => parsePageSearch(search), [search]);
  return query;
};

/**
 * 从路由查询参数中获取筛选条件
 */
const useSearchFilterValue = () => {
  const { filter } = useParsePageSearch();
  return filter;
};

// #endregion

export type RouteTableProps<
  RecordType = any,
  FilterType = Record<string, any>,
  DataItem = any,
> = Omit<FilterTableProps<RecordType, FilterType, DataItem>, "onPagingChange">;

/**
 * 路由表格
 */
const RouteTableCom = forwardRef(function RouteTableCom<
  RecordType = any,
  FilterType = Record<string, any>,
  DataItem = any,
>(
  props: RouteTableProps<RecordType, FilterType, DataItem>,
  ref: ForwardedRef<BaseTableRef>,
) {
  const { defaultPage, defaultSize, filter: propsFilter, ...rest } = props;

  const navigate = useNavigate();
  const { search } = useLocation();

  const {
    pageNo: queryPageNo,
    pageSize: queryPageSize,
    filter: queryFilter,
  } = useMemo(() => parsePageSearch(search), [search]);

  const [pageNo, setPageNo] = useState(queryPageNo || defaultPage || 1);
  const [pageSize, setPageSize] = useState(
    queryPageSize || defaultSize || BaseTableDefaultPageSize,
  );

  useEffect(() => {
    const diff: ParsedPageSearch = {};

    // 同步分页参数到路由
    if (pageNo !== queryPageNo) {
      diff.pageNo = pageNo;
    }
    if (pageSize !== queryPageSize) {
      diff.pageSize = pageSize;
    }

    // 同步 props.filter 至 query.filter
    const normalizePropsFilter =
      propsFilter &&
      normalizeObject(propsFilter, {
        clearUndefined: true,
        clearRecursion: true,
      });
    const normalizeQueryFilter =
      queryFilter &&
      normalizeObject(queryFilter, {
        clearUndefined: true,
        clearRecursion: true,
      });

    // 深层对比 props.filter 和 query.filter
    if (!isEqual(normalizePropsFilter, normalizeQueryFilter)) {
      diff.filter = propsFilter as Record<string, any> | undefined;
    }

    // 没有变更时不更新查询参数，避免循环更新
    if (Object.keys(diff).length === 0) {
      return;
    }

    const newSearch = updatePageSearch(search, diff);
    navigate({ search: newSearch }, { replace: true });
  }, [
    navigate,
    pageNo,
    pageSize,
    propsFilter,
    queryFilter,
    queryPageNo,
    queryPageSize,
    search,
  ]);

  const handlePagingChange = useCallback((nextPaging: FetchTablePaging) => {
    const { pageNo, pageSize } = nextPaging;
    setPageNo(pageNo);
    setPageSize(pageSize);
  }, []);

  return (
    <FilterTable
      ref={ref}
      defaultPage={pageNo}
      defaultSize={pageSize}
      filter={propsFilter}
      onPagingChange={handlePagingChange}
      {...rest}
    />
  );
});

type RouteTableComponent = <
  RecordType = any,
  FilterType = Record<string, any>,
  DataItem = any,
>(
  props: RouteTableProps<RecordType, FilterType, DataItem> &
    RefAttributes<BaseTableRef>,
) => ReactElement | null;

type RouteTableComponentStatics = RouteTableComponent & {
  clearPageSearch: typeof clearPageSearch;
  parsePageSearch: typeof parsePageSearch;
  updatePageSearch: typeof updatePageSearch;
  useClearPageSearch: typeof useClearPageSearch;
  useParsePageSearch: typeof useParsePageSearch;
  useSearchFilterValue: typeof useSearchFilterValue;
};

export const RouteTable = Object.assign(RouteTableCom, {
  clearPageSearch,
  parsePageSearch,
  updatePageSearch,
  useClearPageSearch,
  useParsePageSearch,
  useSearchFilterValue,
}) as RouteTableComponentStatics;

export default RouteTable;
