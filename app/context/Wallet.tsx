import React, { type ReactElement, type FunctionComponent } from "react";
import { WalletClient } from "~/utils/WalletClient.client";
import { Button, Loader, Icon, Modal, QRCode } from '~/components';
import { useTheme } from "./Theme";
import { useFetcher } from "@remix-run/react";

import { isBrowser } from "~/utils/misc.client";

type Status = "connected" | "disconnected" | "challenge";
export type WalletProviderProps = {
  children: ReactElement;
  walletAuthed: boolean;
  provider: Provider;
  publicKey: string;
  network: "PUBLIC" | "TESTNET";
};
type Provider = "albedo" | "rabet" | "freighter" | "wallet_connect";
type Client = any | null;

export type WalletContextType = {
  provider: Provider | null;
  url: string | null;
  publicKey: string | null;
  status: Status;
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
  const { theme } = useTheme();
  const [provider, setProvider] = React.useState<Provider | null>(
    providerProp ? providerProp : null
  );
  const [status, setStatus] = React.useState<Status>(
    walletAuthed ? "connected" : "disconnected"
  );
  const [publicKey, setPublicKey] = React.useState<string | null>(
    publicKeyProp ? publicKeyProp : null
  );
  const [client, setClient] = React.useState<Client>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [url, setUrl] = React.useState<string | null>(null);
  const fetcher = useFetcher();

  const closeModal = () => {
    setIsOpen(false);
  };

  const initClient = (provider: Provider) => {
    if (provider === null) return;
    setProvider(provider);

    const wc = new WalletClient(provider, network);
    setClient(wc);
    if (provider === "wallet_connect") {
      wc.initWalletConnect().then(({ uri }: any) => {
        setUrl(uri);
        wc.getPublicKey().then(async ({ publicKey, code, message }: any) => {
          if (code === 200) {
            setStatus("challenge");
            setPublicKey(publicKey);
          }
        });
      });
    } else {
      wc.getPublicKey().then(async ({ publicKey, code, message }: any) => {
        if (code === 200) {
          setStatus("challenge");
          setPublicKey(publicKey);
        }
      });
    }
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

const WalletConnect = ({}: any) => {
  const { initClient, url } = useWallet();

  React.useEffect(() => {
    if (isBrowser) {
      initClient("wallet_connect");
    }
  }, []);

  React.useEffect(() => {
    console.log("URL", url);
  }, [url]);

  return !url ? (
    <Loader />
  ) : (
    <div className="flex flex-col">
      <div className="mb-[20px]">
        <IconHeading text="Wallet Connect" icon="WalletConnect" />
        <div className="text-p3-medium">
          Connect using the Lobster app on your phone and scan the QR code.
        </div>
      </div>
      <div className="flex justify-center">
        <QRCode
          value={url}
          logoImage="https://imagedelivery.net/uDbEDRBQqhBXrrfuCRrATQ/eee714c7-b85b-42cf-23f7-d986b99c1b00/public"
          logoHeight={48}
          logoWidth={48}
          eyeRadius={8}
          size={256}
          bgColor="#C8D1E6"
          fgColor="#03050B"
          eyeColor="#03050B"
          removeQrCodeBehindLogo={true}
          qrStyle="dots"
        />
      </div>
    </div>
  );
};

const Albedo = ({}: any) => {
  const { initClient } = useWallet();
  React.useEffect(() => {
    initClient("albedo");
  }, []);
  return <Loader />;
};

const Freighter = ({}: any) => {
  const { initClient } = useWallet();
  React.useEffect(() => {
    initClient("freighter");
  }, []);
  return <Loader />;
};

const Rabet = ({}: any) => {
  const { initClient } = useWallet();
  React.useEffect(() => {
    initClient("rabet");
  }, []);
  return <Loader />;
};

const options = [
  {
    name: "Albedo",
    icon: "Albedo",
  },
  {
    name: "Rabet",
    icon: "Rabet",
  },
  {
    name: "Freighter",
    icon: "Freighter",
  },
  {
    name: "Wallet Connect",
    icon: "WalletConnect",
  },
];

type ImportAccountProps = {};

const walletAssert = (view: any) => {
  switch (view) {
    case "Rabet":
      return <Rabet />;
    case "Freighter":
      return <Freighter />;
    case "Albedo":
      return <Albedo />;
    case "Wallet Connect":
      return <WalletConnect />;
    default:
      return <></>;
  }
};

// Move to DS Headings.
const IconHeading = ({ text, icon }: any) => {
  return (
    <div className="flex flex-row">
      <Icon name={icon} size="large" />
      <div className="text-h4-bold">{text}</div>
    </div>
  );
};

export const Challenge: React.FC<{
  signChallenge: (xdr: string) => void;
  challenge: string | null;
  publicKey: string | null;
  provider: string | null;
}> = ({ signChallenge, challenge, publicKey, provider }) => {
  return (
    <>
      <div className="text-h3-semi-bold">Challenge</div>
      <div className="text-p3-medium">
        Complete the following challenge to finish your authentification.
      </div>
      <div className="text-p2-medium">Public Key</div>
      <div
        className="text-caption-bold truncate text-neutral-700 bg-neutral-400 rounded-md"
        style={{ padding: "20px", marginTop: "8px" }}
      >
        <p className="truncate">{publicKey}</p>
      </div>
      <div className="text-p2-medium">Challenge XDR</div>
      <div
        className="text-caption-bold truncate text-neutral-700 bg-neutral-400 rounded-md"
        style={{ padding: "20px", marginTop: "8px" }}
      >
        <p className="truncate">{challenge}</p>
      </div>
      <div className="mt-[20px]">
        {challenge && (
          <Button
            customCss="w-full"
            icon={provider?.charAt(0).toUpperCase() + provider?.slice(1)}
            text="Sign Challenge"
            onClick={() => signChallenge(challenge)}
          />
        )}
      </div>
    </>
  );
};

const Footer: React.FC = ({}) => {
  return (
    <div>
      <div className="text-caption-medium text-center">
        <span>By continuing you accept our </span>
        <span className="text-caption-underlined text-primary-700">
          term of conditioons
        </span>
        <span> and our </span>
        <span className="text-caption-underlined text-primary-700">
          privacy policy
        </span>
      </div>
    </div>
  );
};



export const ImportAccount: React.FC<ImportAccountProps> = ({}) => {
  const { publicKey, signChallenge, status, provider } = useWallet();
  const [view, setView] = React.useState("");
  const fetcher = useFetcher();
  const [lastFetchedKey, setLastFetchedKey] = React.useState<string | null>(null);

  React.useEffect(() => {
   /* if (
      publicKey !== null 
      && fetcher.state === "idle" 
      && fetcher.data == null
    ) {
      fetcher.load(`/challenge/${publicKey}`);
    }
  }, [fetcher, publicKey]);*/
  if (publicKey !== null && publicKey !== lastFetchedKey && fetcher.state === "idle") {
    fetcher.load(`/challenge/${publicKey}`);
    setLastFetchedKey(publicKey);
  }
}, [fetcher, publicKey, lastFetchedKey]);
  const { challenge } = fetcher.data ?? {};
  return (
    <div className="flex flex-col">
      <div className="flex flex-row w-full">
        <div className="flex-1 w-full">
          {status === "challenge" && (
            <Challenge
              signChallenge={signChallenge}
              challenge={challenge}
              publicKey={publicKey}
              provider={provider}
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
                  {options.map((item, key) => {
                    return (
                      <div key={key}>
                        <Button
                          customCss="btn btn-primary w-full"
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
              <Footer />
            </>
          )}
          {status === "disconnected" && view !== "" && (
            <div>
              <div>{walletAssert(view)}</div>
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
