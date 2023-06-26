import {json, type LoaderArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { Layout } from '~/components/Layout';
import { AccountBuilder } from 'linked-roles-core';
import { useModal } from '~/context/Modal';
import { Button } from '~/components/Button';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage, env } = context as any;
  const { DB, STELLAR_NETWORK } = env;
  const { account, provider, discord_user_id } = (await getUser(request, sessionStorage)) ?? {};
  console.log('discord_user_id', discord_user_id, DB);
  const { data } = (await AccountBuilder.find({ discord_user_id, DB })) ?? {};
  return json({ account, provider, data, network: STELLAR_NETWORK });
};
