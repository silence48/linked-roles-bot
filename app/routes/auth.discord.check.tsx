import { UserForm } from "~/forms";
import { Discord, User } from "~/models";
import { createUserSession } from "~/utils/session.server";
import { type ActionArgs } from "@remix-run/cloudflare";

export async function action({ request, context, params }: ActionArgs) {
  const { env, sessionStorage } = context as any;
  const { DB } = env;
  const form = await request.formData();
  let code = form.get('code') as string;
  let clientState = form.get('clientState') as string
  
  const discordTokens: any = await Discord.getOAuthTokens(code, context.env);

  // 2. Uses the Discord Access Token to fetch the user profile
  const discordData: any = await Discord.getUserData(discordTokens);
  const discord_user_id = discordData.user.id;
  // store the user data on the db
  const {
    access_token: discord_access_token,
    refresh_token: discord_refresh_token,
    expires_in,
  } = discordTokens;
  const userExists = (await User.findBy("discord_user_id", discord_user_id, DB))
    .length;
  let user;
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
    user = await User.create(userForm, DB);
  } else {
    const discord_expires_at = (Date.now() + expires_in * 1000).toString();

    user = await User.findOne("discord_user_id", discord_user_id, DB);
    // Compare discord_expires_at / user.discord_expires_at
    // If discord_expires_at is greater than user.discord_expires_at, update the user
    user = await User.update({ ...user, discord_access_token, discord_refresh_token, discord_expires_at}, DB);
  }

  return await createUserSession(
    sessionStorage,
    {
      id: user.id,
      discord_user_id,
      clientState,
      provider: null,
      account: null,
    },
    { message: "Session Created Successfuly" }
  );
}
