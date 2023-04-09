import React from "react";
import {
  RadioGroup,
  Button,
  Loader,
  Layout,
  Icon,
} from "communi-design-system";
import { isConnected } from "@stellar/freighter-api";
import { useFetcher } from "@remix-run/react";
import { WalletClient } from "~/utils/WalletClient.client";
import { SignClient } from "@walletconnect/sign-client";
import { isBrowser } from "~/utils/misc.client";
import { QRCode } from "react-qrcode-logo";
import { useModal } from "~/context";

enum WalletConnectChains {
  PUBLIC = "stellar:pubnet",
  TESTNET = "stellar:testnet",
}

enum WalletConnectMethods {
  SIGN = "stellar_signXDR",
  SIGN_AND_SUBMIT = "stellar_signAndSubmitXDR",
}

const WalletConnect = ({ connectWallet, openModal }: any) => {
  const [url, setUrl] = React.useState("");
  React.useEffect(() => {
    if (isBrowser) {
      SignClient.init({
        projectId: "de5dffb20a999465a31bef12a0defd9b",
        metadata: {
          name: "CommuuniDAO",
          url: "my-auth-dapp.com",
          description: "CommuniDAO is the Stellar Dao Discord Bot",
          icons: ["https://cdn.discordapp.com/attachments/1094354605401460896/1094354605887996104/StellarDiscordDaoBot.png"],
        },
      }).then(async (client: any) => {
        const { uri, approval } = await client.connect({
          requiredNamespaces: {
            stellar: {
              methods: [WalletConnectMethods.SIGN],
              chains: [WalletConnectChains.TESTNET],
              events: [],
            },
          },
        });
        if (uri) setUrl(uri);
        approval()
          .then(async (session: any) => {
            const allNamespaceAccounts = Object.values(session.namespaces)
              .map((namespace: any) => namespace.accounts)
              .flat();
            const allNamespaceChains = Object.keys(session.namespaces);
            const publicKey = allNamespaceAccounts[0].replace(
              "stellar:pubnet:",
              ""
            );
            await connectWallet({
              public_key: publicKey,
              provider: "wallet_connect",
            });
          })
          .catch((error: any) => {
            console.log("APPROVAL ERROR", error);
          });
      });
    }
  }, []);

  return !url ? (
    <Loader />
  ) : (
        <div>
          <QRCode
            value={url}
            logoImage="https://imagedelivery.net/uDbEDRBQqhBXrrfuCRrATQ/eee714c7-b85b-42cf-23f7-d986b99c1b00/public"
            logoHeight={48}
            logoWidth={48}
            eyeRadius={8}
            size={256}
            bgColor="#C8D1E6"
            fgColor="#03050B"
            removeQrCodeBehindLogo={true}
            qrStyle="dots"
          />
        </div>
  );
};

const Albedo = ({ connectWallet, openModal }: any) => {
  const wc = new WalletClient("albedo", "TESTNET");
  wc.getPublicKey().then(async (account: any) => {
    await connectWallet({ public_key: account.pubkey, provider: "albedo" });
  });
  return <Loader />;
};

const Freighter = ({ connectWallet, openModal }: any) => {
  React.useEffect(() => {
    if (isConnected()) {
      const wc = new WalletClient("freighter", "TESTNET");
      wc.getPublicKey().then(async (value: any) => {
        const public_key = await value();
        
        console.log('public_key', public_key)
        openModal({ type: 'challenge', content: public_key})
        // await connectWallet({ public_key, provider: 'freighter' })
      });
    }
  }, []);
  return <Loader />;
};

const Rabet = ({ connectWalle, openModal }: any) => {
  const wc = new WalletClient("rabet", "TESTNET");
  wc.getPublicKey().then(
    async ({ publicKey }: any) => {

      // await connectWallet({ public_key: publicKey, provider: "rabet" })

    }
  );
  return <Loader />;
};

const options = [
  {
    name: "Albedo",
    icon: "albedo",
  },
  {
    name: "Rabet",
    icon: "rabet",
  },
  {
    name: "Freighter",
    icon: "freighter",
  },
];

type ImportAccountProps = {};

const walletAssert = (view: any, connectWallet: any, openModal: any) => {
  switch (view) {
    case "Rabet":
      return <Rabet connectWallet={connectWallet} openModal={openModal} />;
    case "Freighter":
      return <Freighter connectWallet={connectWallet} openModal={openModal}  />;
    case "Albedo":
      return <Albedo connectWallet={connectWallet} openModal={openModal}  />;
    case "Wallet Connect":
      return <WalletConnect connectWallet={connectWallet} />;
    default:
      return <></>;
  }
};

// Move to DS Headings.
const IconHeading = ({ text, icon }: any) => {
  return (
    <div className="flex flex-row">
      <Icon name={icon} size="large" />
      <div className="text-h3-small-bold" style={{ paddingLeft: "12px" }}>
        {text}
      </div>
    </div>
  );
};

export const ImportAccount: React.FC<ImportAccountProps> = ({}) => {
  const [view, setView] = React.useState("");
  const [selected, Select] = React.useState(options[0]);
  const [payload, setPayload] = React.useState({
    public_key: "",
    provider: "",
  });
  const fetcher = useFetcher();
  const { closeModal, openModal } = useModal();

  React.useEffect(() => {
    const { public_key, provider } = payload;
    if (public_key && fetcher.type === "init") {
      fetcher.submit(
        { public_key, provider },
        { method: "post", action: "/auth_wallet" }
      );
    }
    if (fetcher.type === "done") {
      console.log("closing window ...", fetcher.data);
      // closeModal();
    }
  }, [payload.public_key, fetcher]);

  const button = {
    text: `${view === "" ? `Continue with ${selected.name}` : "Cancel"}`,
    variant: `${view === "" ? "primary" : "warning"}`,
  };

  return (
    <div>
      <div
        style={{
          backgroundImage:
            "url('https://imagedelivery.net/uDbEDRBQqhBXrrfuCRrATQ/cb3fca94-6358-47a3-6150-a10d0d7e1100/public')",
          backgroundSize: "cover",
          height: "100vh",
          width: "100%",
        }}
      >
        <Layout variant="large">
          <div className="flex items-center h-screen">
            <div className="bg-neutral-300 rounded-[20px] p-[40px] w-full ">
              <div className="flex flex-col">
                <div className="flex flex-row w-full">
                  <div className="flex-1">
                    <IconHeading text="Wallet Connect" icon="walletConnect" />
                    <div className="text-paragraph-medium-medium ">
                      Scan the QR with your phone from a wallet app
                      ** WALLET CONNECT IS STILL BEING DEBUGGED USE A DIFFERENT WALLET**
                    </div>
                    <div className="flex flex-col items-center my-8" style={{height: '300px'}}>
                      <WalletConnect connectWallet={setPayload} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <IconHeading text="Extensions" icon="extensions" />
                    <div className="text-paragraph-medium-medium ">
                      Other login options to login from your browser
                    </div>
                    <div >
                    <div className="flex flex-col space-y-4">
                      {view === "" ? (
                        <>
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
                        </>
                      ) : (
                        walletAssert(view, setPayload, openModal)
                      )}
                    </div>  
                    </div>
                    
                  </div>
                </div>
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
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
};
