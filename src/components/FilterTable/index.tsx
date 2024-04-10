import { isEqual, omit } from "lodash-es";
import React from "react";
import { DFT_SIZE } from "../BaseTable";
import FetchTable, {
  FetchData,
  FetchParams,
  FetchTableProps,
  PagingParams,
} from "../FetchTable";

export type FilterParams<FilterType = Record<string, any>> = {
  filter?: FilterType;
} & FetchParams;

export type FilterTableProps<
  RecordType = any,
  FilterType = Record<string, any>,
> = Omit<
  FetchTableProps<RecordType>,
  "pageNo" | "pageSize" | "fetchData" | "onPagingChange"
> & {
  defaultPage?: number;
  defaultSize?: number;
  filter?: FilterType;
  fetchData?: (params: FilterParams) => void | Promise<FetchData | void>;
};

class FilterTable extends React.Component<FilterTableProps, any> {
  static getDerivedStateFromProps(props: FilterTableProps, state: any) {
    let diff = null;

    if (!isEqual(props.filter, state.filter)) {
      // filter 变更，强制刷新，重置分页
      diff = Object.assign({}, diff, {
        pageNo: 1,
        filter: props.filter,
        filterKey: state.filterKey + 1,
      });
    }

    return diff;
  }

  constructor(props: FilterTableProps) {
    super(props);
    const { defaultPage, defaultSize, filter } = props;

    this.state = {
      pageNo: defaultPage || 1,
      pageSize: defaultSize || DFT_SIZE,
      filter: filter,
      filterKey: 0,
    };
  }

  private fetchData = (params: FetchParams) => {
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

  private handlePagingChange = (paging: PagingParams) => {
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

export default FilterTable;
