import * as React from 'react';
import { Button } from '~/components/Button';

export const Challenge: React.FC<{
    signChallenge: (xdr: string) => void;
    challenge: string | null;
    publicKey: string | null;
  }> = ({ signChallenge, challenge, publicKey }) => {
    return (
      <>
        <div className="text-h3-semi-bold">Challenge</div>
        <div className="text-p3-medium">
          Complete the following challenge to finish your authentification.
        </div>
        <div className="text-p2-medium">Public Key</div>
        <div
          className="text-caption-bold truncate text-neutral-700 bg-neutral-400 rounded-md"
          style={{ padding: "20px", marginTop: "8px" }}
        >
          <p className="truncate">{publicKey}</p>
        </div>
        <div className="text-p2-medium">Challenge XDR</div>
        <div
          className="text-caption-bold truncate text-neutral-700 bg-neutral-400 rounded-md"
          style={{ padding: "20px", marginTop: "8px" }}
        >
          <p className="truncate">{challenge}</p>
        </div>
        <div className="mt-[20px]">
          {challenge && (
            <Button
              customCss="w-full"
              icon="WalletConnect"
              text="Sign Challenge"
              onClick={() => signChallenge(challenge)}
            />
          )}
        </div>
      </>
    );
  };