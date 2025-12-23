import { createRequire } from "module";

const require = createRequire(import.meta.url);

export default {
  importOrder: [
    "^[^@/.]+", // "name"
    "^@[^/]+/", // "@scope/name"
    "^@/", // "@/path"
    "^/", // "/path"
    "^[.]{2}/", // "../path"
    "^[.]/", // "./path"
  ],
  importOrderSideEffects: false,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
};
