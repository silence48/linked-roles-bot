import { redirect, type LoaderFunction } from "@remix-run/cloudflare";
import { Discord } from "~/models";
import { createUserSession } from "~/utils/session.server";

export let loader: LoaderFunction = async ({ request, context }) => {
  const discord = await Discord.getOAuthUrl(context.env);
  const { url, state } = discord;

  return redirect(url, {    status: 301,
    headers: {
      "Set-Cookie": `clientState=${state}; Max-Age=300000`,
    },
  });
};
