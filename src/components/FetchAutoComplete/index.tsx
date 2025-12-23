import { AutoComplete, AutoCompleteProps, GetRef } from "antd";
import cls, { Argument } from "classnames";
import { get } from "lodash-es";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDebounce, useIsMounted } from "@/hooks";
import stl from "./index.module.less";

type AutoCompleteRef = GetRef<typeof AutoComplete>;

export type FetchAutoCompleteProps = AutoCompleteProps & {
  className?: Argument;
  filterOption?: AutoCompleteProps["filterOption"];
  simpleOptions?: boolean;
  optionFilterProp?: string;
  popupMatchSelectWidth?: boolean;
  optionsKey?: false | string;
  uniqueKey?: string;
  valueKey?: string;
  labelKey?: string;
  searchKey?: string;
  fetchApi?: (...rest: any) => any;
  fetchParams?: Record<string, any>;
  transformData?: (data: any) => any;
  transformOptions?: (options: any[]) => any[];
};

/**
 * 可查询自动补全
 */
export const FetchAutoComplete = forwardRef(function FetchAutoCompleteCom(
  props: FetchAutoCompleteProps,
  ref: ForwardedRef<AutoCompleteRef>,
) {
  const {
    className,
    filterOption = true,
    simpleOptions = false,
    optionFilterProp = "label",
    popupMatchSelectWidth = false,
    optionsKey = "list",
    uniqueKey = "id",
    valueKey = uniqueKey,
    labelKey = "name",
    searchKey = "keyword",
    fetchApi,
    fetchParams,
    transformData,
    transformOptions,
    ...rest
  } = props;

  const [search, setSearch] = useState("");
  const [list, setList] = useState<any>([]);

  const isMounted = useIsMounted();
  // const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const fetchData = useCallback(
    async (params: any) => {
      try {
        // setLoading(true);
        if (fetchApi) {
          const res = await fetchApi(params);
          const _data = transformData ? transformData(res.data) : res.data;
          setData(_data);
        }
      } finally {
        if (isMounted.current) {
          // setLoading(false);
        }
      }
    },
    [fetchApi, isMounted, transformData],
  );

  const _fetch = useDebounce(fetchData, 300);

  useEffect(() => {
    const params = {};

    if (searchKey && search) {
      Object.assign(params, {
        [searchKey]: search,
      });
    }

    if (fetchParams) {
      Object.assign(params, fetchParams);
    }

    _fetch(params);
  }, [searchKey, search, fetchParams, _fetch]);

  useEffect(() => {
    const list = optionsKey ? get(data, optionsKey) : data;

    const options = (list || []).map((item: any) => {
      if (simpleOptions) {
        return {
          key: item,
          value: item,
          label: item,
          rawData: item,
        };
      }

      return {
        key: uniqueKey ? get(item, uniqueKey) : item,
        value: valueKey ? get(item, valueKey) : item,
        label: labelKey ? get(item, labelKey) : item,
        rawData: item,
      };
    });

    const _options = transformOptions ? transformOptions(options) : options;
    setList(_options);
  }, [
    simpleOptions,
    optionsKey,
    uniqueKey,
    valueKey,
    labelKey,
    data,
    transformOptions,
  ]);

  return (
    <AutoComplete
      ref={ref}
      className={cls(stl.fetchAutoComplete, className)}
      // loading={loading}
      options={list}
      filterOption={filterOption}
      optionFilterProp={optionFilterProp}
      popupMatchSelectWidth={popupMatchSelectWidth}
      onSearch={filterOption ? undefined : (val: any) => setSearch(val)}
      {...rest}
    />
  );
});

export default FetchAutoComplete;
