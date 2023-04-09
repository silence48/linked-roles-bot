import { TransactionBuilder, Networks } from "stellar-base";
import { json, type ActionArgs } from "@remix-run/cloudflare";
import { parse } from "cookie";
import { updateUserSession, getUser } from "~/utils/session.server";
import { User } from "../models";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { getrefreshtoken, getaccesstoken } from "~/utils/auth.server";

export async function action({ request, context, params }: ActionArgs) {
  const { sessionStorage } = context as any;
  const body = await request.formData();
  const signedEnvelope = body.get("signed_envelope_xdr");
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") as any;
  const cookies = request.headers.get("Cookie") ?? null;
  if (!cookies) return null;
  const cookieHeader = parse(cookies);
  const { clientState } = cookieHeader;
  const { discord_user_id } = (await getUser(request, sessionStorage)) ?? {};
  let areq = {
    Transaction: signedEnvelope,
    NETWORK_PASSPHRASE: Networks.TESTNET,
    discord_user_id: discord_user_id,
  };
  const { Transaction, NETWORK_PASSPHRASE } = areq;
  let passphrase: Networks = Networks.TESTNET;
  if (NETWORK_PASSPHRASE) {
    passphrase = NETWORK_PASSPHRASE;
  }
  const { DB } = context.env as any;
  let transaction = new (TransactionBuilder.fromXDR as any)(
    Transaction,
    passphrase
  );
  //verify the state.
  const decoder = new TextDecoder();
  let authedstate = decoder.decode(transaction.operations[0].value);
  if (clientState !== authedstate) {
    let errmsg = JSON.stringify("State verification failed.");
    return new Response(errmsg, {
      status: 403,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  }

  const refreshtoken = await getrefreshtoken(transaction, request, context);
  if (refreshtoken != false) {
    await User.findBy("discord_user_id", discord_user_id, DB);
    const userExists = (
      await User.findBy("discord_user_id", discord_user_id, DB)
    ).length;
    const accesstoken = await getaccesstoken(refreshtoken, request, context);
    if (accesstoken) {
      const { payload } = jwt.decode(refreshtoken);
      await User.findBy("discord_user_id", discord_user_id, DB)

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
        if (!payload.exp) return;
        user[0].stellar_access_token = accesstoken;
        user[0].stellar_refresh_token = refreshtoken;
        user[0].stellar_expires_at = payload.exp.toString();
        user[0].public_key = transaction.source;
      }

      let responsetext = JSON.stringify({ token: accesstoken });

      // add provider
      if (!provider) return;
      return updateUserSession(
        request,
        sessionStorage,
        { isAuthed: true, token: accesstoken, provider },
        { redirectTo: "/claim" }
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
