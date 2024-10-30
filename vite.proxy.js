const commonOptions = {
  changeOrigin: true, // host 请求头
  cookieDomainRewrite: "", // cookie 所属域
  // headers: {
  //   Origin: proxyTarget, // https://github.com/http-party/node-http-proxy/pull/1130
  //   Connection: "keep-alive", // https://stackoverflow.com/a/53499411
  // },
};

export default ({ apiBase, target }) => ({
  [`/quality/api`]: {
    target,
    ...commonOptions,
  },
  [`${apiBase}api`]: {
    target,
    ...commonOptions,
  },
});
