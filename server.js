import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import {
  createCookie,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";


const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => {
    console.log('context.env', context.env)
    const sessionStorage = createWorkersKVSessionStorage({
      kv: context.env.SESSION_STORAGE,
      cookie: createCookie("__session", {
        secrets: ["r3m1xr0ck5"],
        sameSite: true,
        secure: true,
        path: '/'
      }),
    });
    return { env: context.env, sessionStorage };
  }
});

export function onRequest(context) {
  return handleRequest(context);
}