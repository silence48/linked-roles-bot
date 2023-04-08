import { redirect, type LoaderFunction } from "@remix-run/cloudflare";
import { Discord } from "~/models";
import { createUserSession } from "~/utils/session.server";

export let loader: LoaderFunction = async ({ request, context }) => {
  const discord = await Discord.getOAuthUrl(context.env);
  const { url, state } = discord;
  const { sessionStorage } = context as any;
  //await createUserSession(sessionStorage, {clientState: state });
  return redirect(url, {
    status: 301,
    headers: {
      "Set-Cookie": `clientState=${state}; Max-Age=300000`,
    },
  });
};
