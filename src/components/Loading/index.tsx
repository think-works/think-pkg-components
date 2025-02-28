import { Spin, SpinProps } from "antd";
import cls from "classnames";
import { useEffect, useState } from "react";
import stl from "./index.module.less";

export type LoadingProps = SpinProps & {
  delay?: number;
};

/**
 * 充满(非 position: static; 定位)容器且不嵌套的加载中
 */
export const Loading = (props: LoadingProps) => {
  const { className, delay = 200, spinning = true, tip, ...rest } = props;

  const [loading, setLoading] = useState(spinning);

  useEffect(() => {
    if (!spinning) {
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [delay, spinning]);

  return loading ? (
    <div className={cls(stl.loading, className)}>
      <Spin className={stl.spin} {...rest} />
      {tip ? <div className={stl.tip}>{tip}</div> : null}
    </div>
  ) : null;
};

export default Loading;
