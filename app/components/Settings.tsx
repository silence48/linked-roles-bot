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
    console.log(fetcher.data)
    const { account, provider, data, network } = fetcher.data ?? {}

    return (
        <Layout customCss="bg-neutral-600 p-[40px] rounded-md">
            <div>Settings</div>
            {data && data.accounts.length > 1 && <div>Main account:</div>}
            <div className="w-[500px] truncate">{account}</div>
            <Button onClick={() => openModal({ type: ModalTypeE.ADD_ACCOUNT, content: network })} text="Add Account" />
            {data && data.accounts.map((acc: any, key: string) => {
                return (
                    <div key={key} className="flex flex-row">
                        <div className="w-[500px] truncate">{acc.public_key}</div>
                        {data.accounts.length > 1 && (
                            <Button
                                size="tiny"
                                text="Remove"
                                onClick={() => openModal({ type: ModalTypeE.REMOVE_ACCOUNT, content: acc.public_key })}
                            />
                        )}
                    </div>
                );
            })}
            {data && data.accounts.length === 1 && (
                <Button
                    size="tiny"
                    text="Delete Account"
                    onClick={() => openModal({ type: ModalTypeE.DELETE_ACCOUNT, content: account })}
                />
            )}
        </Layout>
    );
}