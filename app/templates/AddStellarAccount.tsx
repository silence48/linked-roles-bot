
import * as React from "react";
import { IconHeading,  Challenge, Button } from "~/components";
import { useFetcher } from "@remix-run/react";
import type { Network, WalletViewOrStatus } from "~/types";
import { walletOptions, WalletAssert } from "~/components/Wallets";
import {ModalTypeE, useModal} from '~/context/Modal';
import { useInitClient } from '~/hooks/WalletHooks';

type ImportAccountProps = { network: Network };

const ImportAccount: React.FC<ImportAccountProps> = ({ network }) => {

  const { openModal } = useModal();
  const fetcher = useFetcher();
  const payload = useFetcher();
  const [lastFetchedKey, setLastFetchedKey] = React.useState<string | null>(null);

  const [view, setView] = React.useState<WalletViewOrStatus | null>("");
  const { provider, client, url, publicKey, initClient } = useInitClient(network, setView);

  const signChallenge = async (xdr: string) => {
    const { signed_envelope_xdr } = await client.signTransaction(xdr, false);
    if (
      !!signed_envelope_xdr &&
      payload.state === "idle" &&
      payload.data == null
    ) {
      payload.submit(
        { signed_envelope_xdr },
        { method: "post", action: `/challenge/verify?provider=${provider}` }
      );
    }
  };

  React.useEffect(() => {
    if (publicKey !== null && publicKey !== lastFetchedKey) {
      fetcher.load(`/challenge/${publicKey}`);
      setLastFetchedKey(publicKey);
    }
  }, [fetcher, publicKey]);

const { challenge } = fetcher.data ?? {};

React.useEffect(() => {
    if (payload.state === "idle" && payload.data) {
      openModal({ type: ModalTypeE.CONFIRMATION, size:"fit"})
    }
  }, [payload]);

 

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full">
        <div className="flex-1 w-full">
          {view === "challenge" && (
            <Challenge
              signChallenge={signChallenge}
              challenge={challenge}
              publicKey={publicKey}
            />
          )}
          {view === "" && (
            <>
              <IconHeading text="Add account" icon="Extension" />
              <div className="text-p2-medium">
                Choose one of the following apps to add another account.
              </div>
              <div className="my-8">
                <div className="flex flex-col space-y-4">
                  {walletOptions.map((item, key) => {
                    return (
                      <div key={key}>
                        <Button
                          customCss="w-full"
                          variant="basic"
                          icon={item.icon}
                          text={item.name}
                          onClick={() => setView(item.name)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {view !== "" && (
            <div>
              <div>
                <WalletAssert view={view} initClient={initClient} url={url}/>
                </div>
              <div>
                <Button
                  text="Cancel"
                  variant="basic"
                  customCss="w-full mt-[20px]"
                  onClick={() => setView("")}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AddStellarAccount = ({ network }: any) => {
  return (<ImportAccount network={network} />);
};