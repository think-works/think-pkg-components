import { Spin } from "antd";
import {
  ComponentType,
  forwardRef,
  PropsWithRef,
  ReactNode,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

export type DynamicImportProps = {
  [key: string]: any;
  /** 动态导入 */
  dynamicImport: Promise<{ default: ComponentType<any> }>;
  /** 加载中占位符 */
  placeholder?: ReactNode;
};

/**
 * 异步加载组件，如：
 * ```
 * const dynamicImport = useMemo(() => import("./Component"), []);
 *
 * <DynamicImport dynamicImport={dynamicImport} />
 * ```
 */
export const DynamicImport = forwardRef<any, DynamicImportProps>(
  function DynamicImportCom(props, ref) {
    const { dynamicImport, placeholder, ...rest } = props as DynamicImportProps;

    // 维护 forceKey 和 loading 状态，主要是为了在模块加载后触发组件更新
    const [forceKey, forceUpdate] = useReducer((x: number) => x + 1, 0);
    const [loading, setLoading] = useState(false);
    const refComponent = useRef<ComponentType<PropsWithRef<any>> | undefined>(
      undefined,
    );

    useEffect(() => {
      forceUpdate();
      setLoading(true);

      dynamicImport
        .then((module) => {
          refComponent.current = module.default;
        })
        .finally(() => {
          forceUpdate();
          setLoading(false);
        });
    }, [dynamicImport]);

    const Component = refComponent.current;

    if (!Component) {
      return placeholder || <Spin key={forceKey} spinning={loading} />;
    }

    return <Component ref={ref} {...rest} />;
  },
);

export default DynamicImport;
