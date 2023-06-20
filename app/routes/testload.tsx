import { Loader } from "~/components";
import React from "react";
import { useWallet, Challenge } from "~/context/Wallet";
import { WalletClient } from "~/utils/WalletClient.client";
import { QRCode } from '~/components/QRCode';
import { useEffect, useState, useContext } from "react";
import { ImportAccount } from '~/context/Wallet';
import { Icon, type IconKeys } from '~/components/Icon';

type Provider = "albedo" | "rabet" | "freighter" | "wallet_connect";

const ConnectWalletButton = ({ provider, setSelectedProvider, iconname }: { provider: Provider, setSelectedProvider: Function, iconname: IconKeys }) => {
    const { initClient } = useWallet();

    const handleClick = () => {
        initClient(provider);
        setSelectedProvider(provider);
    };

    return (
        <div>
            <button className="btn btn-primary px-8 py-4" onClick={handleClick}>
                <Icon name={iconname} />
                Connect {provider}
            </button>
        </div>);
};

const WalletConnect = () => {
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

export default function Index() {
    const { publicKey } = useWallet();
    const [selectedProvider, setSelectedProvider] = useState(null);

    return (
        <div>
            <ConnectWalletButton iconname="Albedo" provider="albedo" setSelectedProvider={setSelectedProvider} />
            <ConnectWalletButton iconname="Rabet" provider="rabet" setSelectedProvider={setSelectedProvider} />
            <ConnectWalletButton iconname="Freighter" provider="freighter" setSelectedProvider={setSelectedProvider} />
            <ConnectWalletButton iconname="WalletConnect" provider="wallet_connect" setSelectedProvider={setSelectedProvider} />
            {selectedProvider === "wallet_connect" && <WalletConnect />}
            {publicKey && <><p>Public Key: {publicKey}</p><ImportAccount></ImportAccount></>}
        </div>
    );
}