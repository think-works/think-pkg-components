import { cloneElement, isValidElement, ReactElement, ReactNode } from "react";

type BypassParams = Omit<BypassPropsProps, "children" | "bypass"> & {
  /** 已克隆并透传属性的组件实例 */
  children?: ReactElement;
  /** 原始的组件实例 */
  rawChildren?: ReactElement;
};

export type BypassPropsProps = {
  [key: string]: any;
  /** 待透传属性的组件实例 */
  children?: ReactElement;
  /** 透传属性后的处理函数 */
  bypass?: (params: BypassParams) => ReactNode;
};

/**
 * 透传属性至子组件，如透传 Form.Item 绑定属性：
 * ```
 * <Form>
 *   <Form.Item>
 *     <BypassProps
 *       bypass={({ children }) => (
 *         <Tooltip title="可以绑定表单">{children}</Tooltip>
 *       )}
 *     >
 *       <Input />
 *     </BypassProps>
 *   </Form.Item>
 * </Form>
 * ```
 */
export const BypassProps = (props: BypassPropsProps) => {
  const { children, bypass, ...rest } = props;

  let child: ReactNode = children;

  // 克隆有效 React 元素
  if (isValidElement(children)) {
    child = cloneElement(children, rest, (children?.props as any)?.children);
  }

  // 后处理函数
  if (bypass) {
    child = bypass({ children: child, rawChildren: children, ...rest });
  }

  return child;
};

export default BypassProps;
