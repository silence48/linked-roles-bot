import * as React from "react";
import { json, redirect, type LoaderArgs } from "@remix-run/cloudflare";
import { getUser } from "~/utils/session.server";
import { useModal } from "~/context";
import { Layout, Button } from "communi-design-system";
import { WalletClient } from "~/utils/WalletClient.client";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { checkRoles } from "~/utils/checkRoles.server";
import { verifyAndRenewAccess } from "~/utils/auth.server";
import { generateDefaultClaimTransaction } from "~/utils/stellarUtils.server";
import jwt from '@tsndr/cloudflare-worker-jwt';

export const loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const { authsigningkey } = context.env as any;
  const { isAuthed, isClaimed, provider, token: accesstoken } = (await getUser(request, sessionStorage)) ?? {}; //todo: error handling or make this more clear
  
  if (typeof isAuthed == 'undefined' || typeof accesstoken == 'undefined') {
    return redirect('/')
  }
  //todo: verifyAndRenewAccess, and make that update the users jwt when necessary.
  let validity = jwt.verify(accesstoken, authsigningkey);
  
  const { payload } = jwt.decode(accesstoken);
  
  const { discord_user_id } = payload;
  const public_key = payload.sub as string
  //todo:check if the user ever claimed the asset even if the balance is 0, as they can only claim once
  //todo: make it an authonly asset or make that an option in the asset creation.
  //todo: isClaimed should be in the d1 users object somewhere, or something like that.


  var isOwned = false
  let claim = ''
  var roles = await checkRoles(context, public_key, discord_user_id )
  if (roles?.defaultrole == 0 ) {
    claim = await generateDefaultClaimTransaction(context, public_key) ?? ''
  }
  return json({ xdr: claim, isClaimed, provider });

  // Redirect if user has Asset
};

export default function Claim() {
  const { closeModal, isOpen } = useModal();
  const { xdr, isClaimed, provider } = useLoaderData() ?? {};
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (isOpen) {
      closeModal();
    }
  }, []);

  const claimKey = async ({ xdr }: any) => {
    const wc = new WalletClient(provider, "TESTNET");
    const { horizonResult }: any = await wc.signTransaction(xdr, true);
    if (horizonResult.success) {
      if (fetcher.state === "idle" && fetcher.data == null) {
        fetcher.load(`/check_roles`);
      }
    }
    // CHECK ROLES AGAIN
    // IF OK, FETCH CHECK_ROLES.
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://imagedelivery.net/uDbEDRBQqhBXrrfuCRrATQ/e0856cde-8302-4027-7718-a4322ab33b00/public')",
        backgroundSize: "cover",
        height: "100vh",
        width: "100%",
      }}
    >
      <Layout>
        <div className="flex items-center h-screen">
          <div
            className="bg-neutral-100 rounded-md p-[20px]"
            style={{ height: "min-content", width: "100%" }}
          >
            {/* {!isClaimed ? */}
              <>
              <div className="text-h4-normal-semi-bold text-center">
              Membership Key
            </div>
            <img
              alt="key"
              style={{
                height: "340px",
                borderRadius: "20px",
                margin: "0 auto",
              }}
              src="https://imagedelivery.net/uDbEDRBQqhBXrrfuCRrATQ/fd46e53f-a572-43e3-6994-db20e5723a00/public"
            />
            <Button
              text="Claim"
              customCss="w-full mt-[40px]"
              onClick={() => claimKey({ xdr })}
            />
            <div
            className="text-paragraph-medium-medium text-center mt-[20px]"
            >This key will give you access to the discord server</div>
              </>
            {/* :
            <>
            <div
            className="text-paragraph-medium-medium text-center mt-[20px]"
            >You already own the membership key</div>
            </>
            } */}
            
          </div>
        </div>
      </Layout>
    </div>
  );
}
