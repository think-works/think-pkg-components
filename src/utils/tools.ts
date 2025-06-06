// #region 通用辅助函数
import { LiteralUnion } from "./types";

/**
 * 类型检查
 */
export const isType = <T = any>(
  val: any,
  type: LiteralUnion<
    | "Undefined"
    | "Null"
    | "Boolean"
    | "Number"
    | "String"
    | "Object"
    | "Array"
    | "Function"
    | "Error"
    | "Date"
    | "RegExp"
    | "Promise"
    | "Map"
    | "Set"
    | "WeakMap"
    | "WeakSet"
    | "BigInt"
    | "DataView"
    | "ArrayBuffer"
    | "SharedArrayBuffer"
    | "Int8Array"
    | "Uint8Array"
    | "Uint8ClampedArray"
    | "Int16Array"
    | "Uint16Array"
    | "Int32Array"
    | "Uint32Array"
    | "Float16Array"
    | "Float32Array"
    | "Float64Array"
    | "BigInt64Array"
    | "BigUint64Array"
    | "JSON"
    | "Math"
    | "Intl"
    | "Symbol"
    | "Proxy"
    | "Reflect"
    | "Atomics"
    | "WebAssembly"
    | "GeneratorFunction"
  >,
): val is T => {
  return Object.prototype.toString.call(val) === `[object ${type}]`;
};

/**
 * 空白字符串检查
 */
export const isBlank = (
  text: string | null | undefined,
  options?: {
    /** 检查空字符串 */
    detectEmpty?: boolean;
    /** 检查空白字符 */
    detectSpace?: boolean;
  },
): boolean => {
  const { detectEmpty = false, detectSpace = false } = options || {};

  if (text === undefined) {
    return true;
  }
  if (text === null) {
    return true;
  }
  if (detectEmpty && text === "") {
    return true;
  }
  if (detectSpace && /^\s*$/.test(text)) {
    return true;
  }
  return false;
};

/**
 * 标准化对象
 */
export const normalizeObject = (
  obj: Record<string, any>,
  options?: {
    /** 排序 key */
    sortKey?: boolean;
    /** 移除 value 前后空格 */
    trimVal?: boolean;
    /** 清理 undefined */
    clearUndefined?: boolean;
    /** 清理 null */
    clearNull?: boolean;
    /** 清理空字符串 */
    clearEmpty?: boolean;
    /** 清理空白字符 */
    clearSpace?: boolean;
    /** 递归清理 */
    clearRecursion?: boolean;
  },
) => {
  const {
    sortKey = false,
    trimVal = false,
    clearUndefined = false,
    clearNull = false,
    clearEmpty = false,
    clearSpace = false,
    clearRecursion = false,
  } = options || {};

  let _obj = obj;

  if (obj) {
    let keys = Object.keys(obj);

    if (sortKey) {
      keys = keys.sort();
    }

    _obj = keys.reduce((ret, key) => {
      const val = obj[key];

      if (clearRecursion && isType<Record<string, any>>(val, "Object")) {
        ret[key] = normalizeObject(val, options);
      } else {
        const skip =
          (clearUndefined && val === undefined) ||
          (clearNull && val === null) ||
          (clearEmpty && val === "") ||
          (clearSpace && /^\s*$/.test(val));

        if (!skip) {
          let _val = val;

          if (trimVal && isType<string>(val, "String")) {
            _val = val.trim();
          }

          ret[key] = _val;
        }
      }

      return ret;
    }, {} as any);
  }

  return _obj;
};

// #endregion

// #region JSON 序列化

/**
 * 尝试 JSON 序列化
 */
export const jsonTryStringify = <T = any>(value?: T, dftValue?: string) => {
  let ret: string | undefined = dftValue;

  if (value) {
    try {
      ret = JSON.stringify(value);
    } catch {
      // ignore error
    }
  }

  return ret;
};

/**
 * 尝试 JSON 反序列化
 */
export const jsonTryParse = <T = any>(value?: string, dftValue?: T) => {
  let ret: T | undefined = dftValue;

  if (value) {
    try {
      ret = JSON.parse(value);
    } catch {
      // ignore error
    }
  }

  return ret;
};

// #endregion

// #region 解析查询参数

/**
 * 反序列化查询字符串
 */
export const parseQuery = (
  search: string,
  options?: {
    /** JSON 反序列化 value */
    jsonVal?: boolean;
    /** 排序 key */
    sortKey?: boolean;
  },
) => {
  let query: Record<string, any> = {};
  const { jsonVal = false, sortKey = false } = options || {};

  if (search) {
    const str = search.replace(/^\?+/, "");
    const arr = str.split("&");

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];

      if (item === "") {
        continue;
      }

      const [key, val] = item.split("=");

      if (key === "") {
        continue;
      }

      const _key = decodeURIComponent(key);
      let _val = decodeURIComponent(val);

      if (jsonVal && _val !== undefined && _val !== "") {
        try {
          // 尝试 JSON 反序列化
          _val = JSON.parse(_val);
        } catch {
          // ignore error
        }
      }

      query[_key] = _val;
    }

    // 按照 key 排序，并递归删除 value 为 undefined 的项。
    query = normalizeObject(query, {
      sortKey,
      clearUndefined: true,
      clearRecursion: true,
    });
  }

  return query;
};

/**
 * 序列化查询对象
 */
export const stringifyQuery = (
  query: Record<string, any>,
  options?: {
    /** JSON 序列化 value */
    jsonVal?: boolean;
    /** 排序 key */
    sortKey?: boolean;
  },
) => {
  const list: string[] = [];
  const { jsonVal = false, sortKey = false } = options || {};

  if (query) {
    // 按照 key 排序，并递归删除 value 为 undefined 的项。
    const _query = normalizeObject(query, {
      sortKey,
      clearUndefined: true,
      clearRecursion: true,
    });

    for (const key in _query) {
      const val = _query[key];

      let _val = val;

      if (jsonVal && _val !== undefined && _val !== "") {
        try {
          // 尝试 JSON 序列化
          _val = JSON.stringify(_val);
        } catch {
          // ignore error
        }
      }

      const _key = encodeURIComponent(key);
      _val = encodeURIComponent(_val);

      list.push(`${_key}=${_val}`);
    }
  }

  return list.length ? "?" + list.join("&") : "";
};

// #endregion

// #region 持久化存储

/**
 * 读取 Storage
 */
export const queryStorage = <T = any>(
  key: string,
  options?: {
    /** 使用 sessionStorage */
    session?: boolean;
    /** JSON 反序列化 value */
    jsonVal?: boolean;
  },
) => {
  const { session = false, jsonVal = false } = options || {};
  const storage = session ? sessionStorage : localStorage;

  let _val = storage.getItem(key);

  if (jsonVal && _val !== undefined && _val !== null && _val !== "") {
    try {
      // 尝试 JSON 反序列化
      _val = JSON.parse(_val);
    } catch {
      // ignore error
    }
  }

  return _val as T;
};

/**
 * 写入 Storage
 */
export const updateStorage = <T = any>(
  key: string,
  val: T,
  options?: {
    /** 使用 sessionStorage */
    session?: boolean;
    /** JSON 序列化 value */
    jsonVal?: boolean;
  },
) => {
  const { session = false, jsonVal = false } = options || {};
  const storage = session ? sessionStorage : localStorage;

  let _val: any = val;

  if (jsonVal && _val !== undefined && _val !== null && _val !== "") {
    try {
      // 尝试 JSON 序列化
      _val = JSON.stringify(_val);
    } catch {
      // ignore error
    }
  }

  storage.setItem(key, _val);
};

/**
 * 删除 Storage
 */
export const deleteStorage = (
  key: string,
  options?: {
    /** 使用 sessionStorage */
    session?: boolean;
  },
) => {
  const { session = false } = options || {};
  const storage = session ? sessionStorage : localStorage;

  storage.removeItem(key);
};

// #endregion

// #region 时间转换

/**
 * 毫秒转换为 YYYY-MM-DD HH:mm:ss.SSS
 */
export const msecToString = (timestamp: number, format: string) => {
  let ret;

  if (timestamp && format) {
    const time = new Date(timestamp);

    const sYear = time.getFullYear().toString().substr(-2); // 短年份
    const sMonth = time.getMonth() + 1; // 短月份
    const sDate = time.getDate(); // 短日期
    const sHour = time.getHours(); // 短小时
    const sMinutes = time.getMinutes(); // 短分钟
    const sSecond = time.getSeconds(); // 短秒
    const sMillisecond = time.getMilliseconds(); // 短毫秒

    const lYear = time.getFullYear(); // 长年份
    const lMonth = sMonth < 10 ? `0${sMonth}` : sMonth; // 长月份
    const lDate = sDate < 10 ? `0${sDate}` : sDate; // 长日期
    const lHour = sHour < 10 ? `0${sHour}` : sHour; // 长小时
    const lMinutes = sMinutes < 10 ? `0${sMinutes}` : sMinutes; // 长分钟
    const lSecond = sSecond < 10 ? `0${sSecond}` : sSecond; // 长秒
    const lMillisecond = sMillisecond < 10 ? `0${sMillisecond}` : sMillisecond; // 长毫秒

    const llMillisecond =
      sMillisecond < 10
        ? `00${sMillisecond}`
        : sMillisecond < 100
          ? `0${sMillisecond}`
          : sMillisecond; // 长长毫秒

    ret = format;

    ret = ret.replace(/YYYY/g, String(lYear)); // 长年份
    ret = ret.replace(/YY/g, String(sYear)); // 短年份

    ret = ret.replace(/MM/g, String(lMonth)); // 长月份
    ret = ret.replace(/M/g, String(sMonth)); // 短月份

    ret = ret.replace(/DD/g, String(lDate)); // 长日期
    ret = ret.replace(/D/g, String(sDate)); // 短日期

    ret = ret.replace(/HH/g, String(lHour)); // 长小时
    ret = ret.replace(/H/g, String(sHour)); // 短小时

    ret = ret.replace(/mm/g, String(lMinutes)); // 长分钟
    ret = ret.replace(/m/g, String(sMinutes)); // 短分钟

    ret = ret.replace(/ss/g, String(lSecond)); // 长秒
    ret = ret.replace(/s/g, String(sSecond)); // 短秒

    ret = ret.replace(/SSS/g, String(llMillisecond)); // 长长毫秒
    ret = ret.replace(/SS/g, String(lMillisecond)); // 长毫秒
    ret = ret.replace(/S/g, String(sMillisecond)); // 短毫秒
  }

  return ret;
};

/**
 * YYYY-MM-DD HH:mm:ss.SSS 转换为 Date
 */
export const stringToDate = (dateString: string) => {
  let ret;

  /**
   * [
   *   '1-2-3 4:5:6.7',
   *   '1',
   *   '2',
   *   '3',
   *   ' 4:5:6.7',
   *   '4',
   *   ':5:6.7',
   *   '5',
   *   ':6.7',
   *   '6',
   *   '.7',
   *   '7',
   *   index: 0,
   *   input: '1-2-3 4:5:6.7',
   *   groups: undefined
   * ]
   */
  const r =
    "([0-9]{1,4})-([0-9]{1,2})-([0-9]{1,2})( ([0-9]{1,2})(:([0-9]{1,2})(:([0-9]{1,2})(\\.([0-9]{1,3}))?)?)?)?";
  if (dateString) {
    const d: any = dateString.match(new RegExp(r));
    if (d) {
      ret = new Date(d[1] - 0, d[2] - 1, d[3] - 0);
      if (d[5]) {
        ret.setHours(d[5] - 0);
      }
      if (d[7]) {
        ret.setMinutes(d[7] - 0);
      }
      if (d[9]) {
        ret.setSeconds(d[9] - 0);
      }
      if (d[11]) {
        ret.setMilliseconds(d[11] - 0);
      }
    }
  }

  return ret;
};

// #endregion
