import { type ActionArgs } from '@remix-run/cloudflare';
import { AccountBuilder } from '~/LRC/builders/AccountBuilder';
import { Discord} from '~/LRC/models/Discord';
import { User } from '~/LRC/models/User';

export async function action({ request, context, params }: ActionArgs) {
  const { createUserSession } = await import('~/utils/session.server');
  
  //const { Discord, User } = await import('linked-roles-core');
  
  const { env, sessionStorage } = context as any;
  const { DB } = env;
  const form = await request.formData();
  let code = form.get('code') as string;
  let clientState = form.get('clientState') as string;

  const discordTokens: any = await Discord.getOAuthTokens(code, context.env, request);
  // 2. Uses the Discord Access Token to fetch the user profile
  const discordData: any = await Discord.getUserData(discordTokens);
  const discord_user_id = discordData.user.id;
  // store the user data on the db
  const { access_token: discord_access_token, refresh_token: discord_refresh_token, expires_in } = discordTokens;
  const discord_expires_at = (Date.now() + expires_in * 1000).toString();
  const userExists = (await User.findBy('discord_user_id', discord_user_id, DB)).length;
  let user;
  // If user does not exist, create it
  if (!userExists) {
    user = await AccountBuilder.create({
      user: {
        discord_user_id,
        discord_access_token,
        discord_refresh_token,
        discord_expires_at
      },
      DB
    });
  } else {
    const account = await AccountBuilder.find({ discord_user_id, DB });
    account.updateDiscordCredentials({
      discord_access_token,
      discord_refresh_token,
      discord_expires_at
    });
    user = account.data.user;
  }

  return await createUserSession(
    sessionStorage,
    {
      id: user.id,
      discord_user_id,
      clientState,
      provider: null,
      account: null
    },
    { message: 'Session Created Successfuly' }
  );
}
