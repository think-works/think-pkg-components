import { useCallback, useEffect, useMemo, useState } from "react";
import { useIsMounted } from "@/hooks";
import { ApiResponse } from "@/utils/types";

/**
 * 请求状态和响应数据维护
 *
 * 注意:
 * 请保持对复杂对象的稳定引用，否则可能会出现重复请求。
 * 如: request / options.autoFetch / options.transformResult
 */
export const useFetch = <
  ReqFun extends (...rest: any[]) => Promise<ApiResponse>,
  FetchArgs extends Parameters<ReqFun>,
>(
  /**
   * 请求函数
   */
  request: ReqFun,
  /**
   * 配置参数
   */
  options?: {
    /**
     * 初始化时自动触发一次请求
     * true 配置: 使用空参数触发
     * [] 配置: 触发时的函数入参
     */
    autoFetch?: boolean | FetchArgs;
    /**
     * 刷新自动触发的请求
     */
    refreshKey?: number | string;
    /**
     * 转换响应数据
     * 默认提取响应数据中的 data 属性
     */
    transformResult?: (res: any) => any;
  },
) => {
  type ResRet = ReturnType<ReqFun> extends Promise<infer ApiRes> ? ApiRes : any;
  type ResObj = ResRet extends ApiResponse<infer ApiObj> ? ApiObj : any;
  type ResExt = ResRet extends ApiResponse<any, infer ApiExt> ? ApiExt : any;

  const { autoFetch, refreshKey, transformResult } = options || {};

  const needFetch = !!autoFetch;
  const fetchParams =
    needFetch && autoFetch !== true ? autoFetch : ([] as unknown as FetchArgs);

  const transformFunc = useMemo(
    () => transformResult || ((res: any) => res?.data),
    [transformResult],
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<ResObj>();
  const isMounted = useIsMounted();

  const fetch = useCallback(
    async (
      ...args: FetchArgs
    ): Promise<undefined | ApiResponse<ResObj, ResExt>> => {
      if (!isMounted.current) {
        return;
      }

      try {
        setLoading(true);

        const res = await request(...args);
        const tData = transformFunc(res);

        if (isMounted.current) {
          setData(tData);
        }

        return res;
      } finally {
        setLoading(false);
      }
    },
    [request, isMounted, transformFunc],
  );

  useEffect(() => {
    if (needFetch) {
      fetch(...fetchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch, needFetch, refreshKey, ...fetchParams]);

  return {
    /**
     * 请求状态
     */
    loading,
    /**
     * 响应数据
     */
    data,
    /**
     * 请求函数
     * @returns 原始的响应数据
     */
    fetch,
  };
};

export default useFetch;
