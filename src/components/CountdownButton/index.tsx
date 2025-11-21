import { Button, ButtonProps } from "antd";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useComponentsLocale } from "../ConfigProvider";

export type CountdownButtonProps = ButtonProps & {
  /** 倒计时(秒) */
  countdown?: number;
  /** 点击倒计时(未提供则点击后立即启动倒计) */
  onCountdown?: (
    /** 启动倒计时(按需控制何时启动倒计时) */
    start: (
      /** 指定本次倒计时(秒) */
      seconds?: number,
    ) => void,
  ) => void;
};

/**
 * 倒计时按钮
 */
export const CountdownButton = forwardRef(function CountdownButtonCom(
  props: CountdownButtonProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
) {
  const { locale } = useComponentsLocale();

  const {
    countdown = 60,
    children = locale.CountdownButton.sendCode,
    disabled,
    onClick,
    onCountdown,
    ...rest
  } = props;

  const [seconds, setCountdown] = useState(0);
  const disabledButton = disabled || seconds > 0;

  const refTimer = useRef<any>(undefined);
  useEffect(() => {
    clearInterval(refTimer.current);
  }, []);

  const startCountdown = useCallback((second: number) => {
    setCountdown(second);

    clearInterval(refTimer.current);
    refTimer.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        clearInterval(refTimer.current);
        return 0;
      });
    }, 1000);
  }, []);

  const handleClick = useCallback(
    (e: any) => {
      onClick?.(e);

      const start = (second?: number) => {
        startCountdown(second || countdown);
      };

      if (onCountdown) {
        onCountdown(start);
      } else {
        start();
      }
    },
    [countdown, onClick, onCountdown, startCountdown],
  );
  return (
    <Button ref={ref} disabled={disabledButton} onClick={handleClick} {...rest}>
      <span>{children}</span>
      <span>{seconds > 0 ? `(${seconds})` : null}</span>
    </Button>
  );
});

export default CountdownButton;
