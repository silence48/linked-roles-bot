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
import { renderToReadableStream } from "react-dom/server";
import { Buffer } from "buffer-polyfill";
globalThis.Buffer = Buffer as unknown as BufferConstructor;


export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {


  const body = await renderToReadableStream(
    <RemixServer context={remixContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  //if (isbot(request.headers.get("user-agent"))) {
    //await body.allReady;
  //}

  responseHeaders.set("Content-Type", "text/html");
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}