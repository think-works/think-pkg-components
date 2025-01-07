import { omit } from "lodash-es";
import { isBoolean } from "lodash-es";
import React from "react";
import logger from "@/utils/logger";
import BaseTable, {
  BaseTableDefaultPageSize,
  BaseTableProps,
} from "../BaseTable";

const API_PAGE_KEY = "pageNo";
const API_SIZE_KEY = "pageSize";
const API_TOTAL_KEY = "total";
const API_LIST_KEY = "list";

type RawOnChange = NonNullable<BaseTableProps["onChange"]>;

export type FetchTablePaging = {
  /** 页索引 */
  pageNo: number;
  /** 页尺寸 */
  pageSize: number;
};

export type FetchTableParams = FetchTablePaging;

export type FetchTableData<Item = any> = {
  /** 页索引 */
  pageNo?: number;
  /** 页尺寸 */
  pageSize?: number;
  /** 总记录数量 */
  total?: number;
  /** 当前页记录 */
  list?: Item[];
};

export type FetchTableGetData<DataItem = any> = (
  params: FetchTableParams,
) => void | Promise<void | FetchTableData<DataItem>>;

export type FetchTableProps<RecordType = any, DataItem = any> = Omit<
  BaseTableProps<RecordType>,
  "onChange"
> & {
  /** 页索引 */
  pageNo?: number;
  /** 页尺寸 */
  pageSize?: number;
  /** 刷新当前分页 */
  refreshKey?: number | string;
  /** 延时显示加载中(ms) */
  loadingDelay?: number;
  /** 获取数据函数 */
  fetchData?: FetchTableGetData<DataItem>;
  /** 分页变更 */
  onPagingChange?: (params: FetchTablePaging) => void;
  /** 分页、排序、筛选变更(返回 true 可忽略后续流程) */
  onChange?: (...rest: Parameters<RawOnChange>) => void | boolean;
};

export type FetchTableState = {
  /** 加载中 */
  loading: boolean;
  /** 页索引 */
  current: number;
  /** 页尺寸 */
  pageSize: number;
  /** 总记录数量 */
  total: number;
  /** 当前页记录 */
  dataSource: any[];
};

/**
 * 可查询表格
 */
export class FetchTable extends React.Component<
  FetchTableProps,
  FetchTableState
> {
  mounted = false;
  queryTimer: any;
  loadingTimer: any;

  constructor(props: FetchTableProps) {
    super(props);
    const { pagination } = props;
    const { defaultPageSize } = pagination || {};

    this.state = {
      loading: false,
      total: 0,
      current: 1,
      pageSize: defaultPageSize || BaseTableDefaultPageSize,
      dataSource: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
    /**
     * 触发时间早于 http 初始化，需要延迟触发
     * <StrictMode /> 下触发两次符合预期行为
     * https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-double-rendering-in-development
     */
    clearTimeout(this.queryTimer);
    this.queryTimer = setTimeout(() => {
      this.queryData();
    }, 0);
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.queryTimer);
    clearTimeout(this.loadingTimer);
  }

  componentDidUpdate(prevProps: FetchTableProps) {
    const {
      pageNo: currPage,
      pageSize: currSize,
      refreshKey: currRefreshKey,
    } = this.props;
    const {
      pageNo: prevPage,
      pageSize: prevSize,
      refreshKey: prevRefreshKey,
    } = prevProps;

    // 参数变更，查询数据
    if (
      currPage !== prevPage ||
      currSize !== prevSize ||
      currRefreshKey !== prevRefreshKey
    ) {
      this.queryData();
    }
  }

  // 更新分页参数
  private updatePaging = (paging: any) => {
    const { pageNo, pageSize, onPagingChange } = this.props;

    if (typeof onPagingChange === "function") {
      onPagingChange({
        pageNo,
        pageSize,
        ...(paging || {}),
      });
    }
  };

  // 查询分页数据
  private queryData = async () => {
    const { pageNo, pageSize, loadingDelay = 200, fetchData } = this.props;

    const params = {
      [API_PAGE_KEY]: pageNo || 1,
      [API_SIZE_KEY]: pageSize || BaseTableDefaultPageSize,
    };

    // 加载很快时，不显示
    clearTimeout(this.loadingTimer);
    this.loadingTimer = setTimeout(() => {
      this.setState({
        loading: true,
      });
    }, loadingDelay);

    try {
      const fn = fetchData ? fetchData : () => Promise.resolve();
      const res = (await fn(params)) || {};
      const pageNo = res[API_PAGE_KEY];
      const pageSize = res[API_SIZE_KEY];
      const total = res[API_TOTAL_KEY];
      const list = res[API_LIST_KEY];

      if (this.mounted) {
        this.setState({
          total: total || 0,
          current: pageNo || 1,
          pageSize: pageSize || BaseTableDefaultPageSize,
          dataSource: list || [],
        });
      }
    } catch (error) {
      logger.error(error);
    } finally {
      clearTimeout(this.loadingTimer);
      if (this.mounted) {
        this.setState({
          loading: false,
        });
      }
    }
  };

  // 分页参数变更
  private handleChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any,
  ) => {
    const { onChange } = this.props;

    // 触发外部事件
    const ignore = onChange && onChange(pagination, filters, sorter, extra);
    if (ignore) {
      return;
    }

    // 将分页参数保存至外部
    const { current, pageSize } = pagination || {};
    this.updatePaging({
      pageNo: current,
      pageSize: pageSize,
    });
  };

  render() {
    const { pagination, ...rest } = omit(this.props, [
      "pageNo",
      "pageSize",
      "refreshKey",
      "fetchData",
      "onPagingChange",
      "onChange",
      "loading",
      "dataSource",
    ]);
    const { loading, total, current, pageSize, dataSource } = this.state;

    return (
      <BaseTable
        loading={loading}
        dataSource={dataSource}
        pagination={
          isBoolean(pagination)
            ? pagination
            : {
                total,
                current,
                pageSize,
                ...(pagination || {}),
              }
        }
        onChange={this.handleChange}
        {...rest}
      />
    );
  }
}

export default FetchTable;
