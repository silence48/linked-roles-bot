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
/*
export default function Settings() {
  const { account, provider, data, network } = useLoaderData();
  const { openModal } = useModal();
  console.log('data', data);
  return (
    <Layout customCss="bg-neutral-600 p-[40px] rounded-md">
      <div>Settings</div>
      Main account:
      <div className="w-[500px] truncate">{account}</div>
      <Button onClick={() => openModal({ type: 'add_account', content: network })} text="Add Account" />
      {data.accounts.map((acc: any, key: string) => {
        return (
          <div key={key} className="flex flex-row">
            <div className="w-[500px] truncate">{acc.public_key}</div>
            {acc.public_key !== account && (
              <Button
                size="tiny"
                text="Remove"
                onClick={() => openModal({ type: 'remove_account', content: acc.public_key })}
              />
            )}
          </div>
        );
      })}
    </Layout>
  );
}
*/