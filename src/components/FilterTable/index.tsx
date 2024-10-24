import { isEqual, omit } from "lodash-es";
import React from "react";
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

/**
 * 可筛选表格
 */
export class FilterTable extends React.Component<FilterTableProps, any> {
  static getDerivedStateFromProps(props: FilterTableProps, state: any) {
    let diff = null;

    // 浅层对比
    if (props.filter !== state.filter) {
      // 深层对比
      if (isEqual(props.filter, state.filter)) {
        console.log("filter 相同，刷新当前分页");
        // filter 没变，刷新当前分页
        diff = Object.assign({}, diff, {
          refreshKey: state.refreshKey + 1,
        });
      } else {
        console.log("filter 不相同，刷新当前分页");

        // filter 变更，强制刷新，重置分页
        diff = Object.assign({}, diff, {
          pageNo: 1,
          filter: props.filter,
          filterKey: state.filterKey + 1,
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
    ]);
    const { pageNo, pageSize, filterKey, refreshKey } = this.state;

    return (
      <FetchTable
        key={filterKey}
        refreshKey={refreshKey}
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
