import { Button, Divider, Select, SelectProps } from "antd";
import cls, { Argument } from "classnames";
import { isArray, isObject } from "lodash-es";
import stl from "./index.module.less";

type BaseOption = {
  [key: string]: any;
  label?: any;
  value?: any;
};

export type BaseSelectProps = Omit<SelectProps, "options"> & {
  className?: Argument;
  options?: BaseOption[] | readonly BaseOption[];
  allOption?: boolean | BaseOption;
  allExtend?: boolean;
  fakeLabel?: string | string[];
  disabledOptions?: any[];
};

/**
 * 基础下拉框
 */
export const BaseSelect = (props: BaseSelectProps) => {
  const {
    className,
    options,
    allOption,
    allExtend,
    fakeLabel,
    disabledOptions,
    value,
    onChange,
    ...rest
  } = props || {};

  let _options = options || [];

  if (allOption) {
    _options = [
      {
        key: "all",
        value: null,
        label: "全部",
        ...(isObject(allOption) ? allOption : {}),
      } as any,
    ].concat(_options);
  }

  if (fakeLabel) {
    const _value = isArray(value) ? value : [value];
    const _fakeLabel = isArray(fakeLabel) ? fakeLabel : [fakeLabel];

    for (let i = 0; i < _value.length; i++) {
      const val = _value[i];
      const label = _fakeLabel[i];

      const notExist = _options.every((x: any) => x.value !== val);
      if (notExist) {
        // 放在最后并禁止操作
        _options = _options.concat([
          {
            key: `fake-${val}`,
            value: val,
            label: label,
            disabled: true,
          },
        ]);
      }
    }
  }

  _options = _options.map((option) => ({
    ...option,
    label: option.label ?? option.value,
    disabled:
      option.disabled ?? disabledOptions?.some((x) => x === option.value),
  }));

  let dropdownRender = undefined;
  if (allExtend) {
    const selectedCount = Array.isArray(value) ? value.length : 0;
    const handleAll = () => {
      const optList = _options.filter((x) => !x.disabled);
      const valList = optList.map((x) => x.value);
      if (typeof onChange === "function") {
        onChange(valList, optList);
      }
    };

    dropdownRender = (origin: any) => (
      <>
        {origin}
        <Divider className={stl.dropdownRenderDivider} />
        <div className={stl.dropdownRenderActions}>
          <span>已选择 {selectedCount} 项</span>
          <Button type="primary" size="small" onClick={handleAll}>
            全选
          </Button>
        </div>
      </>
    );
  }

  return (
    <Select
      className={cls(stl.baseSelect, className)}
      value={value}
      onChange={onChange}
      options={_options as any}
      dropdownRender={dropdownRender}
      {...rest}
    />
  );
};

export default BaseSelect;
