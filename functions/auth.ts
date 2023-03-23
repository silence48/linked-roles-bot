import { Transaction, TransactionBuilder, TransactionI } from "../node_modules/stellar-base/types/index";

const StellarBase = require("stellar-base")
interface Env {
  SESSION_STORAGE: KVNamespace;
  authsigningkey: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const request = context.request
    const { searchParams } = new URL(request.url);
    const userAccount = searchParams.get('account');
    const userID = searchParams.get('userid');
    const network_pass = StellarBase.Networks.TESTNET
    const testurl = 'https://horizon-testnet.stellar.org';
    const mainurl = 'https://horizon.stellar.org';
  
    //let pubkey = 'GAJUGK5WKEF5GJ2DG7BZ4G52TXHMRYRAWL2DWYC2NYOO5V6FHJMIB7B2'
    //let failkey = 'GAJUGK5WKEF5GJ2DG7BZ4G52TXHMRYRAWL2DWYC2NYOO5V6FHJMIB7B3'
    //let userID = '12345678901'
    let keypair = StellarBase.Keypair.fromSecret(context.env.authsigningkey);
    const token = generateAuthToken(keypair, userAccount, userID);

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

async function generateAuthToken(serverkey, pubkey, discordID): Promise<TransactionBuilder>{
    

    var tempAccount=new StellarBase.Account(pubkey,"-1");
    var transaction = new StellarBase.TransactionBuilder(tempAccount, {
            fee: StellarBase.BASE_FEE,
            networkPassphrase: StellarBase.Networks.TESTNET
        })
            // add a payment operation to the transaction
            .addOperation(StellarBase.Operation.manageData({
                name: "DiscordID",
                value: discordID
                }))
            // mark this transaction as valid only for the next 30 days
            .setTimeout(60*60*24*30)
            .build();
    await transaction.sign(serverkey);
    const token = await transaction.toEnvelope().toXDR('base64');
    return token;
}

function verifyTxSignedBy(transaction, accountID) {
  return gatherTxSigners(transaction, [accountID]).length !== 0;
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
      keypair = StellarBase.Keypair.fromPublicKey(signer); // This can throw a few different errors
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
