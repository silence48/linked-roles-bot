import { TransactionBuilder, Networks } from 'stellar-base';
import { json, type ActionArgs } from '@remix-run/cloudflare';
import { parse } from 'cookie';
import { updateUserSession, getUser } from '~/utils/session.server';
import { AccountBuilder, User } from 'linked-roles-core';
// import jwt from "@tsndr/cloudflare-worker-jwt";
import { getUrlParams } from '~/utils/getUrlParams';
import { getRefreshToken, getAccessToken } from '~/utils/auth.server';

export async function action({ request, context }: ActionArgs) {
  const { sessionStorage, env } = context as any;
  const { DB, STELLAR_NETWORK, NETWORK_PASSPHRASE } = env;
  const body = await request.formData();
  const url = new URL(request.url);
  const signedEnvelope = body.get('signed_envelope_xdr');
  const params = getUrlParams(url);
  const { provider, addAccount }: any = params ?? {};
  const cookies = request.headers.get('Cookie') ?? null;
  if (!cookies) return null;
  const cookieHeader = parse(cookies);
  const { clientState } = cookieHeader;
  const { discord_user_id } = (await getUser(request, sessionStorage)) ?? {};

  let builtTx = new (TransactionBuilder.fromXDR as any)(signedEnvelope, NETWORK_PASSPHRASE);

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
        // const user = await User.findBy('discord_user_id', discord_user_id, DB);
        // user[0].stellar_access_token = accesstoken;
        // user[0].stellar_refresh_token = refreshtoken;
        // user[0].stellar_expires_at = (payload.exp).toString();
        // user[0].public_key = builtTx.source;

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
