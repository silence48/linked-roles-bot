import React from "react";
import { useFetcher } from "@remix-run/react";
import { WalletClient } from "~/utils/WalletClient.client";
import { Button } from "communi-design-system";

type ChallengeProps = {
  content: {
    public_key: string;
    provider: string
  }
};

export const Challenge: React.FC<ChallengeProps> = ({ content }) => {
  
  const { public_key, provider } = content as any;
  
  const fetcher = useFetcher();
  const payload = useFetcher();

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      console.log('Fetching Once')
      fetcher.load(`/challenge/${public_key}`);
    }
  }, [fetcher]);

  const signChallenge = async ({ challenge }: any) => {
    const wc = new WalletClient(provider, "TESTNET");
    const { signed_envelope_xdr }: any = await wc.signTransaction(
      challenge,
      false
    );
    if (!!signed_envelope_xdr && payload.type === "init") {
      payload.submit(
        { signed_envelope_xdr },
        { method: "post", action: `/challenge/verify?provider=${provider}` }
      );
    }
  };

  const { challenge } = fetcher.data ?? {};

  return (
    <>
      <div className="text-h3-normal-semi-bold">Challenge</div>
      <div className="text-paragraph-small-medium">Complete the following challenge to finish your authentification.</div>
      <div className="text-paragraph-medium-medium">Public Key</div>
      <div className="text-caption-bold truncate text-neutral-700 bg-neutral-400 rounded-md"
      style={{padding: '20px', marginTop: '8px'}}
      >{public_key}</div>
      {challenge && (
        <Button
          text="Sign"
          onClick={() => signChallenge({ challenge })}
          customCss="w-full mt-[40px]"
        />
      )}
    </>
  );
};
