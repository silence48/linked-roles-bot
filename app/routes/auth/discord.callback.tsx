import type { LinksFunction, LoaderFunction, LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import {
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";
import { parse } from 'cookie';
import { UserForm } from '~/forms';
import { Discord, User } from '~/models'

export const loader: LoaderFunction = async ({ context, request, params }: LoaderArgs) => {
    console.log('Hello')
    try {
    console.log('Hello0')
    const cookies = request.headers.get("Cookie")
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const discordState = url.searchParams.get("state");
    console.log('Checkpoint 1', cookies, code, discordState)

    // const { DB } = context.env as any
    if (!cookies || !code || !discordState) return null;
    console.log('Checkpoint')
    const cookieHeader = parse(cookies);
    // make sure the state parameter exists
    // const { clientState } = cookieHeader;
    console.log('cookieHeader', cookieHeader)
    // console.log('clientState !== discordState', clientState !== discordState)
    // if (clientState !== discordState) {
    // console.error('State verification failed.');
    // // return res.sendStatus(403);
    // }
    // const tokens: any = await Discord.getOAuthTokens(code, context.env);  
    // // 2. Uses the Discord Access Token to fetch the user profile
    // const meData: any = await Discord.getUserData(tokens);
    // const discord_user_id = meData.user.id;
    //     // store the user data on the db      
    // const userExists = (await User.findBy('discord_user_id', discord_user_id, DB)).length
    // // If user does not exist, create it
    // if (!userExists) {
    //   const userForm = new UserForm(new User({
    //     discord_user_id,
    //     access_token: tokens.access_token,
    //     refresh_token: tokens.refresh_token,
    //     expires_at: (Date.now() + tokens.expires_in * 1000).toString()
    //   }))
    //   await User.create(userForm, DB)
    // }
    // // TODO: if user exists, update the access token
    
    
    // // TODO: Redirect with UUID so we can associate the user with the wallet
    
    // // send the user to the Wallet login dialog screen
    // // return ctx.redirect(`/auth/wallet/${discord_user_id}`)
    //   return redirect(`/auth/wallet/${discord_user_id}`, {
    //       status: 200,
    //   });
      return null
    } catch (e) {
      return null
    }
}


