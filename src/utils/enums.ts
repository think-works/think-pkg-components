export type BaseValue = string | number | boolean | null | undefined;

export type EnumItem<V = BaseValue> = {
  [k: string]: any;
  key: string;
  value: V;
  label: string;
};

export type EnumMap<V = BaseValue> = {
  [key: string]: any;
  _list: EnumItem<V>[];
};

export type EnumList<T extends EnumMap> = T["_list"];

export type EnumItems<T extends EnumMap> = EnumList<T>[number];

export type EnumKeys<T extends EnumMap> = EnumItems<T>["key"];

export type EnumValues<T extends EnumMap> = EnumItems<T>["value"];

export type EnumLabels<T extends EnumMap> = EnumItems<T>["label"];

export type EnumFunc<
  T extends EnumMap,
  F = "key" | "value",
  IS = EnumItems<T>,
  KS = EnumKeys<T>,
  VS = EnumValues<T>,
  LS = EnumLabels<T>,
> = {
  /**
   * ```
   * // 用 key/value 查找 原始输入数组 中相关项
   * DemoEnumMap._getLabel(keyOrValue) -> EnumItem
   * ```
   */
  _getItem: (keyOrValue: BaseValue, find?: F) => IS;
  /**
   * ```
   * // 用 key/value 查找 label
   * DemoEnumMap._getLabel(keyOrValue) -> label
   * ```
   */
  _getLabel: (keyOrValue: BaseValue, find?: F) => LS;
  /**
   * ```
   * // 用 key 查找 value
   * DemoEnumMap._getValue(key) -> value
   * ```
   */
  _getValue: (key: BaseValue) => VS;
  /**
   * ```
   * // 用 value 查找 key
   * DemoEnumMap._getKey(value) -> key
   * ```
   */
  _getKey: (value: BaseValue) => KS;
};

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
 * // 用 key/value 查找 label
 * DemoEnumMap._getLabel(keyOrValue) -> label
 *
 * // 用 key/value 查找 原始输入数组 中相关项
 * DemoEnumMap._getLabel(keyOrValue) -> EnumItem
 * ```
 */
export const defEnumMap = <
  T extends EnumItem[],
  M extends EnumMap = DefineEnum<T>,
  F = EnumFunc<M>,
>(
  list: T,
): M & F => {
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

  // 用 key/value 查找 item
  kvlMap._getItem = (keyOrValue: any, find?: "key" | "value") => {
    let item: EnumItem | undefined;
    if (!find || find === "key") {
      item = list.find((x) => x.key === keyOrValue);
    }
    if (!find || find === "value") {
      item = list.find((x) => x.value === keyOrValue);
    }
    return item;
  };

  // 用 key/value 查找 label
  kvlMap._getLabel = (keyOrValue: any, find?: "key" | "value") => {
    const item = kvlMap._getItem(keyOrValue, find);
    return item?.label;
  };

  // 用 key 查找 value
  kvlMap._getValue = (key: any) => {
    const item = kvlMap._getItem(key, "key");
    return item?.value;
  };

  // 用 value 查找 key
  kvlMap._getKey = (value: any) => {
    const item = kvlMap._getItem(value, "value");
    return item?.key;
  };

  return kvlMap;
};
