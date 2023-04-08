import * as React from "react";
import { json, redirect, type LoaderArgs } from "@remix-run/cloudflare";
import { getUser } from "~/utils/session.server";
import { useModal } from "~/context";
import { Layout, Button } from "communi-design-system";
import { WalletClient } from "~/utils/WalletClient.client";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { checkRoles } from "~/utils/checkRoles.server";

export const loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const { isAuthed, isClaimed, provider } =
    (await getUser(request, sessionStorage)) ?? {};

  if (typeof isAuthed == 'undefined') {
    return redirect('/')
  }
  // checkRoles(context, )
  // Generate xdr for claiming the Asset

  return json({ xdr: "" });

  // Redirect if user has Asset
};

export default function Claim() {
  const { closeModal, isOpen } = useModal();
  const { xdr } = useLoaderData() ?? {};
  const fetcher = useFetcher();

  React.useEffect(() => {
    if (isOpen) {
      closeModal();
    }
  }, []);

  const claimKey = async ({ xdr }: any) => {
    const wc = new WalletClient("freighter", "TESTNET");
    const { horizonResult }: any = await wc.signTransaction(xdr, true);
    console.log("horizonResult", horizonResult);
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
              text="Claim Key"
              customCss="w-full mt-[40px]"
              onClick={() => claimKey({ xdr })}
            />
            <div
            className="text-paragraph-medium-medium text-center mt-[20px]"
            >This key will give you access to the discord server</div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
