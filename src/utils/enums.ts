export type BaseValue = string | number | boolean | null | undefined;

export type EnumFunc = <
  V = BaseValue,
  B extends boolean = boolean,
  R = `${B}` extends "true" ? EnumItem<V> : V,
>(
  kov: BaseValue,
  retItem?: B,
) => R;

export type EnumItem<V = BaseValue> = {
  [k: string]: any;
  key: string;
  value: V;
  label: string;
};

export type EnumMap<V = BaseValue> = Record<string, any> & {
  _label: Record<string, any>;
  _list: EnumItem<V>[];
  _get: EnumFunc;
};

export type EnumList<T extends EnumMap> = T["_list"];

export type EnumItems<T extends EnumMap> = EnumList<T>[number];

export type EnumKeys<T extends EnumMap> = EnumItems<T>["key"];

export type EnumValues<T extends EnumMap> = EnumItems<T>["value"];

export type EnumLabels<T extends EnumMap> = EnumItems<T>["label"];

export type Stringify<T> = T extends BaseValue ? `${T}` : never;

export type Synthesize<Key, Value, Label> = {
  [k in Stringify<Value>]: Key; // value -> key
} & {
  [k in Stringify<Key>]: Value; // key -> value
} & {
  _label: {
    [k in Stringify<Value>]: Label; // value -> label
  } & {
    [k in Stringify<Key>]: Label; // key -> label
  };
};

export type Transform<T> = T extends {
  key: infer Key;
  value: infer Value;
  label: infer Label;
}
  ? Key extends Stringify<Value> // key == String(value)
    ? Synthesize<Value, Value, Label>
    : Synthesize<Key, Value, Label>
  : never;

export type CombineUnion<T> = (
  T extends any ? (param: T) => any : never
) extends (param: infer P) => any // (a | b) -> (a & b)
  ? P
  : never;

/**
 * ```
 * // 用 key 映射 value
 * DemoEnumMap.key -> value
 * // 用 value 映射 key
 * DemoEnumMap.value -> key
 *
 * // 用 key 映射 label
 * DemoEnumMap._label.key -> label
 * // 用 value 映射 label
 * DemoEnumMap._label.value -> label
 * ```
 */
export type DefineEnum<T extends EnumItem[]> = CombineUnion<
  Transform<T[number]>
> & {
  /**
   * ```
   * // 原始输入数组
   * DemoEnumMap._list
   * ```
   */
  _list: T;
  /**
   * ```
   * // 用 key 查找 value
   * DemoEnumMap._get(key) -> value
   * // 用 value 查找 key
   * DemoEnumMap._get(value) -> key
   *
   * // 用 key 查找 原始输入数组 中相关项
   * DemoEnumMap._get(key, true) -> EnumItem
   * // 用 value 查找 原始输入数组 中相关项
   * DemoEnumMap._get(value, true) -> EnumItem
   * ```
   */
  _get: EnumFunc;
};

/**
 * 定义枚举映射，如：
 * ```
 * const DemoEnumMap = defEnumMap([
 *  {
 *    key: "truthy",
 *    value: true,
 *    label: "真值",
 *  },
 *  {
 *    key: "falsy",
 *    value: false,
 *    label: "假值",
 *  },
 * ] as const)
 * ```
 *
 * ---
 *
 * 使用枚举映射，如：
 *
 * ```
 * // 原始输入数组
 * DemoEnumMap._list
 *
 * // 用 key 映射 value
 * DemoEnumMap.key -> value
 * // 用 value 映射 key
 * DemoEnumMap.value -> key
 *
 * // 用 key 映射 label
 * DemoEnumMap._label.key -> label
 * // 用 value 映射 label
 * DemoEnumMap._label.value -> label
 *
 * // 用 key 查找 value
 * DemoEnumMap._get(key) -> value
 * // 用 value 查找 key
 * DemoEnumMap._get(value) -> key
 *
 * // 用 key 查找 原始输入数组 中相关项
 * DemoEnumMap._get(key, true) -> EnumItem
 * // 用 value 查找 原始输入数组 中相关项
 * DemoEnumMap._get(value, true) -> EnumItem
 * ```
 */
export const defEnumMap = <T extends EnumItem[]>(list: T): DefineEnum<T> => {
  const kvMap: any = {};
  const lMap: any = {};

  list.forEach(({ key, label, value }) => {
    kvMap[value as any] = key;
    kvMap[key] = value;

    lMap[value as any] = label;
    lMap[key] = label;
  });

  const kvlMap = kvMap;
  kvlMap._label = lMap;
  kvlMap._list = list;
  kvlMap._get = (kov: any, retItem?: boolean) => {
    const kItem = list.find((x) => x.key === kov);
    if (kItem) {
      return retItem ? kItem : kItem.value;
    }

    const vItem = list.find((x) => x.value === kov);
    if (vItem) {
      return retItem ? vItem : vItem.key;
    }
  };

  return kvlMap;
};
