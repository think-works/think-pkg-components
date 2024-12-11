import { Input, InputProps } from "antd";
import { ChangeEvent, useLayoutEffect, useState } from "react";

/**
 * 解耦受控组件关系，间接同步外部变更。
 */
const DecoupleInput = (props: InputProps) => {
  const { value, onChange, ...rest } = props;

  const [val, setVal] = useState(value);

  useLayoutEffect(() => {
    setVal(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value);
    if (typeof onChange === "function") {
      onChange(e);
    }
  };

  return <Input value={val} onChange={handleChange} {...rest} />;
};

export default DecoupleInput;
