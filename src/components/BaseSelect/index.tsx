import { Button, Divider, RefSelectProps, Select, SelectProps } from "antd";
import cls, { Argument } from "classnames";
import { ForwardedRef, forwardRef } from "react";
import { useComponentsLocale } from "@/i18n/hooks";
import { isType } from "@/utils/tools";
import stl from "./index.module.less";

const isArray = (val: any) => isType<any[]>(val, "Array");
const isObject = (val: any) => isType<Record<string, any>>(val, "Object");

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
export const BaseSelect = forwardRef(function BaseSelectCom(
  props: BaseSelectProps,
  ref: ForwardedRef<RefSelectProps>,
) {
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

  const { locale, formatLocaleText } = useComponentsLocale();

  let _options = options || [];

  if (allOption) {
    _options = [
      {
        key: "all",
        value: null,
        label: locale.common.allText,
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

  let popupRender = undefined;
  if (allExtend) {
    const selectedCount = Array.isArray(value) ? value.length : 0;
    const handleAll = () => {
      const optList = _options.filter((x) => !x.disabled);
      const valList = optList.map((x) => x.value);
      if (typeof onChange === "function") {
        onChange(valList, optList);
      }
    };

    popupRender = (origin: any) => (
      <>
        {origin}
        <Divider className={stl.dropdownRenderDivider} />
        <div className={stl.dropdownRenderActions}>
          <span>
            {formatLocaleText(locale.BaseSelect.selectedCount, {
              count: selectedCount,
            })}
          </span>
          <Button type="primary" size="small" onClick={handleAll}>
            {locale.common.selectAll}
          </Button>
        </div>
      </>
    );
  }

  return (
    <Select
      ref={ref}
      className={cls(stl.baseSelect, className)}
      value={value}
      onChange={onChange}
      options={_options as any}
      popupRender={popupRender}
      dropdownRender={popupRender}
      {...rest}
    />
  );
});

export default BaseSelect;
