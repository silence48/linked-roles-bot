/* eslint-disable no-dupe-keys */
import React from 'react';
import type { LoaderFunction, LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher } from '@remix-run/react';
import { parse } from "cookie";


export interface Env {
  DB: D1Database;
}

export const loader: LoaderFunction = async ({
  context,
  request,
  params,
}: LoaderArgs) => {

  try {
    // 1. Uses the code and state to acquire Discord OAuth2 tokens
    // const { sessionStorage } = context as any;
    // const { DB } = context.env as any;
    const cookies = request.headers.get("Cookie"); //the random id set on the first call to roles_link
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const discordState = url.searchParams.get("state");

    if (!cookies || !code || !discordState) return { message: 'State or Cookies are not set correctly'};

    const cookieHeader = parse(cookies);
    // make sure the state parameter exists
    const { clientState } = cookieHeader;

    if (clientState !== discordState) {
      let errmsg = JSON.stringify("State verification failed.");
      return new Response(errmsg, {
        status: 403,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    }

    return { code, clientState }
  } catch (e) {
    console.log(e);
    return { message: 'Something went wrong'};
  }
};


type CallbackProps = {};

export const Callback: React.FC<CallbackProps> = ({}) => {
  const { message, code, clientState } = useLoaderData() ?? {}
  const fetcher = useFetcher()

  React.useEffect(() => {
    if (code && fetcher.data === undefined && fetcher.state === "idle") {
      fetcher.submit(
        { code, clientState },
        { method: 'post', action: '/auth/discord/check' }
      );
    } else if (fetcher.data && fetcher.state === "idle") {
      window.location.replace("/");
    }
    console.log("fetcher", fetcher)
  }, [code, clientState, fetcher])

  return (
    <>
      {message}
    </>
  );
};

export default Callback;