import {
  TransactionBuilder,
  Networks,
} from 'stellar-base';
import { json, type ActionArgs } from "@remix-run/cloudflare";
import { parse } from 'cookie';
import { updateUserSession, getUser } from "~/utils/session.server";
import { User } from '../models';
import jwt from '@tsndr/cloudflare-worker-jwt'
import { getrefreshtoken, getaccesstoken } from '~/utils/auth.server';

export async function action({ request, context }: ActionArgs) {
  const { sessionStorage } = context as any;
  console.log('at the verify')
  console.log(sessionStorage, 'sessionStorage')
  const body = await request.formData();
  console.log(body)
  const signedEnvelope = body.get("signed_envelope_xdr");
  const cookies = request.headers.get("Cookie") ?? null
  console.log(cookies, 'cookies')
  if (!cookies) return null;
  const cookieHeader = parse(cookies);
  const { clientState } = cookieHeader;
  console.log(clientState, 'clientState')
  const { discord_user_id } = await getUser(request, sessionStorage) ?? {}
  //console.log(context.request.url, 'context.request.url')
  console.log(request.url, 'request.url')
  let areq = {
    Transaction: signedEnvelope,
    NETWORK_PASSPHRASE: Networks.TESTNET,
    discord_user_id: discord_user_id
  }
  const { Transaction, NETWORK_PASSPHRASE } = areq
  let passphrase: Networks = Networks.TESTNET
  if (NETWORK_PASSPHRASE){
    passphrase=NETWORK_PASSPHRASE
  }
  const { DB } = context.env as any
  let transaction = new (TransactionBuilder.fromXDR as any) (Transaction, passphrase)
  //console.log(transaction)
  //verify the state.
  const decoder = new TextDecoder();
  let authedstate = decoder.decode(transaction.operations[0].value)
  console.log(authedstate, 'authedstate')
  console.log(clientState, 'clientState')
  console.log(areq, 'the auth request')
  if (clientState !== authedstate) {
    let errmsg = JSON.stringify('State verification failed.')
    console.log(errmsg);
    return new Response(errmsg, {
      status: 403,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  }

  const refreshtoken = await getrefreshtoken(transaction, request, context);
  console.log(refreshtoken, 'refreshtoken')
  if (refreshtoken != false ) {
    console.log(discord_user_id)
    console.log(await User.findBy('discord_user_id', discord_user_id, DB))
    const userExists = (await User.findBy('discord_user_id', discord_user_id, DB)).length
    console.log(userExists, 'user exists')
    const accesstoken = await getaccesstoken(refreshtoken, request, context);
    if (accesstoken){
    const { payload } = jwt.decode(refreshtoken)
    console.log('chk2 in auth.ts function')
    console.log(await User.findBy('discord_user_id', discord_user_id, DB))
    
    // If user does not exist, create it
    if (!userExists) {
      const errmsg = JSON.stringify('User does not exist.')
      return new Response(errmsg, {
        status: 403,
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    }
      else{

      const user = await User.findBy('discord_user_id', discord_user_id, DB)
        console.log(user, 'that was user')
        console.log(user[0].id)
        user[0].stellar_access_token = accesstoken;
        user[0].stellar_refresh_token = refreshtoken;
        user[0].stellar_expires_at = (payload.exp).toString();
        user[0].public_key = transaction.source
        console.log(await User.update(user[0], DB))
      }

      let responsetext = JSON.stringify({"token": accesstoken});
      return updateUserSession(request, sessionStorage, { isAuthed: true, token: accesstoken }, { redirectTo: '/claim'})
      
    }}else{
    let errortext = JSON.stringify({"error": "The provided transaction is not valid"})
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
