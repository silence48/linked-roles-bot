import { TransactionBuilder, Networks } from 'stellar-base';
import { json, type ActionArgs } from '@remix-run/cloudflare';
import { parse } from 'cookie';
import { updateUserSession, getUser } from '~/utils/session.server';

import jwt from "@tsndr/cloudflare-worker-jwt";
import { AccountBuilder } from '~/LRC/builders/AccountBuilder';
import { User } from '~/LRC/models/User';

import { getUrlParams } from '~/utils/getUrlParams';
import { getRefreshToken, getAccessToken } from '~/utils/auth.server';

export async function action({ request, context }: ActionArgs) {
  const { sessionStorage } = context as any;
  const body = await request.formData();
  const signedEnvelope = body.get("signed_envelope_xdr");
  console.log(`from challenge.verify - action - signedEnvelope ${signedEnvelope}`);
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") as any;
  const addAccount = (url.searchParams.get("addAccount") as any) ?? {};
  const cookies = request.headers.get("Cookie") ?? null;
  if (!cookies) return null;
  const cookieHeader = parse(cookies);
  const { clientState } = cookieHeader;
  const { discord_user_id } = (await getUser(request, sessionStorage)) ?? {};
console.log(`in challenge verify ${discord_user_id}`)
  let areq = {
    Transaction: signedEnvelope,
    NETWORK_PASSPHRASE: Networks.PUBLIC,
    discord_user_id: discord_user_id
  };
  const { Transaction, NETWORK_PASSPHRASE } = areq;
  let passphrase: Networks = Networks.PUBLIC;
  if (NETWORK_PASSPHRASE) {
    passphrase = NETWORK_PASSPHRASE;
  }


  const { DB } = context.env as any;
  let builtTx = new (TransactionBuilder.fromXDR as any)(Transaction, passphrase);
  //verify the state.
  const decoder = new TextDecoder();
  let authedstate = decoder.decode(builtTx.operations[0].value);

  if (clientState !== authedstate) {
    let errmsg = JSON.stringify('State verification failed.');
    return new Response(errmsg, {
      status: 403,
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    });
  }

  if (addAccount) {
    const account = await AccountBuilder.find({ discord_user_id, DB });
    console.log(account, 'account in challenge verify, addaccount')
    await account.addStellarAccount({ public_key: builtTx.source });
    return new Response(JSON.stringify('Stellar account added'), {
      status: 200,
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  const refreshtoken = await getRefreshToken(builtTx, request, context);
  if (refreshtoken != false) {
    const userExists = (await User.findBy('discord_user_id', discord_user_id, DB)).length;
    // console.log(`from challenge.verify - action - userExists ${userExists}`);
    const accesstoken = await getAccessToken(refreshtoken, request, context);
    if (accesstoken) {
      // const { payload } = jwt.decode(refreshtoken);
      // If user does not exist, create itx
      if (!userExists) {
        const errmsg = JSON.stringify('User does not exist.');
        return new Response(errmsg, {
          status: 403,
          headers: {
            'content-type': 'application/json;charset=UTF-8'
          }
        });
      } else {

        const account = await AccountBuilder.find({ discord_user_id, DB });
        await account.addStellarAccount({ public_key: builtTx.source });
      }

      // add provider and check for unsupported providers
      if (!provider) return;
      return updateUserSession(
        request,
        sessionStorage,
        { token: accesstoken, provider, account: builtTx.source },
        {
          message: 'Challenge verified',
          body: { account: builtTx.source, provider }
        }
      );
    }
  } else {
    let errortext = JSON.stringify({
      error: 'The provided transaction is not valid'
    });
    return new Response(errortext, {
      status: 401,
      headers: {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  //let authedstate = transaction.operations[0].value
  // Verify auth

  // Generate JWT

  // Store as a Token
}
