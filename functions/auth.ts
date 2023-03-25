import {
  Keypair,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Operation,
  Account,
  xdr
} from 'stellar-base';
import { Buffer } from "buffer-polyfill";
import { Transaction } from '../node_modules/stellar-base/types/index';
import jwt from '@tsndr/cloudflare-worker-jwt'

//found the fix for polyfilling buffer like this from https://github.com/remix-run/remix/issues/2813
globalThis.Buffer = Buffer as unknown as BufferConstructor;

interface Env {
  SESSION_STORAGE: KVNamespace;
  authsigningkey: any;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const request = context.request
    const { searchParams } = new URL(request.url);
    const userAccount = searchParams.get('account');
    const userID = searchParams.get('userid');
    
    const network_pass = Networks.TESTNET;
    const testurl = 'https://horizon-testnet.stellar.org';
    const mainurl = 'https://horizon.stellar.org';
    const ourURL = new URL(request.url).origin

    //for some reason the env var or wrangler secret, niether one is a string type at first so we need to convert it to a string using String()
    let serverkeypair = Keypair.fromSecret(String(context.env.authsigningkey));
    
    const Challenge = await generateAuthChallenge(serverkeypair, userAccount, userID, ourURL);

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
    NETWORK_PASSPHRASE: string
  }
  const authjson: authrequest = await context.request.json()
  //todo: Set the network passphrase as a env var.
  //todo: build the jwt token
  let passphrase = Networks.TESTNET
  if (authjson.NETWORK_PASSPHRASE){
    passphrase=authjson.NETWORK_PASSPHRASE
  }
  let transaction = new TransactionBuilder.fromXDR(authjson.Transaction, passphrase)
  //todo: verify the signer is authorized to sign for the source, for now just accept the source signature
  const refreshtoken = await getrefreshtoken(transaction, context);
  if (refreshtoken != false ) {
    //todo: store the refresh token
    const accesstoken = await getaccesstoken(refreshtoken, context);
    if (accesstoken != false){
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
}

async function getrefreshtoken(transaction, context){
  if ( await verifyTxSignedBy(transaction,transaction.source) == true){
    const ourURL = new URL(context.request.url).origin
    let token = await jwt.sign(
      {
        "userid": transaction.operations[1].value,
        "sub": transaction.source, //the pubkey of who it's for
        "jti": transaction.operations[0].value, // the unique identifier for this crypto.randomUUID()).toString('base64') should be set by the challenge manage data...
        "iss": ourURL,//the issuer of the token
        "iat": Date.now(), //the issued at timestamp
        "exp": transaction.timeBounds.maxTime, // the expiration timestamp
        "xdr": transaction
      }, context.env.authsigningkey
    ) 
    return token
  } else{
    return false
  }  
}

async function getaccesstoken(refreshtoken, context){
  let validity = jwt.verify(refreshtoken, context.env.authsigningkey)
  if (!validity){
    return false
  }
  const { payload } = jwt.decode(refreshtoken) // decode the refresh token
  let passphrase = Networks.TESTNET
  const transaction = new TransactionBuilder.fromXDR(payload.xdr, passphrase)
  const ourURL = new URL(context.request.url).origin
  const expiretime = Date.now() + (60 * 60)
  let accesstoken = await jwt.sign(
    {
      "userid": transaction.operations[1].value,
      "sub": transaction.source, //the pubkey of who it's for
      "jti": transaction.operations[0].value, // the unique identifier for this crypto.randomUUID()).toString('base64') should be set by the challenge manage data...
      "iss": ourURL,//the issuer of the token
      "iat": Date.now(), //the issued at timestamp
      "exp": expiretime, // the expiration timestamp
    }, context.env.authsigningkey
  ) 
};

async function verifyTxSignedBy(transaction, accountID) {
 try{
  //todo: check thresholds and compile eligible account signers, instead of just checking if source signed.
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

async function generateAuthChallenge(serverkey, pubkey, discordID, oururl): Promise<TransactionBuilder>{
    let tempAccount=new Account(pubkey,"-1");
    let transaction = new TransactionBuilder(tempAccount, {
            fee: BASE_FEE,
            //todo: set the passphrase programatically based on an envvar
            networkPassphrase: Networks.TESTNET
        })
            // add a payment operation to the transaction
            .addOperation(Operation.manageData({
              name: `${oururl} auth`,
              value: Buffer.from(crypto.randomUUID()).toString('base64'),
              source: serverkey.publicKey()
            }))
            .addOperation(Operation.manageData({
                name: "DiscordID",
                value: discordID
                }))
            // mark this transaction as valid only for the next 30 days
            .setTimeout(60*60*24*30)
            .build();
    await transaction.sign(serverkey);
    const challenge = await transaction.toEnvelope().toXDR('base64');
    return challenge;
}

function gatherTxSigners(transaction, signers) {
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
