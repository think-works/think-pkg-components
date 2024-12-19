export type BaseValue = string | number | boolean | null | undefined;

export type EnumFunc = <
  V = BaseValue,
  B extends boolean = boolean,
  R = `${B}` extends "true" ? EnumItem<V> : V,
>(
  kov: BaseValue,
  retItem?: B,
) => R | undefined;

export type EnumItem<V = BaseValue> = {
  [k: string]: any;
  key: string;
  value: V;
  label: string;
};

export type EnumMap<V = BaseValue> = Record<string, any> & {
  _label: Record<string, any>;
  _list: EnumItem<V>[];
  _getValue: (key: string) => V;
  _getKey: (value: V) => string;
  _getLabelByKey: (key: string) => string;
  _getLabelByValue: (value: V) => string;
  _getItemByKey: (key: string) => EnumItem<V>;
  _getItemByValue: (value: V) => EnumItem<V>;
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
  /**
   * ```
   * // 用 key 映射 label
   * DemoEnumMap._label.key -> label
   * // 用 value 映射 label
   * DemoEnumMap._label.value -> label
   * ```
   */
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
   * DemoEnumMap._getValue(key) -> value
   * ```
   */
  _getValue: EnumMap["_getValue"];
  /**
   * ```
   * // 用 value 查找 key
   * DemoEnumMap._getKey(value) -> key
   * ```
   */
  _getKey: EnumMap["_getKey"];

  /**
   * ```
   * // 用 key 查找 label
   * DemoEnumMap._getLabelByKey(key) -> label
   * ```
   */
  _getLabelByKey: EnumMap["_getLabelByKey"];
  /**
   * ```
   * // 用 value 查找 label
   * DemoEnumMap._getLabelByValue(value) -> label
   * ```
   */
  _getLabelByValue: EnumMap["_getLabelByValue"];

  /**
   * ```
   * // 用 key 查找 原始输入数组 中相关项
   * DemoEnumMap._getItemByKey = (key) -> EnumItem
   * ```
   */
  _getItemByKey: EnumMap["_getItemByKey"];
  /**
   * ```
   * // 用 value 查找 原始输入数组 中相关项
   * DemoEnumMap._getItemByValue = (value) -> EnumItem
   * ```
   */
  _getItemByValue: EnumMap["_getItemByValue"];

  /**
   * @deprecated
   * ```
   * // 用 key/value 查找 value/key
   * // 用 key/value 查找 原始输入数组 中相关项
   * DemoEnumMap._get(key) -> value
   * DemoEnumMap._get(value) -> key
   * DemoEnumMap._get(key, true) -> EnumItem
   * DemoEnumMap._get(value, true) -> EnumItem
   * ```
   */
  _get: EnumMap["_get"];
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
 * ] as const) // 必须使用 as const
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
 * DemoEnumMap._getValue(key) -> value
 * // 用 value 查找 key
 * DemoEnumMap._getKey(value) -> key
 *
 * // 用 key 查找 label
 * DemoEnumMap._getLabelByKey(key) -> label
 * // 用 value 查找 label
 * DemoEnumMap._getLabelByValue(value) -> label
 *
 * // 用 key 查找 原始输入数组 中相关项
 * DemoEnumMap._getItemByKey = (key) -> EnumItem
 * // 用 value 查找 原始输入数组 中相关项
 * DemoEnumMap._getItemByValue = (value) -> EnumItem
 *
 * // 用 key/value 查找 value/key
 * // 用 key/value 查找 原始输入数组 中相关项
 * DemoEnumMap._get(key) -> value
 * DemoEnumMap._get(value) -> key
 * DemoEnumMap._get(key, true) -> EnumItem
 * DemoEnumMap._get(value, true) -> EnumItem
 * ```
 */
export const defEnumMap = <T extends EnumItem[]>(list: T): DefineEnum<T> => {
  const kvMap: any = {};
  const lMap: any = {};

  list.forEach(({ key, label, value }) => {
    // 用 value 映射 key
    kvMap[value as any] = key;
    // 用 key 映射 value
    kvMap[key] = value;

    // 用 value 映射 label
    lMap[value as any] = label;
    // 用 key 映射 label
    lMap[key] = label;
  });

  const kvlMap = { ...kvMap };
  kvlMap._label = { ...lMap };

  // 原始输入数组
  kvlMap._list = list;

  // 用 key 查找 value
  kvlMap._getValue = (key: any) => {
    return kvlMap._getItemByKey(key)?.value;
  };
  // 用 value 查找 key
  kvlMap._getKey = (value: any) => {
    return kvlMap._getItemByValue(value)?.key;
  };

  // 用 key 查找 label
  kvlMap._getLabelByKey = (key: any) => {
    return kvlMap._getItemByKey(key)?.label;
  };
  // 用 value 查找 label
  kvlMap._getLabelByValue = (value: any) => {
    return kvlMap._getItemByValue(value)?.label;
  };

  // 用 key 查找 原始输入数组 中相关项
  kvlMap._getItemByKey = (key: any) => {
    return list.find((x) => x.key === key);
  };
  // 用 value 查找 原始输入数组 中相关项
  kvlMap._getItemByValue = (value: any) => {
    return list.find((x) => x.value === value);
  };

  // 用 key/value 查找 value/key
  // 用 key/value 查找 原始输入数组 中相关项
  kvlMap._get = (keyOrValue: any, getItem?: boolean) => {
    const kItem = kvlMap._getItemByKey(keyOrValue);
    if (kItem) {
      return getItem ? kItem : kItem.value;
    }

    const vItem = kvlMap._getItemByValue(keyOrValue);
    if (vItem) {
      return getItem ? vItem : vItem.key;
    }
  };

  return kvlMap;
};
