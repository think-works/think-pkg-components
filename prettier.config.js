export default {
  importOrder: [
    "global(.ts)?$", // "global.ts"
    "^[^@/.]+", // "name"
    "^@[^/]+/", // "@scope/name"
    "^@/", // "@/path"
    "^/", // "/path"
    "^[.]{2}/", // "../path"
    "^[.]/", // "./path"
  ],
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
};
