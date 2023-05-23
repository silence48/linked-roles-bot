import * as React from "react";
import { json, redirect, type LoaderArgs } from "@remix-run/cloudflare";
import { getUser } from "~/utils/session.server";
import { User } from "~/models";
import { useModal } from "~/context";
import { Layout, Button } from "communi-design-system";
import { WalletClient } from "~/utils/WalletClient.client";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { checkRoles } from "~/utils/checkRoles.server";
import { verifyAndRenewAccess } from "~/utils/auth.server";
import { generateDefaultClaimTransaction } from "~/utils/stellarUtils.server";
import jwt from "@tsndr/cloudflare-worker-jwt";

export const loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const { DB } = context.env as any;
  const { authsigningkey } = context.env as any;
  const {
    isAuthed,
    isClaimed,
    provider,
    token: accesstoken,
  } = (await getUser(request, sessionStorage)) ?? {}; //todo: error handling or make this more clear

  if (typeof isAuthed == "undefined" || typeof accesstoken == "undefined") {
    return redirect("/");
  }
  //todo: verifyAndRenewAccess, and make that update the users jwt when necessary.
  let validity = jwt.verify(accesstoken, authsigningkey);
  const { payload } = jwt.decode(accesstoken);

  const { userid } = payload;
  console.log(payload, "PAYLOAD");
  console.log(userid, "DISCORD USER ID");
  console.log(await User.findBy("discord_user_id", userid, DB));
  const public_key = payload.sub as string;
  //todo:check if the user ever claimed the asset even if the balance is 0, as they can only claim once
  //todo: make it an authonly asset or make that an option in the asset creation.
  //todo: isClaimed should be in the d1 users object somewhere, or something like that.

  var isOwned = false;
  let claim = "";
  var roles = await checkRoles(context, public_key, userid);

  if (roles?.defaultrole == 0) {
    claim = (await generateDefaultClaimTransaction(context, public_key)) ?? "";
  }
  return json({ xdr: claim, isClaimed, provider });

  // Redirect if user has Asset
};

export default function Claim() {
  const { closeModal, isOpen, openModal } = useModal();
  const { xdr, isClaimed, provider } = useLoaderData() ?? {};
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (isOpen) {
      closeModal();
    }
  }, []);

  React.useEffect(() => {
    if (fetcher.data) {
      const { ok } = fetcher.data;
      if (ok) {
        console.log('Role updated successfuly')
      } else {
        console.log('Something went role while updating the role')
      }
    }
  }, [fetcher])

  const claimKey = async ({ xdr }: any) => {
    const wc = new WalletClient(provider, "PUBLIC");
    const { horizonResult }: any = await wc.signTransaction(xdr, true);
    if (horizonResult.successful) {
      openModal({ type: 'tx_success', content: horizonResult, padding: 'large' })

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
      <Layout variant="small">
        <div className="flex items-center h-screen">
          <div
            className="bg-neutral-100 rounded-[40px]"
            style={{ height: "min-content", width: "100%", padding: '20px 40px 20px 40px', marginLeft: '80px', marginRight: '80px' }}
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
              {xdr && (
                <Button
                  text="Claim"
                  customCss="w-full mt-[40px]"
                  onClick={() => claimKey({ xdr })}
                />
              )}
              <div className="text-paragraph-medium-medium text-center mt-[20px]">
                This key will give you access to the discord server
              </div>
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
