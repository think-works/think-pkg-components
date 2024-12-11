import { Input } from "antd";
import type { TextAreaProps } from "antd/lib/input";
import { ChangeEvent, useLayoutEffect, useState } from "react";

/**
 * 解耦受控组件关系，间接同步外部变更。
 */
const DecoupleTextArea = (props: TextAreaProps) => {
  const { value, onChange, ...rest } = props;

  const [val, setVal] = useState(value);

  useLayoutEffect(() => {
    setVal(value);
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setVal(e.target.value);
    if (typeof onChange === "function") {
      onChange(e);
    }
  };
  return <Input.TextArea value={val} onChange={handleChange} {...rest} />;
};

export default DecoupleTextArea;
