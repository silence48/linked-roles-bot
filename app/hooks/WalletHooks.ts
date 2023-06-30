// useWalletClient.ts
import { useState, useEffect } from 'react';
import { WalletClient } from "~/utils/WalletClient.client";
import type { Provider, Network, WalletStatus, WalletView } from "~/types";
import { useFetcher } from "@remix-run/react";




export const useInitClient = (network: Network, setViewOrStatus: (value: WalletView) => void, providerProp: Provider | null = null, publicKeyProp: string | null = null, ) => {
  const [provider, setProvider] = useState<Provider | null>(providerProp);
  const [client, setClient] = useState<any | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(publicKeyProp);
  
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
              setViewOrStatus("challenge");
              setPublicKey(publicKey);
            }
          });
        });
      } else {
        wc.getPublicKey().then(async ({ publicKey, code, message }: any) => {
          if (code === 200) {
            setViewOrStatus("challenge");
            setPublicKey(publicKey);
          }
        });
      }
    };
  
    return { provider, client, publicKey, url, initClient, setClient }; // return setClient here
  };
/*
export const useChallenge = (publicKey) => {
  const fetcher = useFetcher();
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    if (publicKey !== null && fetcher.state === "idle" && fetcher.data == null) {
      fetcher.load(`/challenge/${publicKey}`).then((data) => {
        setChallenge(data.challenge);
      });
    }
  }, [fetcher, publicKey]);

  return challenge;
};*/
export const useChallenge = (publicKey) => {
  const fetcher = useFetcher();
  const [challenge, setChallenge] = useState(null);
  const [lastFetchedKey, setLastFetchedKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      if (publicKey !== null && fetcher.state === "idle" && fetcher.data == null) {
        const response = await fetcher.load(`/challenge/${publicKey}`);
        setChallenge(response.challenge);
        setLastFetchedKey(publicKey);
      }
    };
    fetchChallenge();
  }, [fetcher, publicKey]);

  return challenge;
};


export const useChallengeLoader = (publicKey: string | null) => {
    const fetcher = useFetcher();
    const [lastFetchedKey, setLastFetchedKey] = useState<string | null>(null);

    useEffect(() => {
      if (publicKey !== null && publicKey !== lastFetchedKey) {
        fetcher.load(`/challenge/${publicKey}`);
        setLastFetchedKey(publicKey);
      }
    }, [fetcher, publicKey, lastFetchedKey]);
  };

/*
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
    setClient(wc); // Set the client state immediately
  
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
*/