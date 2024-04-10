import { DatePicker, DatePickerProps } from "antd";
import dayjs, { Dayjs, OpUnitType } from "dayjs";
import { useCallback, useMemo } from "react";

export type BaseDatePickerProps = Omit<
  DatePickerProps,
  "value" | "onChange"
> & {
  startOf?: OpUnitType | null;
  endOf?: OpUnitType | null;
  value?: number;
  onChange?: (time: number, timeString: string) => any;
};

const BaseDatePicker = (props: BaseDatePickerProps) => {
  const { startOf, endOf, value, onChange, picker, ...rest } = props || {};

  const _value = useMemo(() => {
    let ret: any = value;

    if (value) {
      ret = dayjs(value);
    }

    return ret;
  }, [value]);

  const _onChange = useCallback(
    (time: Dayjs | null, timeString: string | string[]) => {
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

      onChange && onChange(ret, timeString as string);
    },
    [onChange, startOf, endOf],
  );

  return (
    <DatePicker
      value={_value}
      onChange={_onChange}
      picker={picker as any}
      {...rest}
    />
  );
};

export default BaseDatePicker;
