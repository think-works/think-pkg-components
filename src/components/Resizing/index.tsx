import cls from "classnames";
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useThrottle } from "@/utils/hooks";
import stl from "./index.module.less";

export type ResizingProps = {
  [key: string]: any;
  /** 防抖毫秒时间间隔 */
  throttle?: number;
  /** 将子标签脱离文档流以避免撑开所在容器 */
  detachFlow?: boolean;
  /** 容器尺寸变更事件 */
  onResize?: (width: number, height: number) => any;
};

const Resizing = (props: ResizingProps, ref: ForwardedRef<HTMLDivElement>) => {
  const {
    className,
    throttle = 100,
    detachFlow = true,
    onResize,
    ...rest
  } = props || {};

  const refObserver = useRef<ResizeObserver>();
  const refContainer = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => refContainer.current as HTMLDivElement, []);

  const handleContainerResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];

      if (!onResize || !entry) {
        return;
      }

      if (entry.contentBoxSize?.[0]) {
        const { blockSize, inlineSize } = entry.contentBoxSize[0];
        onResize(inlineSize, blockSize);
        return;
      }

      const { width, height } = entry.contentRect;
      onResize(width, height);
    },
    [onResize],
  );

  const handleWindowResize = useCallback(() => {
    if (!onResize) {
      return;
    }

    const { width, height } = refContainer.current!.getBoundingClientRect();
    onResize(width, height);
  }, [onResize]);

  const _handleContainerResize = useThrottle(handleContainerResize, throttle);
  const _handleWindowResize = useThrottle(handleWindowResize, throttle);

  const addListener = useCallback(() => {
    if (window.ResizeObserver) {
      refObserver.current = new ResizeObserver(_handleContainerResize);
      refObserver.current.observe(refContainer.current!);
    } else {
      window.addEventListener("resize", _handleWindowResize);
    }
  }, [_handleContainerResize, _handleWindowResize]);

  const removeListener = useCallback(() => {
    _handleContainerResize.cancel();
    _handleWindowResize.cancel();

    if (window.ResizeObserver) {
      refObserver.current?.disconnect();
    } else {
      window.removeEventListener("resize", _handleWindowResize);
    }
  }, [_handleContainerResize, _handleWindowResize]);

  useEffect(() => {
    addListener();

    return () => {
      removeListener();
    };
  }, [addListener, removeListener]);

  return (
    <div
      className={cls(
        stl.resizing,
        {
          [stl.detachFlow]: detachFlow,
        },
        className,
      )}
      ref={refContainer}
      {...rest}
    />
  );
};

export default forwardRef(Resizing);
