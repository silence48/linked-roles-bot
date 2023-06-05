/*
import type { EntryContext } from "@remix-run/cloudflare";
// import { RemixServer } from "@remix-run/react";
//import { renderToString } from "react-dom/server";
//import { Buffer } from "buffer-polyfill";

// Polyfill Buffer on the server
//globalThis.Buffer = Buffer as unknown as BufferConstructor;
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {

  const { renderToString } = await import('react-dom/server');
  const { RemixServer } = await import('@remix-run/react');
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
*/
import type { EntryContext } from "@remix-run/cloudflare";
import { RemixServer } from "@remix-run/react";
//import isbot from "isbot";

import { CacheProvider } from '@emotion/react'
import createEmotionServer from '@emotion/server/create-instance'
import { ServerStyleContext } from './context'
import createEmotionCache from './createEmotionCache'


//import { renderToString } from "react-dom/server";

import { renderToReadableStream, renderToString } from "react-dom/server";
import { Buffer } from "buffer-polyfill";
globalThis.Buffer = Buffer as unknown as BufferConstructor;


export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {

  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)


  const html = await renderToString(
    <ServerStyleContext.Provider value={null}>
    <CacheProvider value={cache}>
    <RemixServer context={remixContext} url={request.url} />      
    </CacheProvider>
    </ServerStyleContext.Provider>
  );

  //if (isbot(request.headers.get("user-agent"))) {
    //await body.allReady;
  //}
  const chunks = extractCriticalToChunks(html)
  const markup = renderToReadableStream(
    <ServerStyleContext.Provider value={chunks.styles}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  )


  responseHeaders.set("Content-Type", "text/html");
  return new Response(`<!DOCTYPE html>${markup}`, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}