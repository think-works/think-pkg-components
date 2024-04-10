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
