import { DatePicker } from "antd";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import { useCallback, useMemo } from "react";

export type BaseDateRangePickerProps = Omit<
  (typeof DatePicker)["RangePicker"],
  "value" | "onChange" | "$$typeof"
> & {
  startOf?: (OpUnitType | null)[];
  endOf?: (OpUnitType | null)[];
  value?: number[];
  onChange?: (time: number[], timeString: string[]) => any;
};

/**
 * 基础时间区间选择
 */
export const BaseDateRangePicker = (props: BaseDateRangePickerProps) => {
  const { startOf, endOf, value, onChange, ...rest } = props || props;

  const _value = useMemo(() => {
    let ret: any = value;

    if (value) {
      ret = [];
      value.forEach((val: any, idx: any) => {
        if (val) {
          ret[idx] = dayjs(val);
        }
      });
    }

    return ret;
  }, [value]);

  const _onChange = useCallback(
    (times: (Dayjs | null)[] | null, timeStrings: any) => {
      let ret: any = times;

      if (times) {
        ret = [];
        times.forEach((time: any, idx: any) => {
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

      onChange && onChange(ret, timeStrings);
    },
    [onChange, startOf, endOf],
  );

  return (
    <DatePicker.RangePicker value={_value} onChange={_onChange} {...rest} />
  );
};

export default BaseDateRangePicker;
