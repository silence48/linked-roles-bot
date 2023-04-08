import React from "react";
import { useFetcher } from "@remix-run/react";
import { WalletClient } from "~/utils/WalletClient.client";
import { Button } from "communi-design-system";

type ChallengeProps = {
  public_key: string;
};

export const Challenge: React.FC<ChallengeProps> = ({ public_key }) => {
  const fetcher = useFetcher();
  const payload = useFetcher();

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      fetcher.load(`/challenge/${public_key}`);
    }
  }, [fetcher]);

  const signChallenge = async ({ challenge }: any) => {
    const wc = new WalletClient("freighter", "TESTNET");
    const { signed_envelope_xdr }: any = await wc.signTransaction(
      challenge,
      false
    );
    console.log("signed_envelope_xdr", signed_envelope_xdr);
    if (!!signed_envelope_xdr && payload.type === "init") {
      payload.submit(
        { signed_envelope_xdr },
        { method: "post", action: "/challenge/verify" }
      );
    }
  };

  const { challenge } = fetcher.data ?? {};

  return (
    <>
      {public_key}
      {challenge && (
        <Button
          text="Sign Challenge"
          onClick={() => signChallenge({ challenge })}
        />
      )}
    </>
  );
};
