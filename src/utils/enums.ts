export type BaseValue = string | number | boolean | null | undefined;

export type Func = <
  Result = BaseValue,
  P extends BaseValue = boolean,
  R = `${P}` extends "true" ? EnumItem<Result> : Result,
>(
  kov: BaseValue,
  retItem?: P,
) => R;

export type EnumItem<V = BaseValue> = {
  [k: string]: any;
  key: string;
  value: V;
  label: string;
};

export type EnumFunc = Record<string, any> & Func;

export type EnumMap<V = BaseValue> = {
  _list: EnumItem<V>[];
  _label: EnumFunc;
} & EnumFunc;

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
 * key/value 映射
 * ```
 * DemoEnumMap.key -> value
 * DemoEnumMap.value -> key
 *
 * DemoEnumMap(key) -> value
 * DemoEnumMap(value) -> key
 *
 * DemoEnumMap(key, true) -> EnumItem
 * DemoEnumMap(value, true) -> EnumItem
 * ```
 */
export type DefineEnum<T extends EnumItem[]> = CombineUnion<
  Transform<T[number]>
> & {
  /**
   * 原始输入数组
   */
  _list: T;
  /**
   * label 映射
   * ```
   * DemoEnumMap._label.key -> label
   * DemoEnumMap._label.value -> label
   *
   * DemoEnumMap._label(key) -> label
   * DemoEnumMap._label(value) -> label
   *
   * DemoEnumMap._label(key, true) -> EnumItem
   * DemoEnumMap._label(value, true) -> EnumItem
   * ```
   */
  _label: Func;
} & Func;

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
 * key/value 映射
 * ```
 * DemoEnumMap.key -> value
 * DemoEnumMap.value -> key
 *
 * DemoEnumMap(key) -> value
 * DemoEnumMap(value) -> key
 *
 * DemoEnumMap(key, true) -> EnumItem
 * DemoEnumMap(value, true) -> EnumItem
 * ```
 *
 * 原始输入数组
 * ```
 * DemoEnumMap._list
 * ```
 *
 * label 映射
 * ```
 * DemoEnumMap._label.key -> label
 * DemoEnumMap._label.value -> label
 *
 * DemoEnumMap._label(key) -> label
 * DemoEnumMap._label(value) -> label
 *
 * DemoEnumMap._label(key, true) -> EnumItem
 * DemoEnumMap._label(value, true) -> EnumItem
 * ```
 */
export const defEnumMap = <T extends EnumItem[]>(list: T): DefineEnum<T> => {
  const kvMap: any = (kov: any, retItem?: boolean) => {
    const kItem = list.find((x) => x.key === kov);
    if (kItem) {
      return retItem ? kItem : kItem.value;
    }

    const vItem = list.find((x) => x.value === kov);
    if (vItem) {
      return retItem ? vItem : vItem.key;
    }
  };

  const lMap: any = (kov: any, retItem?: boolean) => {
    const kItem = list.find((x) => x.key === kov);
    if (kItem) {
      return retItem ? kItem : kItem.label;
    }

    const vItem = list.find((x) => x.value === kov);
    if (vItem) {
      return retItem ? vItem : vItem.label;
    }
  };

  list.forEach(({ key, label, value }) => {
    kvMap[value as any] = key;
    kvMap[key] = value;

    lMap[value as any] = label;
    lMap[key] = label;
  });

  const kvlMap = kvMap;
  kvlMap._label = lMap;
  kvlMap._list = list;

  return kvlMap;
};
