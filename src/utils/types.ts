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

/**
 * 可变类型移除 readonly
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U>
    ? Mutable<U>[]
    : Mutable<T[P]>;
};

/**
 * 提取静态数组项类型
 */
export type Array2Union<T extends readonly unknown[]> = T[number];

/**
 * 必选指定 key 且其他 key 可选
 */
export type RequiredPick<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & {
  [PP in Exclude<keyof T, K>]?: T[PP];
};

/**
 * 可选指定 key 且其他 key 必选
 */
export type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P];
} & {
  [PP in Exclude<keyof T, K>]-?: T[PP];
};

/**
 * 必选 key 且 value 可为 undefined
 */
export type RequiredKey<T, R = Required<T>> = {
  [P in keyof R]: R[P] | undefined;
};

/**
 * useState 的 set 函数类型
 */
export type SetState<S = undefined> = React.Dispatch<
  React.SetStateAction<S | undefined>
>;

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
 * 真值转换
 */
export const truthy = <T>(
  value: T,
): value is Exclude<T, false | "" | 0 | null | undefined> => Boolean(value);

/**
 * 元组类型
 */
export const tuple = <T extends [any, ...any[]]>(value: T) => value;
