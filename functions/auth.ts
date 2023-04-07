

import {
  Keypair,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Operation,
  Account,
  xdr
} from 'stellar-base';
import Buffer from "buffer-polyfill";
import type { Transaction } from '../node_modules/stellar-base/types/index';

import jwt from '@tsndr/cloudflare-worker-jwt'
import { parse } from 'cookie';
import { UserForm } from '../app/forms';
import { User } from '../app/models';
//import Discord from '../app/models/Discord';
//import { redirect } from "@remix-run/cloudflare";
import * as horizon from "../horizon-api"
//import * as horizon from "../horizon-api"

//found the fix for polyfilling buffer like this from https://github.com/remix-run/remix/issues/2813
globalThis.Buffer = Buffer as unknown as BufferConstructor;

interface Env {
  SESSION_STORAGE: KVNamespace;
  authsigningkey: any;
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  async function generateAuthChallenge(serverkey, pubkey, discordID, oururl, clientState) {
    let tempAccount=new Account(pubkey,"-1");
    let transaction = new TransactionBuilder(tempAccount, {
            fee: BASE_FEE,
            //todo: set the passphrase programatically based on an envvar
            networkPassphrase: Networks.TESTNET
        })
            // add a payment operation to the transaction
            .addOperation(Operation.manageData({
              name: `${oururl} auth`,
              value: clientState, //btoa(clientState).toString(),

              source: serverkey.publicKey()
            }))
            .addOperation(Operation.manageData({
                name: "DiscordID",
                value: discordID,
                source: pubkey
                }))
            // mark this transaction as valid only for the next 30 days
            .setTimeout(60*60*24*30)
            .build();
    await transaction.sign(serverkey);
    const challenge = await transaction.toEnvelope().toXDR('base64');
    return challenge;
}

  const request = context.request
  const { searchParams } = new URL(request.url);

  const userAccount = searchParams.get('account');
  let signerinfo = await getAccountAuthorization(userAccount)
  
  const userID = searchParams.get('userid');
  const state = searchParams.get('state')
  const cookies = request.headers.get("Cookie")
  const cookieHeader = parse(cookies);
  const { clientState } = cookieHeader;
  //todo:verify the states
  console.log('Checkpoint 3', cookies, state, clientState)

  const network_pass = Networks.TESTNET;
  const testurl = 'https://horizon-testnet.stellar.org';
  const mainurl = 'https://horizon.stellar.org';
  const ourURL = new URL(request.url).origin

  //for some reason the env var or wrangler secret, niether one is a string type at first so we need to convert it to a string using String()
  let serverkeypair = Keypair.fromSecret(String(context.env.authsigningkey));
  
  const Challenge = await generateAuthChallenge(serverkeypair, userAccount, userID, ourURL, clientState);

  const data = {
    "Transaction": Challenge,
    "Network_Passphrase": network_pass
  };

  const json = JSON.stringify(data, null, 2);

  return new Response(json, {
    status: 200,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export const onRequestOptions: PagesFunction<Env> = async (context) => {

  return new Response("OK", {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Methods":"OPTIONS, POST, GET",
      "Access-Control-Allow-Origin": "*",
    },
  })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  type authrequest = {
    Transaction: string,
    NETWORK_PASSPHRASE: Networks,
    discord_user_id: string
  }
  //const authjson: authrequest = await context.request.json()

  //const authjson = await context.request.json();
  //console.log(authjson)
  const { Transaction, NETWORK_PASSPHRASE, discord_user_id } = await context.request.json() as authrequest
  //const discord_user_id = authjson.discord_user_id
  //todo: Set the network passphrase as a env var.


  const cookies = context.request.headers.get("Cookie")
  const cookieHeader = parse(cookies);
  let { clientState } = cookieHeader;
  console.log('in the auth, clientstate:');
  console.log(clientState);
  console.log(`${discord_user_id} discord user id`)
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
  console.log(authedstate)
  //let authedstate = transaction.operations[0].value
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

  //todo: verify the signer is authorized to sign for the source, for now just accept the source signature

  const refreshtoken = await getrefreshtoken(transaction, context);

  if (refreshtoken != false ) {
    console.log(discord_user_id)
    console.log(await User.findBy('discord_user_id', discord_user_id, DB))
    const userExists = (await User.findBy('discord_user_id', discord_user_id, DB)).length
    console.log(userExists, 'user exists')
    const accesstoken = await getaccesstoken(refreshtoken, context);
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
      return new Response(responsetext, {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
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
};


async function gatherTxSigners(transaction, signers) {
  const hashedSignatureBase = transaction.hash();
  const signersFound = new Set();
  for (const signer of signers) {
    if (transaction.signatures.length === 0) {
      break;
    }
    let keypair;
    try {
      keypair = Keypair.fromPublicKey(signer); // This can throw a few different errors
    } catch (err) {
      throw new Error('Signer is not a valid address: ' + err.message);
    }
    for (let decSig of transaction.signatures) {
      if (!decSig.hint().equals(keypair.signatureHint())) {
        console.log('nope')
        continue;
      }
      if (keypair.verify(hashedSignatureBase, decSig.signature())) {
        console.log('yup')
        signersFound.add(signer);
        break;
      }
    }
  }
  return Array.from(signersFound);
}

async function verifyTxSignedBy(transaction, accountID) {
  try{
   //todo: check thresholds and compile eligible account signers, instead of just checking if source signed.
   const authInfo = getAccountAuthorization(transaction.source)
 
   const signedby = await gatherTxSigners(transaction, [accountID]) 
   let comparelist = [accountID]
   for (let n in comparelist){
     for (let i in signedby){
      if (signedby[i] == comparelist[n]){
       return true
      }else{
       throw('that does not matchh');
      }
     }
   }
  } catch(err){
   return false
  }
 }

async function getrefreshtoken(transaction, context){
  console.log('trying to make a refresh token')
 // console.log(transaction)
  const decoder = new TextDecoder();
  const userid =   decoder.decode(transaction.operations[1].value)
  console.log('userid', userid)
  const jti = decoder.decode(transaction.operations[0].value)
  console.log(jti, 'JTI')
  if ( await verifyTxSignedBy(transaction,transaction.source) == true){
    const ourURL = new URL(context.request.url).origin //https://127.0.0.1/ https://stellar-discord-bot.workers.dev/
    let token = await jwt.sign(
      {
        "userid": userid,
        "sub": transaction.source, //the pubkey of who it's for
        "jti": jti, // the unique identifier for this crypto.randomUUID()).toString('base64') should be set by the challenge manage data...
        "iss": ourURL,//the issuer of the token
        "iat": Date.now(), //the issued at timestamp
        "exp": transaction.timeBounds.maxTime, // the expiration timestamp
        "xdr": transaction.toXDR()
      }, context.env.authsigningkey
    ) 
    console.log(token, 'we got the refresh token')
    return token
  } else{
    return false
  }  
}

async function getaccesstoken(refreshtoken, context){
  let validity = jwt.verify(refreshtoken, context.env.authsigningkey)
  if (!validity){
    throw('the token is not valid')
  }
  const { payload } = jwt.decode(refreshtoken) // decode the refresh token
  let passphrase = Networks.TESTNET
  console.log('trying to get an access token')
  const ntransaction = new (TransactionBuilder.fromXDR as any)(payload.xdr, passphrase)
  //let transaction = payload.xdr
 // console.log(ntransaction)
  const decoder = new TextDecoder();
  console.log(ntransaction.operations[0].value)
  const userid =   decoder.decode(ntransaction.operations[1].value)
  const jti = decoder.decode(ntransaction.operations[0].value)
  //
  const ourURL = new URL(context.request.url).origin
  const expiretime = Date.now() + (60 * 60)
  let accesstoken = await jwt.sign(
    {
      "userid": userid,
      "sub": ntransaction.source, //the pubkey of who it's for
      "jti": jti, // the unique identifier for this crypto.randomUUID()).toString('base64') should be set by the challenge manage data...
      "iss": ourURL,//the issuer of the token
      "iat": Date.now(), //the issued at timestamp
      "exp": expiretime, // the expiration timestamp
    }, context.env.authsigningkey
  )
  return accesstoken
};

export async function verifyAndRenewAccess(accesstoken, context){
  let validity = jwt.verify(accesstoken, context.env.authsigningkey)
  if (validity){
    const { DB } = context.env as any
    const { payload } = jwt.decode(accesstoken)
    const user = await User.findBy('discord_user_id', payload.userid, DB)
    const { lastaccesstoken } = user.stellar_access_token
    if (lastaccesstoken == accesstoken){
      if (payload.exp < Date.now()){
        const refreshtoken = user.stellar_refresh_token
        const newaccesstoken = await getaccesstoken(refreshtoken, context)
        const { payload } = jwt.decode(refreshtoken)
        user[0].stellar_expires_at = (payload.exp).toString()
        user[0].stellar_access_token = newaccesstoken
        await User.update(user[0], DB)     
        return newaccesstoken
      } else {
        return accesstoken;
      };
  }; 
  }else {
    throw('the access token is not valid the user must reauthorize')
  };
};

type threasholds = {
  low_threshold: number, 
  med_threshold: number, 
  high_threshold: number 
}
type AccountSigner = {
  weight: number,
  key: string,
  type: string
}
interface accountAuth{
  signers: AccountSigner[],
  threasholds: threasholds
}

async function getAccountAuthorization(pubkey): Promise<accountAuth> {
  const horizonURL = "https://horizon.stellar.org";
  const url = horizonURL + "/accounts/" + pubkey;
  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };
  const response = await fetch(url, init);
  const json: any = await response.json()
  console.log(json.thresholds)
  console.log(json.signers)
  return {signers: json.signers, threasholds: json.thresholds}
}

/* sample accountauth:
{
  threasholds: { low_threshold: 1, med_threshold: 1, high_threshold: 1 },
  signers: [
    {
      weight: 1,
      key: 'GBBKODANH3RROGGDHDC6FLGY2P4Y2GKT53ULPW75ATCRJRGUKQIO7S7Z',
      type: 'ed25519_public_key'
    },
    {
      weight: 5,
      key: 'GCV7P366FP6IX43MUHICPWFATGKYQTJPIZODISNWJD7KA6RKJLLA5JNU',
      type: 'ed25519_public_key'
    }
  ]
}
*/
