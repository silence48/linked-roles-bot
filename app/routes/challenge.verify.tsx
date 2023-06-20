import { TransactionBuilder, Networks } from "stellar-base";
import { json, type ActionArgs } from "@remix-run/cloudflare";
import { parse } from "cookie";
import { updateUserSession, getUser } from "~/utils/session.server";
import { User } from "../models";
// import jwt from "@tsndr/cloudflare-worker-jwt";
import { getRefreshToken, getAccessToken } from "~/utils/auth.server";

export async function action({ request, context }: ActionArgs) {
  const { sessionStorage, env } = context as any;
  const { DB, STELLAR_NETWORK, NETWORK_PASSPHRASE } = env;
  const body = await request.formData();
  const url = new URL(request.url);
  const signedEnvelope = body.get("signed_envelope_xdr");
  const provider = url.searchParams.get("provider") as any;
  const cookies = request.headers.get("Cookie") ?? null;
  // console.log("NETWORK_PASSPHRASE", NETWORK_PASSPHRASE)
  if (!cookies) return null;
  const cookieHeader = parse(cookies);
  const { clientState } = cookieHeader;
  const { discord_user_id } = (await getUser(request, sessionStorage)) ?? {};

  // let areq = {
  //   Transaction: signedEnvelope,
  //   NETWORK_PASSPHRASE,
  //   discord_user_id: discord_user_id,
  // };

  // const { Transaction, NETWORK_PASSPHRASE } = areq;

  // TODO: Networks.PUBLIC or TESTNET should be set from 1 env variable.
  // let passphrase: Networks = Networks.PUBLIC;
  // if (NETWORK_PASSPHRASE) {
  //   passphrase = NETWORK_PASSPHRASE;
  // }

  // let builtTx = new (TransactionBuilder.fromXDR as any)(Transaction, passphrase);

  let builtTx = new (TransactionBuilder.fromXDR as any)(
    signedEnvelope,
    NETWORK_PASSPHRASE
  );

  //verify the state.
  const decoder = new TextDecoder();
  let authedstate = decoder.decode(builtTx.operations[0].value);
  // console.log(
  //   `from challenge.verify - action - authedstate ${authedstate} - clientState ${clientState}`
  // );
  // console.log(areq, "the auth request");
  if (clientState !== authedstate) {
    let errmsg = JSON.stringify("State verification failed.");
    return new Response(errmsg, {
      status: 403,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  }

  const refreshtoken = await getRefreshToken(builtTx, request, context);
  console.log('refreshtoken', refreshtoken)
  if (refreshtoken != false) {
    const userExists = (
      await User.findBy("discord_user_id", discord_user_id, DB)
    ).length;
    // console.log(`from challenge.verify - action - userExists ${userExists}`);
    const accesstoken = await getAccessToken(refreshtoken, request, context);
    if (accesstoken) {
      // const { payload } = jwt.decode(refreshtoken);
      // If user does not exist, create it
      if (!userExists) {
        const errmsg = JSON.stringify("User does not exist.");
        return new Response(errmsg, {
          status: 403,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        });
      } else {
        const user = await User.findBy("discord_user_id", discord_user_id, DB);
        user[0].stellar_access_token = accesstoken;
        // user[0].stellar_refresh_token = refreshtoken;
        // user[0].stellar_expires_at = (payload.exp).toString();
        user[0].public_key = builtTx.source;
        // console.log(await User.update(user[0], DB));
      }

      // let responsetext = JSON.stringify({ token: accesstoken });

      // add provider
      if (!provider) return;
      return updateUserSession(
        request,
        sessionStorage,
        { token: accesstoken, provider, account: builtTx.source },
        { message: "Challenge verified", body: { account: builtTx.source, provider } }
      );
    }
  } else {
    let errortext = JSON.stringify({
      error: "The provided transaction is not valid",
    });
    return new Response(errortext, {
      status: 401,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  //let authedstate = transaction.operations[0].value
  // Verify auth

  // Generate JWT

  // Store as a Token
}
