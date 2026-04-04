import {
  ForwardedRef,
  forwardRef,
  ReactElement,
  RefAttributes,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import logger from "@/utils/logger";
import { isType } from "@/utils/tools";
import BaseTable, {
  BaseTableDefaultPageSize,
  BaseTableProps,
  BaseTableRef,
} from "../BaseTable";

const isNumber = (val: any) => isType<number>(val, "Number");
const isBoolean = (val: any) => isType<boolean>(val, "Boolean");

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
  /** 首次请求延时(ms) */
  firstQueryDelay?: boolean | number;
  /** 获取数据函数 */
  fetchData?: FetchTableGetData<DataItem>;
  /** 分页变更 */
  onPagingChange?: (nextPaging: FetchTablePaging) => void;
  /** 分页、排序、筛选变更(返回 true 可忽略后续流程) */
  onChange?: (...rest: Parameters<RawOnChange>) => void | boolean;
};

/**
 * 可查询表格
 */
const FetchTableCom = forwardRef(function FetchTableCom<
  RecordType = any,
  DataItem = any,
>(
  props: FetchTableProps<RecordType, DataItem>,
  ref: ForwardedRef<BaseTableRef>,
) {
  const {
    pageNo: propsPageNo,
    pageSize: propsPageSize,
    refreshKey,
    loadingDelay = 200,
    firstQueryDelay,
    fetchData,
    onPagingChange,
    onChange,
    pagination,
    ...rest
  } = props;

  const defaultPageSize =
    !isBoolean(pagination) && pagination?.defaultPageSize
      ? pagination.defaultPageSize
      : BaseTableDefaultPageSize;

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const mergedPagination = useMemo(
    () =>
      isBoolean(pagination)
        ? pagination
        : {
            ...(pagination || {}),
            total,
            current: pageNo,
            pageSize,
          },
    [pageNo, pageSize, pagination, total],
  );

  const requestIdRef = useRef(0);
  const firstQueryPendingRef = useRef(true);
  const firstQueryDelayTimerRef = useRef<any>(undefined);
  const loadingDelayTimerRef = useRef<any>(undefined);

  const isMountedRef = useRef(false);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /** 查询数据 */
  const queryData = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const params = {
      [API_PAGE_KEY]: propsPageNo || 1,
      [API_SIZE_KEY]: propsPageSize || BaseTableDefaultPageSize,
    };

    // 加载很快时，不显示
    clearTimeout(loadingDelayTimerRef.current);
    loadingDelayTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setLoading(true);
      }
    }, loadingDelay);

    try {
      const fn = fetchData ? fetchData : () => Promise.resolve();
      const res = ((await fn(params)) || {}) as FetchTableData<DataItem>;
      const resPageNo = res[API_PAGE_KEY];
      const resPageSize = res[API_SIZE_KEY];
      const resTotal = res[API_TOTAL_KEY];
      const resList = res[API_LIST_KEY];

      // 未销毁且最后一次请求，才更新数据
      if (isMountedRef.current && requestId === requestIdRef.current) {
        setTotal(resTotal || 0);
        setDataSource(resList || []);
        setPageNo(resPageNo || propsPageNo || 1);
        setPageSize(resPageSize || propsPageSize || BaseTableDefaultPageSize);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      clearTimeout(loadingDelayTimerRef.current);
      if (isMountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [fetchData, loadingDelay, propsPageNo, propsPageSize]);

  /** 避免不稳定的函数引用 */
  const queryDataRef = useRef(queryData);
  useEffect(() => {
    queryDataRef.current = queryData;
  }, [queryData]);

  /** 触发查询 */
  useEffect(() => {
    /**
     * <StrictMode /> 下触发两次查询符合预期行为
     * https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-double-rendering-in-development
     */
    const delayQuery = firstQueryDelay === true || isNumber(firstQueryDelay);
    const delayTime = isNumber(firstQueryDelay) ? firstQueryDelay : 0;

    if (delayQuery && firstQueryPendingRef.current) {
      /** 在非静态实例化 axios 实例时，需要延迟触发第一次查询 */
      clearTimeout(firstQueryDelayTimerRef.current);
      firstQueryDelayTimerRef.current = setTimeout(() => {
        queryDataRef.current();
      }, delayTime);
    } else {
      /** 实例化后直接触发 */
      queryDataRef.current();
    }

    firstQueryPendingRef.current = false;

    return () => {
      clearTimeout(firstQueryDelayTimerRef.current);
    };
  }, [firstQueryDelay, propsPageNo, propsPageSize, refreshKey]);

  const handleChange = useCallback<RawOnChange>(
    (nextPagination, ...rest) => {
      // 触发外部事件
      const ignore = onChange && onChange(nextPagination, ...rest);
      if (ignore) {
        return;
      }

      // 将分页参数保存至外部
      const { current, pageSize } = nextPagination || {};
      onPagingChange?.({
        pageNo: current || 1,
        pageSize: pageSize || BaseTableDefaultPageSize,
      });
    },
    [onChange, onPagingChange],
  );

  return (
    <BaseTable
      ref={ref}
      loading={loading}
      dataSource={dataSource}
      pagination={mergedPagination}
      onChange={handleChange}
      {...rest}
    />
  );
});

type FetchTableComponent = <RecordType = any, DataItem = any>(
  props: FetchTableProps<RecordType, DataItem> & RefAttributes<BaseTableRef>,
) => ReactElement | null;

export const FetchTable = FetchTableCom as FetchTableComponent;

export default FetchTable;
