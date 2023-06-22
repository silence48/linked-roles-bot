/*import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import {
  createCookie,
  createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";
import * as build from "@remix-run/dev/server-build";


const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => {
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
}*/

import { logDevReady, createWorkersKVSessionStorage, createCookie } from "@remix-run/cloudflare";
import { createPagesFunctionHandler  } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}



export const onRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => {
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