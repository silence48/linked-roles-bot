import { redirect, type LoaderFunction } from '@remix-run/cloudflare';
// import { useLoaderData } from '@remix-run/react';


// roles.link === /roles/link
export let loader: LoaderFunction = async ({
    request,
    context,
  }) => {
    const { Discord } = await import("~/models");
    const discord = await Discord.getOAuthUrl(context.env);
    const { url, state } = discord
    return redirect(url, {
        status: 301,
        headers: {
          "Set-Cookie": `clientState=${state}; Max-Age=300000;}`,
        },
    });
  }
