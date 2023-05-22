import { Button } from "communi-design-system";

import { TransactionBuilder, Networks } from "stellar-base";
import { Link, useLoaderData } from "@remix-run/react";
import { type LoaderArgs, json, ActionFunction, redirect } from "@remix-run/cloudflare";
import { User, StellarAccount } from "../models";
import { AccountForm } from "~/forms";
import { getUser } from "~/utils/session.server";
import { getProofTxt } from "~/utils/scfapi";
import { getVerificationToken } from "~/utils/sqproof";
import { ref } from "joi";
import jwt from "@tsndr/cloudflare-worker-jwt";

export async function fetchRegisteredAccounts(request: Request, context: any) {
  const { DB } = context.env as any;
  const { discord_user_id } = await getUser(request, context.sessionStorage);
  const stellarAccounts = await StellarAccount.findBy("discord_user_id", discord_user_id, DB);
  //const accounts = stellarAccounts.map((account) => account.public_key);
  return stellarAccounts;
}
export async function getAccessToken(account: string, request: Request, context: any) {
  const { DB } = context.env as any;
  const { discord_user_id } = await getUser(request, context.sessionStorage);
  console.log(discord_user_id)
  const record = await StellarAccount.findBy("public_key", account, DB);
  console.log(record)

  console.log(record[0].refresh_token)
  return record[0].refresh_token;
}
export async function generateProofs(request: Request, context: any, accounts: string[]) {
  const proofs = [];
  for (const account of accounts) {
    console.log('account', account)
    const accesstoken = await getAccessToken(account, request, context);
    console.log(accesstoken, 'accesstoken')
    const decoded = await jwt.decode(accesstoken)
    let passphrase: Networks = Networks.TESTNET;
    let transaction = new (TransactionBuilder.fromXDR as any)(decoded.payload.xdr, passphrase);
    console.log(decoded, 'decoded')
    console.log(transaction, 'transaction')
    const signature = transaction.signatures[0].signature().toString("base64");
    const token = await getVerificationToken(account, 'production', accesstoken, signature);
    proofs.push(token);
  }
  console.log(proofs, 'THE PROOFS')
  return proofs;
}

// Define your loader function
export let loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const user = await getUser(request, sessionStorage);
  const { discord_user_id } = user ?? false;
  const accounts = await fetchRegisteredAccounts(request, context);

  // Get the session and then get proofs from session
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const proofs = session.get("proofs");


  return json({ discord_user_id, accounts, proofs });
};
function chunkString(str: string, length: number) {
  return str.toString().match(new RegExp('.{1,' + length + '}', 'g'));
}
export const action: ActionFunction = async ({ request, context }) => {
  const { sessionStorage } = context as any;
  const accounts = await fetchRegisteredAccounts(request, context);
  const proofs = await generateProofs(request, context, accounts);

  // Get the session and then set proofs in session (or wherever you like)
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  session.set("proofs", proofs); 
  await sessionStorage.commitSession(session);

  // Redirect back to this page
  return redirect(request.url);
};


export default function Index() {
  const { discord_user_id, accounts, proofs, context } = useLoaderData();

  // Render proofs if they are available
  let renderProofs = null;
  if (proofs) {
    renderProofs = proofs.map((proof, index) => <p key={index}>{proof}</p>);
  }

  return (
    <div className="bg-secondary-900 h-screen flex items-center justify-center">
      <div className="w-11/12 sm:w-3/4 md:w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 max-w-screen-xl mx-auto px-6 py-4 bg-neutral-100 rounded-lg shadow-md overflow-auto">

        {discord_user_id && <div className="text-center mb-4">Connected as: {discord_user_id}</div>}
        <div className="flex flex-col items-center mb-4">
          <Button
            text="Connect with Discord"
            type="link"
            to="/verify"
            component={Link}
            disabled={!!discord_user_id}
          />
        </div>
        <div className="mb-4">
          <p className="text-center mb-2">You have {accounts.length} accounts linked.</p>
          {accounts.map((account) => (
            <div key={account.id} className="mb-4">
              <p className="break-all">{account.public_key}</p>
              <form method="post" action="/delink" className="mt-2">
                <input
                  type="hidden"
                  name="publicKey"
                  value={account.public_key}
                />
                <div className="flex justify-center mt-2">
                  <Button type="submit" text="Remove" />
                </div>
              </form>
            </div>
          ))}
          <div className="flex justify-center mt-2">
            <Button
              text="Add a public key"
              type="link"
              to="/connect"
              component={Link}
            />
          </div>
        </div>
        {accounts.length > 0 &&
          <div className="mb-4">
            <p className="text-center">Prove your roles</p>
            <form method="post" action="/getProof" className="mt-2">
              <div className="flex justify-center mt-2">
                <Button
                  text="Generate Proofs"
                  type="submit"
                />
              </div>
            </form>
          </div>
        }
        {renderProofs &&
          <div className="overflow-auto">
            <h3 className="text-center mb-4">Generated Proofs:</h3>
            {renderProofs = proofs.map((proof, index) =>
              <div key={index}>
                {chunkString(proof, 100)?.map((chunk, idx) => (
                  <p key={idx}>{chunk}</p>
                ))}
              </div>
            )}
          </div>
        }
      </div>
    </div>


  );
}