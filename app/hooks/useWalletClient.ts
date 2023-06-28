// useWalletClient.ts
import { useState, useEffect } from 'react';
import { WalletClient } from "~/utils/WalletClient.client";
import type { Provider, Network } from "~/types";
import { useFetcher } from "@remix-run/react";

export const useWalletClient = (providerProp: Provider | null, network: Network) => {
  const [provider, setProvider] = useState<Provider | null>(providerProp ? providerProp : null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [client, setClient] = useState<any | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const fetcher = useFetcher();

  const initClient = async (provider: Provider): Promise<{ publicKey: string, status: string }> => {
    if (provider === null) throw new Error("Provider is null");
    setProvider(provider);

    const wc = new WalletClient(provider, network);
    setClient(wc);
    if (provider === "wallet_connect") {
      const { uri } = await wc.initWalletConnect();
      setUrl(uri);
      const { publicKey, code, message } = await wc.getPublicKey();
      if (code !== 200) throw new Error(message);
      return { publicKey, status: "challenge" };
    } else {
      const { publicKey, code, message } = await wc.getPublicKey();
      if (code !== 200) throw new Error(message);
      return { publicKey, status: "challenge" };
    }
  };


  const signTransaction = async (xdr, submit = false) => {
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
 
  return {
    provider,
    publicKey,
    client,
    url,
    initClient,
    signTransaction,
    signChallenge,
  };
};