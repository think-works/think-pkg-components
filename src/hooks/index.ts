import { debounce, throttle } from "lodash-es";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

/**
 * 组件是否已挂载
 * `const isMounted = useIsMounted();`
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
 * `const [forceKey, forceUpdate] = useForceUpdate();`
 * https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
 */
export const useForceUpdate = (): [number, React.DispatchWithoutAction] => {
  const [forceKey, forceUpdate] = useReducer((x: number) => x + 1, 0);
  return [forceKey, forceUpdate];
};

/**
 * 维持上次的状态
 * `const prevValue = usePrevious(value);`
 * https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
 */
export const usePrevious = <T = any>(value: T) => {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

/**
 * 维持事件回调函数
 * `const stableCallback = useEventCallback(unstableCallback);`
 * https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
 */
export const useEventCallback = <T extends (...args: any[]) => any>(
  /** 回调函数 */
  func: T,
  /** 依赖数组 */
  deps?: any[],
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [func, ...(deps || [])]); // 动态依赖数组

  return useCallback<T>(((...rest) => ref.current(...rest)) as T, [ref]);
};

/**
 * debounce 防抖
 * 在连续事件停止后，再隔一段时间才触发一次。
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  /** 回调函数 */
  func: T,
  /** 间隔时间(ms) */
  wait?: number,
  /** 配置 */
  options?: {
    /** 立即调用(默认 false) */
    leading?: boolean;
    /** 超时调用(默认 true) */
    trailing?: boolean;
    /** 最大等待时间(ms) */
    maxWait?: number;
  },
) => {
  const { leading = false, trailing = true, maxWait } = options || {};
  const ref = useRef<T>(func);

  useEffect(() => {
    ref.current = func;
  });

  const dFunc = useMemo(
    () =>
      debounce<T>(((...rest) => ref.current(...rest)) as T, wait, {
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
 * throttle 节流
 * 在连续事件过程中，每隔一段时间就触发一次。
 */
export const useThrottle = <T extends (...args: any[]) => any>(
  /** 回调函数 */
  func: T,
  /** 间隔时间(ms) */
  wait?: number,
  /** 配置 */
  options?: {
    /** 立即调用(默认 true) */
    leading?: boolean;
    /** 超时调用(默认 true) */
    trailing?: boolean;
  },
) => {
  const { leading = true, trailing = true } = options || {};
  const ref = useRef<T>(func);

  useEffect(() => {
    ref.current = func;
  });

  const tFunc = useMemo(
    () =>
      throttle<T>(((...rest) => ref.current(...rest)) as T, wait, {
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
 * setInterval 延迟重复调用
 */
export const useInterval = <T extends (...args: any[]) => any>(
  /** 回调函数 */
  func: T,
  /**
   * 延迟时间(ms)
   * 为 -1 时不执行
   */
  delay: number,
  /** 配置 */
  options?: {
    /** 立即调用(默认 false) */
    leading?: boolean;
  },
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
 * setTimeout 延迟一次调用
 */
export const useTimeout = <T extends (...args: any[]) => any>(
  /** 回调函数 */
  func: T,
  /**
   * 延迟时间(ms)
   * 为 -1 时不执行
   */
  delay: number,
  /** 配置 */
  options?: {
    /** 立即调用(默认 false) */
    leading?: boolean;
  },
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
