import { isEmpty, isEqual, omit } from "lodash-es";
import React, { useCallback } from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import type { Location } from "@remix-run/router";
import { normalizeObject, parseQuery, stringifyQuery } from "@/utils/tools";
import { DFT_SIZE } from "../BaseTable";
import FetchTable, {
  FetchData,
  FetchParams,
  FetchTableProps,
  PagingParams,
} from "../FetchTable";

const withRouter =
  (Component: any) =>
  (props: Omit<RouteTableProps, "location" | "navigate">) => {
    const location = useLocation();
    const navigate = useNavigate();
    return <Component location={location} navigate={navigate} {...props} />;
  };

export type RouteParams<FilterType = Record<string, any>> = {
  filter?: FilterType;
} & FetchParams;

export type RouteTableProps<
  RecordType = any,
  FilterType = Record<string, any>,
> = Omit<
  FetchTableProps<RecordType>,
  "pageNo" | "pageSize" | "fetchData" | "onPagingChange"
> & {
  location: Location;
  navigate: NavigateFunction;
  filter?: FilterType;
  fetchData?: (params: RouteParams) => void | Promise<FetchData | void>;
};

const QUERY_PAGE_KEY = "pageNo";
const QUERY_SIZE_KEY = "pageSize";
const QUERY_FILTER_KEY = "filter";

const tryParse = (value?: string): any => {
  if (value) {
    let val = value;
    try {
      val = JSON.parse(val);
    } catch (error) {
      // console.warn(error);
    }
    return val;
  }
  return value;
};

const tryStringify = (value?: string) => {
  if (value) {
    let val = value;
    try {
      val = JSON.stringify(val);
    } catch (error) {
      // console.warn(error);
    }
    return val;
  }
  return value;
};

export const clearPageSearch = (search: string) => {
  const query = parseQuery(search);
  const newQuery = omit(query, [
    QUERY_PAGE_KEY,
    QUERY_SIZE_KEY,
    QUERY_FILTER_KEY,
  ]);

  return stringifyQuery(newQuery);
};

export const parsePageSearch = (search: string) => {
  const query = parseQuery(search);

  const pageNo = tryParse(query[QUERY_PAGE_KEY]);
  const pageSize = tryParse(query[QUERY_SIZE_KEY]);
  const filter = tryParse(query[QUERY_FILTER_KEY]);

  return {
    pageNo,
    pageSize,
    filter,
  };
};

export const updatePageSearch = (search: string, diff: Record<string, any>) => {
  const query = parseQuery(search);

  const _diff: Record<string, any> = {};
  Object.keys(diff).forEach((key) => {
    _diff[key] = tryStringify(diff[key]);
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
export const useClearPageSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const clear = useCallback(() => {
    const search = clearPageSearch(location.search);
    navigate({ search }, { replace: true });
  }, [location.search, navigate]);

  return clear;
};

/**
 * 从路由查询参数中获取分页查询参数
 */
export const useParsePageSearch = () => {
  const location = useLocation();
  const query = parsePageSearch(location.search);
  return query;
};

/**
 * 从路由查询参数中获取筛选条件
 */
export const useSearchFilterValue = () => {
  const { filter } = useParsePageSearch();
  return filter;
};

class RouteTable extends React.Component<RouteTableProps, any> {
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
      pageSize: pageSize || DFT_SIZE,
      filter: filter,
      filterKey: 0,
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

  private fetchData = (params: FetchParams) => {
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

  private handlePagingChange = (paging: PagingParams) => {
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
    ]);
    const { pageNo, pageSize, filterKey } = this.state;

    return (
      <FetchTable
        key={filterKey}
        pageNo={pageNo}
        pageSize={pageSize}
        fetchData={this.fetchData}
        onPagingChange={this.handlePagingChange}
        {...rest}
      />
    );
  }
}

const RouteTableWrapper = withRouter(RouteTable);

export default RouteTableWrapper;
