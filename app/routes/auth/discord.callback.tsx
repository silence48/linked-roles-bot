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
import { StellarWalletsKit, WalletNetwork, WalletType } from 'stellar-wallets-kit';

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
    let code = url.searchParams.get("code");
    // make sure the state parameter exists
    let discordState = url.searchParams.get("state");
    
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
    const discordTokens: any = await Discord.getOAuthTokens(code, context.env)

    // 2. Uses the Discord Access Token to fetch the user profile
    //let discord_user_id = '123456'
    const discordData: any = await Discord.getUserData(discordTokens);
    const discord_user_id = discordData.user.id;
    // store the user data on the db      
    //console.log(await User.findBy('discord_user_id', discord_user_id, DB))
    const userExists = (await User.findBy('discord_user_id', discord_user_id, DB)).length
    console.log('chk2')
    console.log(await User.findBy('discord_user_id', discord_user_id, DB))
    // // If user does not exist, create it
    if (!userExists) {
       const userForm = new UserForm(new User({
         discord_user_id,
         access_token: discordTokens.access_token,
         refresh_token: discordTokens.refresh_token,
         expires_at: (Date.now() + discordTokens.expires_in * 1000).toString()
       }))
       console.log(await User.create(userForm, DB))
      }else{
        const user = await User.findBy('discord_user_id', discord_user_id, DB)
        console.log(user, 'that was user')
        console.log(user[0].id)
        user[0].access_token = discordTokens.access_token;
        user[0].access_token = discordTokens.refresh_token;
        user[0].expires_at = (Date.now() + discordTokens.expires_in * 1000).toString();
        console.log(await User.update(user[0], DB))
      }
      // start the stellar OAuth2 flow by generating a new OAuth2 Url
      //todo: integrate a wallet!
      const stellaraccount = "GA7NSA7ELCFTVCBPMBBA77W442X6ZH4HHOYJHGAQEEN5FQB2GUUOFZEB"
      //secret for above is SADOTEVI7AMPGFAYUSNHTURERRC4J52M3IGIMVHLOKALU7JWW22GQUOE
      //for testing only
      const ChallengeURL = getChallengeURL(discord_user_id, stellaraccount, context, clientState)
      const init:RequestInit = {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "clientState": `${clientState}; Max-Age=300000`
        },
      };
      const challengetx = await fetch(url, init);
      const results = await gatherResponse(challengetx)
      console.log('the challenge transaction is', challengetx)
      //nowsignthechallengetx, and post to the auth endpoint to get the access and refresh tokens.
      //then store the tokens to the database.
    return null
       //return null
    
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
export default function discordcallback(){

  return (
    <main>
      Here is some text
    </main>
  );
}
/**
 * Generate a url which users will use to approve the current bot for access to
 * their Stellar account, along with the set of required scopes.
 */
export function getChallengeURL(discord_user_id, stellaraccount, context, state) {
  //const { codeVerifier, codeChallenge } = generateCodeVerifier();

  //const state = crypto.randomBytes(20).toString('hex');
  const url = new URL('http://127.0.0.1:8788/auth');
  url.searchParams.set('userid', discord_user_id);
  url.searchParams.set('account', stellaraccount);
  url.searchParams.set('redirect_uri', "http://127.0.0.1:8788");  //probably the user page
  //url.searchParams.set('code_challenge', codeChallenge);
  //url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('state', state);
  //url.searchParams.set('response_type', 'code');
  //url.searchParams.set(
//    'scope',
    //'user'
  //);
  url.searchParams.set('prompt', 'consent');
  return { state, url: url.toString() };
}

async function gatherResponse(response) {
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json());
  }
  return response.text();
}