import React, { useEffect } from 'react';
import { isBrowser } from "~/utils/misc.client";
import { Loader, IconHeading, QRCode } from "~/components";

export const WalletConnect = ({ initClient, url }) => {
  useEffect(() => {
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
};


export const WalletAssert = ({ view, initClient, url }) => {
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
        return null;
    }
  };
