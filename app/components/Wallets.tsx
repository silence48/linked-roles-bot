import React, { useEffect } from 'react';
import { isBrowser } from "~/utils/misc.client";
import { Loader, IconHeading, QRCode, Button, Challenge } from "~/components";
import { useWallet } from '~/context/Wallet';
import { useFetcher } from "@remix-run/react";
import { type IconKeys } from "~/components/Icon";
import { useModal } from '~/context/Modal';
import { WalletView, WalletViewOrStatus } from '~/types';


export const WalletConnect = ({initClient, url}) => {
  //const { initClient, url } = useWallet();

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


// Albedo

export const Albedo = ({ initClient }) => {
  useEffect(() => {
    initClient("albedo");
  }, []);
  return <Loader />;
};

// Freighter
export const Freighter = ({ initClient }) => {
  useEffect(() => {
    initClient("freighter");
  }, []);
  return <Loader />;
};

// Rabet

export const Rabet = ({ initClient }) => {
  useEffect(() => {
    initClient("rabet");
  }, []);
  return <Loader />;
};


// XBull

export const XBull = ({ initClient }) => {
  useEffect(() => {
    initClient("x_bull");
  }, []);
  return <Loader />;
}


type WalletAssertProps = {
  view: WalletViewOrStatus | null;
  initClient?: any;
  url?: string | null;
};

export const WalletAssert: React.FC<WalletAssertProps> = ({ view, initClient, url }) => {
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

type WalletAssertWrapperProps = Omit<WalletAssertProps, 'initClient'>;

export const WalletAssertWrapper: React.FC<WalletAssertWrapperProps> = (props) => {
  const { initClient, url } = useWallet();
  return <WalletAssert {...props} initClient={initClient} url={url} />;
};


export const walletOptions: { name: WalletView; icon: IconKeys }[] = [
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
    name: "X-Bull",
    icon: "X_bull",
  },
  {
    name: "Wallet Connect",
    icon: "WalletConnect",
  },
];

