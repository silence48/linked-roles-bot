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
export interface Env {
  DB: D1Database;
}

export const loader: LoaderFunction = async ({ context, request, params }: LoaderArgs) => {
    console.log('Hello')
    
    try {
    console.log('Hello0')
    console.log('headers', request.headers)
    // 1. Uses the code and state to acquire Discord OAuth2 tokens
    const cookies = request.headers.get("Cookie") //the random id set on the first call to roles_link
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    // make sure the state parameter exists
    const discordState = url.searchParams.get("state");

    console.log('Checkpoint 1', cookies, code, discordState)

    const { DB } = context.env as any
    if (!cookies || !code || !discordState) return null;
    console.log('Checkpoint')
    const cookieHeader = parse(cookies);
    // make sure the state parameter exists
    const { clientState } = cookieHeader;
    console.log('cookieHeader', cookieHeader)
    console.log(clientState);
    let test = clientState !== discordState
    console.log('clientState !== discordState', test)
    if (clientState !== discordState) {
      let errmsg = JSON.stringify('State verification failed.')
      console.log(errmsg);
      return new Response(errmsg, {
        status: 403,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    }
    console.log(code)
    //const tokens: any = await Discord.getOAuthTokens(code, context.env)
    //console.log('the token was', tokens1)
    let tokens1 = {
      access_token: 'eIkjLYBDKhcFyk09iQWS8ALVGL6Pds',
      expires_in: 604800,
      refresh_token: 'ggxjD1vEVQqTETPH7YnNux13ak7aNj',
      scope: 'role_connections.write identify',
      token_type: 'Bearer'
    }
    // 2. Uses the Discord Access Token to fetch the user profile
    //let discord_user_id = '123456'
    const meData: any = await Discord.getUserData(tokens1);
    const discord_user_id = meData.user.id;
    // store the user data on the db      
    //console.log(await User.findBy('discord_user_id', discord_user_id, DB))
    const userExists = (await User.findBy('discord_user_id', discord_user_id, DB)).length
    console.log(await User.findBy('discord_user_id', discord_user_id, DB))
    // // If user does not exist, create it
    if (!userExists) {
       const userForm = new UserForm(new User({
         discord_user_id,
         access_token: tokens1.access_token,
         refresh_token: tokens1.refresh_token,
         expires_at: (Date.now() + tokens1.expires_in * 1000).toString()
       }))
       console.log(await User.create(userForm, DB))
      }else{
        const user = await User.findBy('discord_user_id', discord_user_id, DB)
        console.log(user, 'that was user')
        console.log(user[0].id)
        user[0].access_token = tokens1.access_token;
        user[0].access_token = tokens1.refresh_token;
        user[0].expires_at = (Date.now() + tokens1.expires_in * 1000).toString();
        console.log(await User.update(user[0], DB))
      }
      // start the stellar OAuth2 flow by generating a new OAuth2 Url
    //const { url, codeVerifier, state } = generateStellarAuthURL();

       return null
    
    // // TODO: Redirect with UUID so we can associate the user with the wallet
    
    // // send the user to the Wallet login dialog screen
    // // return ctx.redirect(`/auth/wallet/${discord_user_id}`)
    //   return redirect(`/auth/wallet/${discord_user_id}`, {
    //       status: 200,
    //   });
     
    } catch (e) {
      console.log(e)
      return null
    }
}


