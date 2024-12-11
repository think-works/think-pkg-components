const commonOptions = {
  changeOrigin: true, // host 请求头
  cookieDomainRewrite: "", // cookie 所属域
  // headers: {
  //   Origin: proxyTarget, // https://github.com/http-party/node-http-proxy/pull/1130
  //   Connection: "keep-alive", // https://stackoverflow.com/a/53499411
  // },
};

const getProxyRules = (proxyPaths, options) => {
  return proxyPaths.reduce((rules, path) => {
    rules[path] = { ...options };
    return rules;
  }, {});
};

const fullServiceTarget = "https://dev.xincetest.com:10443";

export default ({ apiBase, proxyTarget }) => ({
  ...getProxyRules([`/login`, `/meta`, `/quality/api`], {
    ...commonOptions,
    target: fullServiceTarget,
  }),
  [`${apiBase}api`]: {
    ...commonOptions,
    target: proxyTarget,
  },
});
