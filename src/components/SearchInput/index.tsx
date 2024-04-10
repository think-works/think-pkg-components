import { Input, InputProps, Select } from "antd";
import { useState } from "react";

export type SearchInputValue = {
  type?: string;
  text?: string;
};

export type SearchInputProps = Omit<InputProps, "value" | "onChange"> & {
  options?: any[] | readonly any[];
  value?: SearchInputValue;
  onChange?: (value: SearchInputValue) => void;
};

const SearchInput = (props: SearchInputProps) => {
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
    onChange && onChange(nw);
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
      value={cache.text}
      onChange={handleInputChange}
      {...rest}
      addonBefore={
        <Select
          value={cache.type}
          options={_options}
          onChange={handleSelectChange}
        />
      }
    />
  );
};

export default SearchInput;
