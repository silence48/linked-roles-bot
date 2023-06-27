import { redirect, type LoaderFunction } from "@remix-run/cloudflare";

export let loader: LoaderFunction = async ({ request, context }) => {
  //const { createUserSession } = await import("~/utils/session.server");
  const { Discord } = await import("linked-roles-core");
  const discord = await Discord.getOAuthUrl(request, context.env);
  const { url, state } = discord;
  return redirect(url, {
    status: 301,
    headers: {
      "Set-Cookie": `clientState=${state}; Max-Age=300000`,
    },
  });
};
