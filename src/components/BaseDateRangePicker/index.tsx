import { DatePicker, GetProps } from "antd";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import { forwardRef, useCallback, useMemo } from "react";

const { RangePicker } = DatePicker;

type OfType = OpUnitType | null;
type ValueType = number | null;
type DateType = Dayjs | null;
type DateString = [string, string];

export type BaseDateRangePickerProps = Omit<
  GetProps<typeof RangePicker>,
  "value" | "onChange"
> & {
  startOf?: [OfType, OfType];
  endOf?: [OfType, OfType];
  value?: [ValueType, ValueType] | null;
  onChange?: (
    time: [ValueType, ValueType] | null,
    timeString: DateString,
  ) => any;
};

/**
 * 基础时间区间选择
 */
export const BaseDateRangePicker = forwardRef(function BaseDateRangePickerCom(
  props: BaseDateRangePickerProps,
  ref: BaseDateRangePickerProps["ref"],
) {
  const { startOf, endOf, value, onChange, ...rest } = props || props;

  const _value = useMemo(() => {
    let ret: any = value;

    if (value?.length) {
      ret = [...value];
      value.forEach((val: any, idx: any) => {
        if (val) {
          ret[idx] = dayjs(val);
        }
      });
    }

    return ret;
  }, [value]);

  const _onChange = useCallback(
    (times: [DateType, DateType] | null, timeStrings: DateString) => {
      let ret: any = times;

      if (times?.length) {
        ret = [...times];
        times.forEach((time, idx) => {
          if (time) {
            if (startOf?.[idx]) {
              ret[idx] = time.startOf(startOf[idx]).valueOf();
            } else if (endOf?.[idx]) {
              ret[idx] = time.endOf(endOf[idx]).valueOf();
            } else {
              ret[idx] = time.valueOf();
            }
          }
        });
      }

      if (typeof onChange === "function") {
        onChange(ret, timeStrings);
      }
    },
    [onChange, startOf, endOf],
  );

  return (
    <RangePicker ref={ref} value={_value} onChange={_onChange} {...rest} />
  );
});

export default BaseDateRangePicker;
