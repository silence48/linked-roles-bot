import { redirect, type LoaderFunction } from '@remix-run/cloudflare';
// import { useLoaderData } from '@remix-run/react';


// roles.link === /roles/link
export let loader: LoaderFunction = async ({
    request,
    context,
  }) => {
    //const { Discord } = await import("linked-roles-core");
    const { Discord } = await import ('~/LRC/models/Discord');
    
    const discord = await Discord.getOAuthUrl(request, context.env);
    const { url, state } = discord
    return redirect(url, {
        status: 301,
        headers: {
          "Set-Cookie": `clientState=${state}; Max-Age=300000;}`,
        },
    });
  }
