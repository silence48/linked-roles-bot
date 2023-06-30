import {json, type LoaderArgs } from '@remix-run/cloudflare';

import { AccountBuilder } from 'linked-roles-core';

import { getUser } from '~/utils/session.server';

export const loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage, env } = context as any;
  const { DB, STELLAR_NETWORK } = env;
  let useracct =await getUser(request, sessionStorage)
  const { account, provider, discord_user_id } = (useracct) ?? {};
  console.log('account in settings', account, provider, discord_user_id)
  console.log('discord_user_id', discord_user_id, DB);
  const { data } = (await AccountBuilder.find({ discord_user_id, DB })) ?? {};
  return json({ account, provider, data, network: STELLAR_NETWORK });
};
