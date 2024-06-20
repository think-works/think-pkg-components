/**
 * UUID v4
 * http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523
 * https://crypto.stackexchange.com/questions/81619/is-it-possible-to-create-a-128-bit-uuid-from-a-weak-entropy-source
 * https://gist.github.com/jed/982883?permalink_comment_id=2403369#gistcomment-2403369
 * https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
 */
export const uuid4 = () => {
  const crypto = window.crypto;

  if (crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  if (crypto && crypto.getRandomValues) {
    return `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16),
    );
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 字符串 hash
 * https://github.com/darkskyapp/string-hash
 */
export const stringHash = (str: string) => {
  let hash = 5381,
    i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
};

/**
 * 数据脱敏
 * phone: 12345678901 => 123****8901
 * identity: 123456789012345678 => 1234**********5678
 * email: 12345@678.90 => 12****@***.90
 */
export const dataMasking = (
  text: string,
  options?: {
    format?: "phone" | "identity" | "email";
    start?: number;
    end?: number;
    mask?: number;
    char?: string;
  },
): string => {
  const { format, start, end, mask, char = "*" } = options || {};

  let _start = start ?? 1;
  let _end = end ?? (text.length > 2 ? 1 : 0);
  let _mask = mask;

  if (format === "phone") {
    // 处理手机号
    _start = start ?? 3;
    _end = end ?? 4;
  } else if (format === "identity") {
    // 处理身份证
    _start = start ?? 4;
    _end = end ?? 4;
  } else if (format === "email") {
    // 处理邮箱
    const atIdx = text.indexOf("@");
    if (atIdx !== -1) {
      // 根据 @ 分割前缀和后缀
      const prefixText = text.slice(0, atIdx);
      const suffixText = text.slice(atIdx + 1);

      // 保留第一个 . 之后的字符
      const dotIdx = suffixText.lastIndexOf(".");
      const dotLen = dotIdx !== -1 ? suffixText.length - dotIdx : undefined;

      _start = start ?? 2;
      _end = end ?? dotLen ?? 2;
      _mask = mask ? mask / 2 : mask;

      // 递归处理前缀和后缀
      const prefixMask = dataMasking(prefixText, {
        start: _start,
        end: 0,
        mask: _mask,
        char,
      });
      const suffixMask = dataMasking(suffixText, {
        start: 0,
        end: _end,
        mask: _mask,
        char,
      });

      return prefixMask + "@" + suffixMask;
    }
  }

  let restText = text;
  let startText = "";
  let endText = "";
  let maskText = "";

  // 明文字符 + 脱敏字符
  startText = restText.slice(0, _start);
  restText = restText.slice(_start);

  // 脱敏字符 + 明文字符
  endText = restText.slice(restText.length - _end);
  restText = restText.slice(0, restText.length - _end);

  // 脱敏字符
  maskText = char.repeat(_mask ?? restText.length);

  return startText + maskText + endText;
};
