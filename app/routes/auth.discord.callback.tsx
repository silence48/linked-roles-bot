/* eslint-disable no-dupe-keys */
import type { LoaderFunction, LoaderArgs } from "@remix-run/cloudflare";
import { parse } from "cookie";
import { UserForm } from "~/forms";
import { Discord, User } from "~/models";
import { createUserSession } from "~/utils/session.server";

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
    const { sessionStorage } = context as any;
    const { DB } = context.env as any;
    console.log(DB, context.env)

    const cookies = request.headers.get("Cookie"); //the random id set on the first call to roles_link
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const discordState = url.searchParams.get("state");
    console.log(`auth.discord.callback - loaderfunction - ${code}, ${cookies}, ${discordState}`)
    if (!cookies || !code || !discordState) return null;
    console.log('it made it past line 27')
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

    const discordTokens: any = await Discord.getOAuthTokens(code, context.env);
    console.log(`auth.discord.callback - loaderfunction - discordTokens ${JSON.stringify(discordTokens)}`);
    // 2. Uses the Discord Access Token to fetch the user profile
    const discordData: any = await Discord.getUserData(discordTokens);
    const discord_user_id = discordData.user.id;
    // store the user data on the db
    const {
      access_token: discord_access_token,
      refresh_token: discord_refresh_token,
      expires_in,
    } = discordTokens;
    const userExists = (
      await User.findBy("discord_user_id", discord_user_id, DB)
    ).length;
    console.log(userExists)
    
    // // If user does not exist, create it
    if (!userExists) {
      const userForm = new UserForm(
        new User({
          discord_user_id,
          discord_access_token,
          discord_refresh_token,
          discord_expires_at: (
            Date.now() +
            discordTokens.expires_in * 1000
          ).toString(),
        })
      );
      console.log(userForm)
      console.log(await User.create(userForm, DB));
      //if the user already exists is the else statement
    } else {
      const discord_expires_at = (Date.now() + expires_in * 1000).toString();
      
      const user = await User.findBy('discord_user_id', discord_user_id, DB)
      // Compare discord_expires_at / user.discord_expires_at
      //
      user[0].discord_access_token = discord_access_token;
      user[0].discord_refresh_token = discord_refresh_token;
      user[0].discord_expires_at = discord_expires_at;
      console.log(await User.update(user[0], DB));
    }

    return await createUserSession(
      sessionStorage,
      {
        isAuthed: false,
        discord_user_id,
        clientState
      },
      { redirectTo: "/" }
    );
  } catch (e) {
    console.log(e);
    return null;
  }
};
