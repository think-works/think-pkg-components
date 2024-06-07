import { useEffect, useReducer, useRef, useState } from "react";

/**
 * 异步加载模块，如：
 * ```
 * const useG2Module = () => {
 *   const dynamicImport = useMemo(() => import("@antv/g2"), []);
 *   const importModule = useDynamicImport<G2ModuleType>(dynamicImport);
 *   return importModule;
 * }
 * 
 * const { module } = useG2Module();
 * useEffect(() => {
    if (!module) {
      return;
    }
    const chart = new module.Chart();
    return () => {
      chart.destroy();
    };
 * }, []);
 * ```
 */
export const useDynamicImport = <Module = any>(
  dynamicImport: Promise<Module>,
) => {
  // 维护 forceKey 和 loading 状态，主要是为了在模块加载后触发组件更新
  const [forceKey, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const [loading, setLoading] = useState(false);
  const refModule = useRef<Module>();

  useEffect(() => {
    forceUpdate();
    setLoading(true);

    dynamicImport
      .then((module) => {
        refModule.current = module;
      })
      .finally(() => {
        forceUpdate();
        setLoading(false);
      });
  }, [dynamicImport]);

  return {
    /** 强制刷新 */
    forceKey,
    /** 加载中 */
    loading,
    /** 已加载模块 */
    module: refModule.current,
  };
};

export default useDynamicImport;
