// #region 类型函数

/**
 * 真值转换
 */
export const truthy = <T>(
  value: T,
): value is Exclude<T, false | "" | 0 | null | undefined> => Boolean(value);

/**
 * 元组类型
 */
export const tuple = <T extends [any, ...any[]]>(value: T) => value;

// #endregion

// #region 请求响应

/**
 * api 接口响应
 */
export type ApiResponse<Data = any, Ext = any> = {
  timestamp?: number;
  success?: boolean;
  message?: string;
  data?: Data;
  ext?: Ext;
};

/**
 * 分页请求参数
 */
export type PagingRequest = {
  pageNo?: number;
  pageSize?: number;
  offset?: number;
};

/**
 * 分页响应参数
 */
export type PagingResponse<T = any> = {
  total?: number;
  pageNo?: number;
  pageSize?: number;
  offset?: number;
  list?: T[];
};

// #endregion

/**
 * 提取静态数组项类型
 */
export type Array2Union<T extends readonly any[]> = T[number];

/**
 * 保留字面量
 * https://github.com/microsoft/TypeScript/issues/29729#issuecomment-1082546550
 * https://github.com/microsoft/TypeScript/issues/29729#issuecomment-832522611
 * https://github.com/sindresorhus/type-fest/tree/main/source/literal-union.d.ts
 *
 */
export type LiteralUnion<T extends string | number> =
  | T
  | (string & Record<never, never>);

/**
 * useState 的 set 函数类型
 */
export type SetState<S = undefined> = React.Dispatch<
  React.SetStateAction<S | undefined>
>;

/**
 * 可变类型(递归)
 */
export type Mutable<T> = T extends (...args: any[]) => any
  ? T
  : T extends readonly [infer First, ...infer Rest]
    ? [Mutable<First>, ...Mutable<Rest>]
    : T extends readonly (infer U)[]
      ? Mutable<U>[]
      : T extends object
        ? { -readonly [P in keyof T]: Mutable<T[P]> }
        : T;

/**
 * 可选类型(递归)
 */
export type PartialDeep<T> = T extends (...args: any[]) => any
  ? T
  : T extends [infer First, ...infer Rest]
    ? [PartialDeep<First>, ...PartialDeep<Rest>]
    : T extends (infer U)[]
      ? PartialDeep<U>[]
      : T extends object
        ? { [P in keyof T]?: PartialDeep<T[P]> }
        : T;

/**
 * 必选指定 key (value 可为 undefined)而可选其他 key
 */
export type RequiredPickWith<T, K extends keyof T = keyof T, V = undefined> = {
  [P in keyof Required<Pick<T, K>>]: T[P] | V;
} & {
  [P in keyof Partial<Omit<T, K>>]: T[P];
};

/**
 * 必选指定 key 而可选其他 key
 */
export type RequiredPick<T, K extends keyof T = keyof T> = RequiredPickWith<
  T,
  K,
  never
>;

/**
 * 必选指定 key (value 可为 undefined)而可选其他 key
 * @deprecated 请使用 RequiredPickWith
 */
export type RequiredKey<T, K extends keyof T = keyof T> = RequiredPickWith<
  T,
  K
>;

/** 对象路径(用点号连接的键) */
export type ObjectPaths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${ObjectPaths<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;
