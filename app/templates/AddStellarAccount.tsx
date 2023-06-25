import * as React from "react";
import { WalletClient } from "~/utils/WalletClient.client";
import { Loader, IconHeading, QRCode, Challenge, Button } from "~/components";
import { isBrowser } from "~/utils/misc.client";
import { useFetcher } from "@remix-run/react";
import { type IconKeys } from "~/components/Icon";
import type { Provider } from "~/types";

const WalletConnect = ({ initClient, url }: any) => {
  React.useEffect(() => {
    if (isBrowser) {
      initClient("wallet_connect");
    }
  }, []);


  return !url ? (
    <Loader />
  ) : (
    <div className="flex flex-col">
      <div className="mb-[20px]">
        <IconHeading text="Wallet Connect" icon="WalletConnect" />
        <div className="text-p3-medium">
          Connect using a compatible Wallet Connect app on your phone and scan the QR code.
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

const Albedo = ({ initClient }: any) => {
  React.useEffect(() => {
    initClient("albedo");
  }, []);
  return <Loader />;
};

const Freighter = ({ initClient }: any) => {
  React.useEffect(() => {
    initClient("freighter");
  }, []);
  return <Loader />;
};

const Rabet = ({ initClient }: any) => {
  React.useEffect(() => {
    initClient("rabet");
  }, []);
  return <Loader />;
};

const XBull = ({ initClient }: any) => {
  React.useEffect(() => {
    initClient("x_bull");
  }, []);
  return <Loader />;
}

const options: { name: string; icon: IconKeys }[] = [
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
    name: 'X-Bull',
    icon: 'X_bull'
  },
  {
    name: "Wallet Connect",
    icon: "WalletConnect",
  },
];

type ImportAccountProps = { network: 'TESTNET' | 'PUBLIC' };
//type Provider = "albedo" | "rabet" | "freighter" | "x_bull" | "wallet_connect";
type Client = any | null;

const ImportAccount: React.FC<ImportAccountProps> = ({ network }) => {
  const [publicKey, setPublicKey] = React.useState<string | null>(null);
  const [provider, setProvider] = React.useState<Provider>(null);
  const [view, setView] = React.useState("");
  const [client, setClient] = React.useState<Client>(null);
  const [url, setUrl] = React.useState<string | null>(null);

  const fetcher = useFetcher();
  const payload = useFetcher();

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
            setView("challenge");
            setPublicKey(publicKey);
          }
        });
      });
    } else {
      wc.getPublicKey().then(async ({ publicKey, code, message }: any) => {
        if (code === 200) {
          setView("challenge");
          setPublicKey(publicKey);
        }
      });
    }
  };

  const signChallenge = async (xdr: string) => {
    const { signed_envelope_xdr } = await client.signTransaction(xdr, false);
    if (
      !!signed_envelope_xdr &&
      payload.state === "idle" &&
      payload.data == null
    ) {
      payload.submit(
        { signed_envelope_xdr },
        { method: "post", action: `/challenge/verify?provider=${provider}&addAccount=true` }
      );
    }
  };

  const walletAssert = (view: any) => {
    switch (view) {
      case "Rabet":
        return <Rabet initClient={initClient} />;
      case "Freighter":
        return <Freighter initClient={initClient} />;
      case "Albedo":
        return <Albedo initClient={initClient} />;
      case "X-Bull":
        return <XBull initClient={initClient} />;
      case "Wallet Connect":
        return <WalletConnect url={url} initClient={initClient} />;
      default:
        return <></>;
    }
  };

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
                  {options.map((item, key) => {
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

export const AddStellarAccount = ({ network }: any) => {
  return (<ImportAccount network={network} />);
};
