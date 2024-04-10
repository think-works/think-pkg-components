/**
 * 千分位分割数值
 * https://en.wikipedia.org/wiki/Decimal_separator
 */
export const separator = (num: number, len = 0, pad = true) => {
  let strNum = "";
  let decLen = 0;

  if (typeof len === "number" && len > 0) {
    decLen = len;
  }

  if (typeof num === "number") {
    strNum = num.toFixed(decLen);
  }

  if (strNum) {
    const match = strNum.match(/^(-)?(\d+)(\.(\d*))?$/);
    if (match) {
      const symbol = match[1] ? match[1] : "";
      let integer = match[2] ? match[2] : "";
      let fraction = match[4] ? match[4] : "";

      if (integer.length > 3) {
        const source = integer.split("");
        const target: any[] = [];

        for (let i = 0; i < source.length; i++) {
          const index = source.length - 1 - i;
          const item = source[index];

          target.push(item);
          if ((i + 1) % 3 === 0 && i !== source.length - 1) {
            target.push(",");
          }
        }

        integer = target.reverse().join("");
      }

      if (fraction.length < decLen) {
        if (pad) {
          fraction = fraction.padEnd(decLen, "0");
        }

        fraction = fraction.substring(0, decLen);
      }

      return symbol + integer + (fraction ? `.${fraction}` : "");
    }
  }

  return num;
};

/**
 * 人类友好的时间间隔
 */
export const timespan = (timestamp: number, units = {}) => {
  const s = 1000;
  const m = s * 60;
  const H = m * 60;
  const D = H * 24;
  const M = D * 30;
  const Y = M * 12;

  const map = {
    S: " 毫秒",
    s: " 秒",
    m: " 分钟",
    H: " 小时",
    D: " 天",
    M: " 月",
    Y: " 年",
    ...units,
  };

  const list: string[] = [];
  let span: number = timestamp;

  if (typeof timestamp === "number") {
    if (span >= Y && map.Y) {
      const integer = Math.floor(span / Y);
      list.push(integer + map.Y);
      span = span - integer * Y;
    }
    if (span >= M && map.M) {
      const integer = Math.floor(span / M);
      list.push(integer + map.M);
      span = span - integer * M;
    }
    if (span >= D && map.D) {
      const integer = Math.floor(span / D);
      list.push(integer + map.D);
      span = span - integer * D;
    }
    if (span >= H && map.H) {
      const integer = Math.floor(span / H);
      list.push(integer + map.H);
      span = span - integer * H;
    }
    if (span >= m && map.m) {
      const integer = Math.floor(span / m);
      list.push(integer + map.m);
      span = span - integer * m;
    }
    if (span >= s && map.s) {
      const integer = Math.floor(span / s);
      list.push(integer + map.s);
      span = span - integer * s;
    }
    if (map.S) {
      list.push(span + map.S);
    }
  }

  return list.join(" ");
};

/**
 * 人类友好的时间点
 */
export const datetime = (timestamp: number, len = 0, units = {}) => {
  const s = 1000;
  const m = s * 60;
  const H = m * 60;
  const D = H * 24;
  const M = D * 30;
  const Y = M * 12;

  const map = {
    S: " 毫秒前",
    s: " 秒前",
    m: " 分钟前",
    H: " 小时前",
    D: " 天前",
    M: " 月前",
    Y: " 年前",
    ...units,
  };

  let ret: number | string = timestamp;

  if (typeof timestamp === "number") {
    if (timestamp >= Y && map.Y) {
      ret = separator(timestamp / Y, len) + map.Y;
    } else if (timestamp >= M && map.M) {
      ret = separator(timestamp / M, len) + map.M;
    } else if (timestamp >= D && map.D) {
      ret = separator(timestamp / D, len) + map.D;
    } else if (timestamp >= H && map.H) {
      ret = separator(timestamp / H, len) + map.H;
    } else if (timestamp >= m && map.m) {
      ret = separator(timestamp / m, len) + map.M;
    } else if (timestamp >= s && map.s) {
      ret = separator(timestamp / s, len) + map.s;
    } else if (map.S) {
      ret = separator(timestamp, len) + map.S;
    }
  }

  return ret;
};

/**
 * 人类友好的存储
 */
export const storage = (num: number, len = 0, units = {}) => {
  const K = 1024;
  const M = K * 1024;
  const G = M * 1024;
  const T = G * 1024;
  const P = T * 1024;
  const E = P * 1024;
  const Z = E * 1024;
  const Y = Z * 1024;

  const map = {
    B: " B",
    K: " KiB",
    M: " MiB",
    G: " GiB",
    T: " TiB",
    P: " PiB",
    E: " EiB",
    Z: " ZiB",
    Y: " YiB",
    ...units,
  };

  let ret: number | string = num;

  if (typeof num === "number") {
    if (num >= Y && map.Y) {
      ret = separator(num / Y, len) + map.Y;
    } else if (num >= Z && map.Z) {
      ret = separator(num / Z, len) + map.Z;
    } else if (num >= E && map.E) {
      ret = separator(num / E, len) + map.E;
    } else if (num >= P && map.P) {
      ret = separator(num / P, len) + map.P;
    } else if (num >= T && map.T) {
      ret = separator(num / T, len) + map.T;
    } else if (num >= G && map.G) {
      ret = separator(num / G, len) + map.G;
    } else if (num >= M && map.M) {
      ret = separator(num / M, len) + map.M;
    } else if (num >= K && map.K) {
      ret = separator(num / K, len) + map.K;
    } else if (map.B) {
      ret = separator(num, len) + map.B;
    }
  }

  return ret;
};
