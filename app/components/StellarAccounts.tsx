import React from "react";
import { useWallet, Challenge } from "~/context/Wallet";
import { WalletClient } from "~/utils/WalletClient.client";
import { QRCode } from '~/components/QRCode';
import { useEffect, useState, useContext } from "react";
import { ImportAccount } from '~/context/Wallet';
import { Icon, type IconKeys } from '~/components/Icon';
import { FiTrash2 } from "react-icons/fi";


type Provider = "albedo" | "rabet" | "freighter" | "wallet_connect";

const ConnectWalletButton = ({ provider, setSelectedProvider, iconname }: { provider: Provider, setSelectedProvider: Function, iconname: IconKeys }) => {
    const { initClient } = useWallet();

    const handleClick = () => {
        initClient(provider);
        setSelectedProvider(provider);
    };

    return (
        <div className="w-1/2 px-2">
        <button 
            className="w-full h-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex flex-col m-auto" 
            onClick={handleClick}
        >
            <Icon name={iconname} size="xlarge" />
            <span className="text-xs text-center">{provider}</span>
        </button>
    </div>);
};

const WalletConnect = ({  }) => {
    const [url, setUrl] = useState(null);
    const { initClient } = useWallet();

    useEffect(() => {
            const fetchWalletConnectUrl = async () => {
                const walletClient = new WalletClient("wallet_connect", "PUBLIC");
                const { uri } = await walletClient.initWalletConnect();
                setUrl(uri);
            };

            fetchWalletConnectUrl();
    }, []);

    return url ? <><QRCode
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
        qrStyle="dots" />
        <p>{url}</p>
    </> : null;
};

type StellarAccountsProps = {
    uAccounts: any;
  };

export const AccountsContainer: React.FC<any>  = ({uAccounts}) =>{
    const [hover, setHover] = useState(false);
if (uAccounts === null || uAccounts === undefined || uAccounts.length === 0) {
    return
} 
    return(
  <div>
    <h1>Linked Accounts:</h1>
    {uAccounts.map((account) => (
      <div className="flex justify-between items-center p-1 mb-2 border-red-500 rounded-md drop-shadow-md" key={account.id}>
        <p className="break-all flex-shrink">{account.public_key}</p>
        <form method="post" action="/delink">
          <input
            type="hidden"
            name="publicKey"
            value={account.public_key}
          />
          <button className="btn btn-square btn-outline btn-error" type="submit"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          >

            <FiTrash2 
            
            style={{ color: hover ? 'red' : 'initial' }}
          
            /> 
          </button>
        </form>
      </div>
    ))}
  </div>
    )
    
  }
  
  export const StellarAccounts: React.FC<StellarAccountsProps> = ({uAccounts}) => {
    const { publicKey } = useWallet();
    const [selectedProvider, setSelectedProvider] = useState(null);
    type WalletButton = {
        iconname: IconKeys;
        provider: Provider;
      };
    const walletButtons: WalletButton[] = [
        { iconname: "Albedo", provider: "albedo" },
        { iconname: "Rabet", provider: "rabet" },
        { iconname: "Freighter", provider: "freighter" },
        { iconname: "WalletConnect", provider: "wallet_connect" },
    ];
    return (
        <div >
            <AccountsContainer uAccounts={uAccounts}/>
          <div className="flex justify-between items-center p-1 mb-2 border-red-500 rounded-md drop-shadow-md">
            {walletButtons.map(({ iconname, provider }) => (
                <ConnectWalletButton
                    key={provider}
                    iconname={iconname}
                    provider={provider}
                    setSelectedProvider={setSelectedProvider}
                />
            ))}
            </div>
            {selectedProvider === "wallet_connect" && <WalletConnect />}
            {publicKey && (
                <>
                    <p>Public Key: {publicKey}</p>
                    <ImportAccount />
                </>
            )}
        </div>
    );
}