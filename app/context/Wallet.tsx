import React, { type ReactElement, type FunctionComponent } from "react";
import { WalletClient } from "~/utils/WalletClient.client";
import { Button, Loader, Icon, Modal, QRCode } from "~/components";
import { useTheme } from "./Theme";
import { useFetcher } from "@remix-run/react";
import { Challenge } from "~/components/Challenge";
//import { type IconKeys } from "~/components/Icon";
import { IconHeading } from "~/components/IconHeading";
import type { Provider, Network, WalletViewOrStatus, WalletStatus } from "~/types";
import { useChallenge, useInitClient } from '~/hooks/WalletHooks';
import { walletOptions, WalletAssertWrapper } from "~/components/Wallets";

export type WalletProviderProps = {
  children: ReactElement;
  walletAuthed: boolean;
  provider: Provider;
  publicKey: string;
  network: Network;
};

type Client = any | null;

export type WalletContextType = {
  provider: Provider
  url: string | null;
  publicKey: string | null;
  status: WalletStatus;
  newSession: () => void;
  initClient: (provider: Provider) => void;
  signTransaction: (xdr: string, submit: boolean) => void;
  signChallenge: (xdr: string) => void;
};

export const WalletContext = React.createContext<WalletContextType>(
  {} as WalletContextType
);

export const WalletProvider: FunctionComponent<WalletProviderProps> = ({
  children,
  walletAuthed,
  publicKey: publicKeyProp,
  provider: providerProp,
  network,
}) => {
  const [status, setStatus] = React.useState<WalletStatus>(walletAuthed ? "connected" : "disconnected");
  const { provider, client, url, publicKey, initClient, setClient } = useInitClient(network, setStatus as (value: WalletViewOrStatus) => void, providerProp, publicKeyProp);
  
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const fetcher = useFetcher();

  const closeModal = () => {
    setIsOpen(false);
  };

  const restoreSession = async () => {
    if (provider === null) return;
    const wc = new WalletClient(provider, network);
    wc.restoreSession();
    setClient(wc);
  };

  const signTransaction = async (xdr: string, submit: boolean = false) => {
    return await client.signTransaction(xdr, submit);
  };

  const signChallenge = async (xdr: string) => {
    const { signed_envelope_xdr } = await client.signTransaction(xdr, false);
    if (
      !!signed_envelope_xdr &&
      fetcher.state === "idle" &&
      fetcher.data == null
    ) {
      fetcher.submit(
        { signed_envelope_xdr },
        { method: "post", action: `/challenge/verify?provider=${provider}` }
      );
    }
  };

  const newSession = () => {
    setIsOpen(true);
  };

  React.useEffect(() => {
    if (provider === "wallet_connect" && client === null) {
      restoreSession();
    }
  }, [provider, client]);

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data !== undefined) {
      const { body } = fetcher.data;
      const { account, provider } = body;
      if (account === publicKey && provider === provider) {
        setStatus("connected");
        setIsOpen(false);
      }
    }
  }, [fetcher]);

  return (
    <WalletContext.Provider
      value={{
        provider,
        newSession,
        initClient,
        url,
        status,
        publicKey,
        signChallenge,
        signTransaction,
      }}
    >
      {children}
      <Modal
        initialState={isOpen}
        closeModal={closeModal}
        theme={theme}
        padding="large"
        size="small"
        showBar={false}
        overflow={false}
      >
        <ImportAccount />
      </Modal>
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  return React.useContext(WalletContext);
};

type ImportAccountProps = {};

const ImportAccount: React.FC<ImportAccountProps> = ({}) => {
  const { publicKey, signChallenge, status } = useWallet();
  const [view, setView] = React.useState<WalletViewOrStatus | null>("");  
  /*
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (
      publicKey !== null &&
      fetcher.state === "idle" &&
      fetcher.data == null
    ) {
      fetcher.load(`/challenge/${publicKey}`);
    }
  }, [fetcher, publicKey]);

  const { challenge } = fetcher.data ?? {};
*/
  const challenge = useChallenge(publicKey)

  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full">
        <div className="flex-1 w-full">
          {status === "challenge" && ( //why was the && missing
            <Challenge
              signChallenge={signChallenge}
              challenge={challenge}
              publicKey={publicKey}
            />
          )}
          {status === "disconnected" && view === "" && (
            <>
              <IconHeading text="Wallets" icon="Extension" />
              <div className="text-p2-medium">
                Choose one of the following login options to continue.
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
          {status === "disconnected" && view !== "" && (
            <div>
              <div><WalletAssertWrapper view={view} /></div>
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
