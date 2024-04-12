import {
  debounce,
  DebounceSettings,
  throttle,
  ThrottleSettings,
} from "lodash-es";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

/**
 * 组件是否已挂载
 * @returns 是否已挂载
 * https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 */
export const useIsMounted = () => {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);

  return ref;
};

/**
 * 强制更新
 * @returns [key, 更新函数]
 * https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
 */
export const useForceUpdate = (): [number, React.DispatchWithoutAction] => {
  const [forceKey, forceUpdate] = useReducer((x: number) => x + 1, 0);
  return [forceKey, forceUpdate];
};

/**
 * 维持上次的状态
 * @returns 上次的状态
 * https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 */
export const usePrevious = <T = any>(value: T) => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

/**
 * 维持事件回调函数
 * @returns 事件回调函数
 * https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
 */
export const useEventCallback = <T extends (...args: any[]) => any>(
  func: T,
  deps: any[],
) => {
  const dftFn: any = () => {
    throw new Error("Cannot call an event handler while rendering.");
  };
  const ref = useRef<T>(dftFn);

  /**
   * react-hooks/exhaustive-deps
   * React Hook useEffect has a spread element in its dependency array.
   * This means we can't statically verify whether you've passed the correct dependencies
   */
  useEffect(() => {
    ref.current = func;
  }, [func, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  return useCallback((...rest: any[]) => ref.current(...rest), [ref]);
};

/**
 * 防抖
 * 在连续事件停止后，再隔一段时间才触发一次。
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  func: T,
  wait?: number,
  options?: DebounceSettings,
) => {
  const { leading = false, trailing = true, maxWait } = options || {};
  const ref = useRef<T>(func);

  useEffect(() => {
    ref.current = func;
  });

  const dFunc = useMemo(
    () =>
      debounce((...rest) => ref.current(...rest), wait, {
        leading,
        trailing,
        maxWait,
      }),
    [wait, leading, trailing, maxWait],
  );

  useEffect(() => {
    return () => {
      dFunc.cancel();
    };
  }, [dFunc]);

  return dFunc;
};

/**
 * 节流
 * 在连续事件过程中，每隔一段时间就触发一次。
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  func: T,
  wait?: number,
  options?: ThrottleSettings,
) => {
  const { leading = true, trailing = true } = options || {};
  const ref = useRef<T>(func);

  useEffect(() => {
    ref.current = func;
  });

  const tFunc = useMemo(
    () =>
      throttle((...rest) => ref.current(...rest), wait, {
        leading,
        trailing,
      }),
    [wait, leading, trailing],
  );

  useEffect(() => {
    return () => {
      tFunc.cancel();
    };
  }, [tFunc]);

  return tFunc;
};

/**
 * setInterval
 */
export const useInterval = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options?: { leading?: boolean },
) => {
  const { leading = false } = options || {};
  const ref = useRef<T>(func);

  useEffect(() => {
    ref.current = func;
  });

  useEffect(() => {
    if (delay >= 0) {
      const id = setInterval(() => {
        ref.current();
      }, delay);
      return () => clearInterval(id);
    }
  }, [delay]);

  useEffect(() => {
    if (leading) {
      ref.current();
    }
  }, [leading]);
};

/**
 * setTimeout
 */
export const useTimeout = <T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  options?: { leading?: boolean },
) => {
  const { leading = false } = options || {};
  const ref = useRef<T>(func);

  useEffect(() => {
    ref.current = func;
  });

  useEffect(() => {
    if (delay >= 0) {
      const id = setTimeout(() => {
        ref.current();
      }, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);

  useEffect(() => {
    if (leading) {
      ref.current();
    }
  }, [leading]);
};
