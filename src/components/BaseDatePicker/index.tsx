import { DatePicker, DatePickerProps } from "antd";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import { forwardRef, useCallback, useMemo } from "react";

type OfType = OpUnitType | null;
type ValueType = number | null;
type DateType = Dayjs | null;
type DateString = string | string[];

export type BaseDatePickerProps = Omit<
  DatePickerProps,
  "value" | "onChange"
> & {
  startOf?: OfType;
  endOf?: OfType;
  value?: ValueType;
  onChange?: (time: ValueType, timeString: DateString) => any;
};

/**
 * 基础时间选择
 */
export const BaseDatePicker = forwardRef(function BaseDatePickerCom(
  props: BaseDatePickerProps,
  ref: DatePickerProps["ref"],
) {
  const { startOf, endOf, value, onChange, picker, ...rest } = props || {};

  const _value = useMemo(() => {
    let ret: any = value;

    if (value) {
      ret = dayjs(value);
    }

    return ret;
  }, [value]);

  const _onChange = useCallback(
    (time: DateType, timeString: DateString) => {
      let ret: any = time;

      if (time) {
        if (startOf) {
          ret = time.startOf(startOf).valueOf();
        } else if (endOf) {
          ret = time.endOf(endOf).valueOf();
        } else {
          ret = time.valueOf();
        }
      }

      if (typeof onChange === "function") {
        onChange(ret, timeString);
      }
    },
    [onChange, startOf, endOf],
  );

  return (
    <DatePicker
      ref={ref}
      value={_value}
      onChange={_onChange}
      picker={picker as any}
      {...rest}
    />
  );
});

export default BaseDatePicker;
