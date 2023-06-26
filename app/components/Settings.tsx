import  * as React from 'react';
import { useFetcher  } from "@remix-run/react";
import {Layout, Button } from '~/components';
import { useModal } from '~/context'
import { ModalTypeE } from '~/context/Modal'

export const Settings = () => {
    const fetcher = useFetcher();
  const { openModal } = useModal();
  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      console.log("FETCHING")
      fetcher.load(`/settings`);
    }
  }, [fetcher]);

  const { account, provider, data, network } = fetcher.data ?? {}

  return (
    <Layout customCss="bg-neutral-600 p-[40px] rounded-md">
      <div>Settings</div>
      Main account:
      <div className="w-[500px] truncate">{account}</div>
      <Button onClick={() => openModal({ type: ModalTypeE.ADD_ACCOUNT, content: network })} text="Add Account" />
      {data && data.accounts.map((acc: any, key: string) => {
        return (
          <div key={key} className="flex flex-row">
            <div className="w-[500px] truncate">{acc.public_key}</div>
            {acc.public_key !== account && (
              <Button
                size="tiny"
                text="Remove"
                onClick={() => openModal({ type: ModalTypeE.REMOVE_ACCOUNT, content: acc.public_key })}
              />
            )}
          </div>
        );
      })}
    </Layout>
  );
}