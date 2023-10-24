
// console.log('await polyfillPath("fs")', await polyfillPath("fs"))
/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  devServerBroadcastDelay: 1000,
  ignoredRouteFiles: ["**/.*"],
  server: "./server.js",
  serverBuildPath: "functions/[[path]].js",
  serverConditions: ["worker"],
  serverDependenciesToBundle: "all",
  serverMainFields: ["browser", "module", "main"],
  serverMinify: true,
  serverModuleFormat: "esm",
  serverPlatform: "neutral",
  tailwind: true,
  postcss: true,
  browserNodeBuiltinsPolyfill: {
    modules: {
      buffer: true,
      events: true,
    },
  },
  serverNodeBuiltinsPolyfill: {
    modules: {
      buffer: true,
      events: true,
      fs: "empty",
      os: true,
      path: true,
      crypto: true
    },
  },
  globals: {
    Buffer: true,
  },
};
