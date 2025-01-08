import { isEmpty, isEqual, isNumber, isPlainObject, omit } from "lodash-es";
import React, { JSX, useCallback, useMemo } from "react";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router";
import {
  jsonTryParse,
  jsonTryStringify,
  normalizeObject,
  parseQuery,
  stringifyQuery,
} from "@/utils/tools";
import { BaseTableDefaultPageSize } from "../BaseTable";
import FetchTable, {
  FetchTableData,
  FetchTablePaging,
  FetchTableParams,
  FetchTableProps,
} from "../FetchTable";
import { FilterTableParams } from "../FilterTable";

const QUERY_PAGE_KEY = "pageNo";
const QUERY_SIZE_KEY = "pageSize";
const QUERY_FILTER_KEY = "filter";

/**
 * 清理查询参数中的分页查询参数
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
 * 从查询参数中获取分页查询参数
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

  // 检查原始值的格式
  const pageNo = isNumber(pageVal) ? pageVal : undefined;
  const pageSize = isNumber(sizeVal) ? sizeVal : undefined;
  const filter = isPlainObject(filterVal)
    ? (filterVal as Record<string, any>)
    : undefined;

  return {
    pageNo,
    pageSize,
    filter,
  };
};

/**
 * 从查询参数中获取筛选条件
 */
const updatePageSearch = (search: string, diff: Record<string, any>) => {
  const query = parseQuery(search);

  const _diff: Record<string, any> = {};
  Object.keys(diff).forEach((key) => {
    _diff[key] = jsonTryStringify(diff[key]);
  });

  return stringifyQuery(
    {
      ...query,
      ..._diff,
    },
    {
      sortKey: true,
    },
  );
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

export type RouteTableParams<FilterType = Record<string, any>> =
  FilterTableParams<FilterType>;

export type RouteTableData<Item = any> = FetchTableData<Item>;

export type RouteTableGetData<
  FilterType = Record<string, any>,
  DataItem = any,
> = (
  params: RouteTableParams<FilterType>,
) => void | Promise<void | RouteTableData<DataItem>>;

export type RouteTableProps<
  RecordType = any,
  FilterType = Record<string, any>,
  DataItem = any,
> = Omit<
  FetchTableProps<RecordType>,
  "pageNo" | "pageSize" | "fetchData" | "onPagingChange"
> & {
  /** 路由位置 */
  location: Location;
  /** 路由导航 */
  navigate: NavigateFunction;
  /** 筛选数据 */
  filter?: FilterType;
  /** 获取数据函数 */
  fetchData?: RouteTableGetData<FilterType, DataItem>;
};

export type RouteTableState = {
  /** 页索引 */
  pageNo: number;
  /** 页尺寸 */
  pageSize: number;
  /** 筛选数据 */
  filter: Record<string, any> | undefined;
  /** 重置筛选表格 */
  filterKey: number;
  /** 刷新当前分页 */
  refreshKey: number;
};

/**
 * 路由表格
 */
class RouteTableComponent extends React.Component<
  RouteTableProps,
  RouteTableState
> {
  static getDerivedStateFromProps(props: RouteTableProps, state: any) {
    const { location } = props;
    const { pageNo, pageSize, filter } = parsePageSearch(location.search);

    let diff = null;

    if (pageNo !== state.pageNo) {
      diff = Object.assign({}, diff, {
        pageNo,
      });
    }

    if (pageSize !== state.pageSize) {
      diff = Object.assign({}, diff, {
        pageSize,
      });
    }

    if (!isEqual(filter, state.filter)) {
      // filter 变更，强制刷新，重置分页
      diff = Object.assign({}, diff, {
        pageNo: 1, // 重置分页
        filter: filter,
        filterKey: state.filterKey + 1,
      });
    }

    return diff;
  }

  constructor(props: RouteTableProps) {
    super(props);

    const { location } = props;
    const { pageNo, pageSize, filter } = parsePageSearch(location.search);

    this.state = {
      pageNo: pageNo || 1,
      pageSize: pageSize || BaseTableDefaultPageSize,
      filter: filter,
      filterKey: 0,
      refreshKey: 0,
    };
  }

  componentDidUpdate(prevProps: any) {
    let { filter: currFilter } = this.props;
    let { filter: prevFilter } = prevProps;

    currFilter = normalizeObject(currFilter as any, {
      sortKey: true,
      clearNull: true,
      clearUndefined: true,
    });
    prevFilter = normalizeObject(prevFilter as any, {
      sortKey: true,
      clearNull: true,
      clearUndefined: true,
    });

    if (!isEqual(currFilter, prevFilter)) {
      this.setQuery({
        pageNo: 1, // 重置分页
        filter: isEmpty(currFilter) ? "" : currFilter,
      });
    }
  }
  private setQuery = (diff: Record<string, any>) => {
    const { navigate, location } = this.props;
    const newSearch = updatePageSearch(location.search, diff);

    navigate(
      {
        ...location,
        search: newSearch,
      },
      {
        replace: true,
      },
    );
  };

  private fetchData = (params: FetchTableParams) => {
    const { location, fetchData } = this.props;
    const { filter } = parsePageSearch(location.search);

    return (
      fetchData &&
      fetchData({
        ...params,
        filter,
      })
    );
  };

  private handlePagingChange = (paging: FetchTablePaging) => {
    const { pageNo, pageSize } = paging;

    this.setQuery({ pageNo, pageSize });
  };

  render() {
    const { ...rest } = omit(this.props, [
      "location",
      "navigate",
      "pageNo",
      "pageSize",
      "filter",
      "fetchData",
      "onPagingChange",
      "refreshKey",
    ]);
    const { refreshKey: propsRefreshKey } = this.props;
    const { pageNo, pageSize, filterKey, refreshKey } = this.state;

    return (
      <FetchTable
        key={filterKey}
        refreshKey={`${propsRefreshKey}-${refreshKey}`}
        pageNo={pageNo}
        pageSize={pageSize}
        fetchData={this.fetchData}
        onPagingChange={this.handlePagingChange}
        {...rest}
      />
    );
  }
}

type withRouterResult = (
  props: Omit<RouteTableProps, "location" | "navigate">,
) => JSX.Element;

type withRouterFunc = (
  Component: React.ComponentType<RouteTableProps>,
) => withRouterResult;

type WrapperComponent = withRouterResult & {
  clearPageSearch: typeof clearPageSearch;
  parsePageSearch: typeof parsePageSearch;
  updatePageSearch: typeof updatePageSearch;
  useClearPageSearch: typeof useClearPageSearch;
  useParsePageSearch: typeof useParsePageSearch;
  useSearchFilterValue: typeof useSearchFilterValue;
};

const withRouter: withRouterFunc = (Component) => {
  const RouterCom = (props: Parameters<withRouterResult>[0]) => {
    const location = useLocation();
    const navigate = useNavigate();
    return <Component location={location} navigate={navigate} {...props} />;
  };
  return RouterCom;
};

/**
 * 路由表格包装
 */
export const RouteTable = withRouter(RouteTableComponent) as WrapperComponent;

RouteTable.clearPageSearch = clearPageSearch;
RouteTable.parsePageSearch = parsePageSearch;
RouteTable.updatePageSearch = updatePageSearch;
RouteTable.useClearPageSearch = useClearPageSearch;
RouteTable.useParsePageSearch = useParsePageSearch;
RouteTable.useSearchFilterValue = useSearchFilterValue;

export default RouteTable;
