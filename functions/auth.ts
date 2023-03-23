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
    console.log(userAccount);
    const userID = searchParams.get('userid');
    console.log(userID);
    const network_pass = Networks.TESTNET;
    const testurl = 'https://horizon-testnet.stellar.org';
    const mainurl = 'https://horizon.stellar.org';
    
    let thekeypair = Keypair.fromPublicKey(userAccount);
    let tempAccount=new Account(userAccount,"-1");
    //for some reason the env var or wrangler secret, niether one is a string type at first so we need to convert it to a string using String()
    let serverkeypair = Keypair.fromSecret(String(context.env.authsigningkey));
    
    const token = await generateAuthToken(serverkeypair, userAccount, userID);

    console.log("The token is", token);

    const data = {
      "transaction": token,
      "network_passphrase": network_pass
    };

    const json = JSON.stringify(data, null, 2);

    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
    //this should succeed
    //console.log(verifyTxSignedBy(transaction, pubkey));
    //this should fail
    //console.log(verifyTxSignedBy(transaction, failkey));
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
    transaction: string
  }
  const authjson: authrequest = await context.request.json()
  //todo: Set the network passphrase as a env var.
  //todo: build the jwt token
  let transaction = new TransactionBuilder.fromXDR(authjson.transaction, Networks.TESTNET)
  const valid = verifyTxSignedBy(transaction,transaction.source)
  const json = JSON.stringify(valid, null, 2);
  return new Response(json, {
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

async function verifyTxSignedBy(transaction, accountID) {
  console.log(transaction)
    return gatherTxSigners(transaction, [accountID]).length !== 0;
  }

async function generateAuthToken(serverkey, pubkey, discordID): Promise<TransactionBuilder>{
    let tempAccount=new Account(pubkey,"-1");
    let transaction = new TransactionBuilder(tempAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET
        })
            // add a payment operation to the transaction
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
        continue;
      }
      if (keypair.verify(hashedSignatureBase, decSig.signature())) {
        signersFound.add(signer);
        break;
      }
    }
  }
  return Array.from(signersFound);
}
