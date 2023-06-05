import type { EntryContext } from "@remix-run/cloudflare";
// import { RemixServer } from "@remix-run/react";
//import { renderToString } from "react-dom/server";
import { Buffer } from "buffer-polyfill";

// Polyfill Buffer on the server
globalThis.Buffer = Buffer as unknown as BufferConstructor;
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
