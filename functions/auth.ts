//import type { TransactionBuilder } from "../node_modules/stellar-base/types/index";
import {
  Keypair,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Operation,
  Account,
} from 'stellar-base';
import { Buffer } from "buffer-polyfill";

globalThis.Buffer = Buffer as unknown as BufferConstructor;

//const StellarBase = require("stellar-base")
interface Env {
  SESSION_STORAGE: KVNamespace;
  authsigningkey: any;
}

export const onRequest: PagesFunction<Env> = async (context) => {
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
    console.log(thekeypair)
    let tempAccount=new Account(userAccount,"-1");
    console.log(tempAccount);
    //let pubkey = 'GAJUGK5WKEF5GJ2DG7BZ4G52TXHMRYRAWL2DWYC2NYOO5V6FHJMIB7B2'
    //let failkey = 'GAJUGK5WKEF5GJ2DG7BZ4G52TXHMRYRAWL2DWYC2NYOO5V6FHJMIB7B3'
    //let userID = '12345678901'
    //let keypair = StellarBase.Keypair.fromSecret(String(context.env.authsigningkey) );
    //let keypair = StellarBase.Keypair.fromSecret("SAMT2BEUC5RKUDPZXSNEVKBX6NFVD75DZXHWYRKX7TDB2RGTXLEVRDV2");
    const token = await generateAuthToken(userAccount, userID);

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

async function generateAuthToken(pubkey, discordID): Promise<TransactionBuilder>{
    var tempAccount=new Account(pubkey,"-1");
    var transaction = new TransactionBuilder(tempAccount, {
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
    //await transaction.sign(serverkey);
    const token = await transaction.toEnvelope().toXDR('base64');
    return token;
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
