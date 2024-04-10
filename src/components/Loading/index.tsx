import { Spin, SpinProps } from "antd";
import cls from "classnames";
import { useEffect, useState } from "react";
import stl from "./index.module.less";

export type LoadingProps = SpinProps & {
  delay?: number;
};

const Loading = (props: LoadingProps) => {
  const { className, delay = 200, spinning, ...rest } = props;

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
    <Spin className={cls(stl.loading, className)} {...rest} />
  ) : null;
};

export default Loading;
