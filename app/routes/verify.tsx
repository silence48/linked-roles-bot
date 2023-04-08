import { redirect, type LoaderFunction } from "@remix-run/cloudflare";
import { Discord } from "~/models";

export let loader: LoaderFunction = async ({ request, context }) => {
  const discord = await Discord.getOAuthUrl(context.env);
  const { url, state } = discord;

  return redirect(url, {
    status: 301,
    headers: {
      "Set-Cookie": `clientState=${state}; Max-Age=300000; path=https://127.0.0.1/;}`,
    },
  });
};
