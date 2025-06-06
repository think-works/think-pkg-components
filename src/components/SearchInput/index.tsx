import { Input, InputProps, InputRef, Select } from "antd";
import { ForwardedRef, forwardRef, useState } from "react";

type SearchInputValue = {
  type?: string;
  text?: string;
};

export type SearchInputProps = Omit<InputProps, "value" | "onChange"> & {
  options?: any[] | readonly any[];
  value?: SearchInputValue;
  onChange?: (value: SearchInputValue) => void;
};

/**
 * 搜索输入
 */
export const SearchInput = forwardRef(function SearchInputCom(
  props: SearchInputProps,
  ref: ForwardedRef<InputRef>,
) {
  const { options, value, onChange, ...rest } = props || {};

  const _options = (options || []).map((option) => ({
    ...option,
    label: option.label ?? option.value,
  }));

  const [cache, setCache] = useState<any>({
    ...(value || {}),
  });

  const triggerChange = (diff: any) => {
    const nw = {
      ...cache,
      ...diff,
    };

    setCache(nw);
    if (typeof onChange === "function") {
      onChange(nw);
    }
  };

  const handleInputChange = (e: any) => {
    const val = e.target.value;
    triggerChange({ text: val });
  };

  const handleSelectChange = (val: any) => {
    triggerChange({ type: val });
  };

  return (
    <Input
      ref={ref}
      value={cache.text}
      onChange={handleInputChange}
      addonBefore={
        <Select
          value={cache.type}
          options={_options}
          onChange={handleSelectChange}
        />
      }
      {...rest}
    />
  );
});

export default SearchInput;
