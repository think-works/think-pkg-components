import { AutoComplete } from "antd";
import { AutoCompleteProps } from "antd/lib";
import { useLayoutEffect, useState } from "react";

/**
 * 解耦受控组件关系，间接同步外部变更。
 */
const DecoupleAutoComplete = (props: AutoCompleteProps<string>) => {
  const { value, onChange, ...rest } = props;

  const [val, setVal] = useState(value);

  useLayoutEffect(() => {
    setVal(value);
  }, [value]);

  const handleChange = (e: string, optionChange: any) => {
    setVal(e);
    onChange && onChange(e, optionChange);
  };
  return (
    <AutoComplete
      style={{ width: "100%" }}
      value={val}
      onChange={handleChange}
      {...rest}
    />
  );
};

export default DecoupleAutoComplete;
