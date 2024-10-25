import { isEqual, omit } from "lodash-es";
import React from "react";
import { normalizeObject } from "@/utils/tools";
import { BaseTableDefaultPageSize } from "../BaseTable";
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

export type FilterTableData<Item = any> = FetchTableData<Item>;

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
> = Omit<
  FetchTableProps<RecordType>,
  "pageNo" | "pageSize" | "fetchData" | "onPagingChange"
> & {
  /** 默认页索引 */
  defaultPage?: number;
  /** 默认页尺寸 */
  defaultSize?: number;
  /** 筛选数据 */
  filter?: FilterType;
  /** 获取数据函数 */
  fetchData?: FilterTableGetData<FilterType, DataItem>;
};

export type FilterTableState = {
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
 * 可筛选表格
 */
export class FilterTable extends React.Component<
  FilterTableProps,
  FilterTableState
> {
  static getDerivedStateFromProps(
    props: FilterTableProps,
    state: FilterTableState,
  ): FilterTableState | null {
    let diff: FilterTableState | null = null;

    // 浅层对比 props.filter 和 state.filter
    if (props.filter !== state.filter) {
      // 保持同步 props.filter 和 state.filter
      diff = Object.assign({}, diff, {
        filter: props.filter,
      });

      // 清理无效属性，避免干扰深层对比
      const normalizePropsFilter = normalizeObject(props.filter as any, {
        clearUndefined: true,
      });
      const normalizeStateFilter = normalizeObject(state.filter as any, {
        clearUndefined: true,
      });

      // 深层对比 props.filter 和 state.filter
      if (isEqual(normalizePropsFilter, normalizeStateFilter)) {
        // filter 没变，刷新当前分页
        diff = Object.assign({}, diff, {
          refreshKey: state.refreshKey + 1, // 触发 FetchTable 内刷新
        });
      } else {
        // filter 变更，强制刷新，重置分页
        diff = Object.assign({}, diff, {
          pageNo: 1,
          filterKey: state.filterKey + 1, // 触发 FetchTable 销毁重建
        });
      }
    }

    return diff;
  }

  constructor(props: FilterTableProps) {
    super(props);
    const { defaultPage, defaultSize, filter } = props;

    this.state = {
      pageNo: defaultPage || 1,
      pageSize: defaultSize || BaseTableDefaultPageSize,
      filter: filter,
      filterKey: 0,
      refreshKey: 0,
    };
  }

  private fetchData = (params: FilterTableParams) => {
    const { fetchData } = this.props;
    const { filter } = this.state;

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
    this.setState({ pageNo, pageSize });
  };

  render() {
    const { ...rest } = omit(this.props, [
      "defaultPage",
      "defaultSize",
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

export default FilterTable;
