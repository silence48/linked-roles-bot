import type { Horizon } from 'horizon-api';
import type { Keypair } from 'stellar-base';
const { TextEncoder, TextDecoder } = require('util');

async function deriveKey(secret) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      "name": "PBKDF2",
      "salt": encoder.encode("a-unique-salt"), // Use a constant salt (not recommended) or store a random salt for each encryption -- update this later not important right now.
      "iterations": 100000,
      "hash": "SHA-256"
    },
    keyMaterial,
    { "name": "AES-GCM", "length": 256},
    true,
    [ "encrypt", "decrypt" ]
  );
}

async function encrypt(text, secret) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const key = await deriveKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    data
  );
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode.apply(null, combined));
}

async function decrypt(encrypted, secret) {
  const decoder = new TextDecoder();
  const key = await deriveKey(secret);
  const data = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const encryptedData = data.slice(12);
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    encryptedData
  );
  return decoder.decode(decrypted);
}

export async function generateAuthChallenge(
  serverkey: Keypair,
  pubkey: string,
  discordID: string,
  oururl: string,
  clientState: string
) {
  const {TransactionBuilder, Operation, Account, Networks, BASE_FEE} = await import('stellar-base');
  const encryptedid = await encrypt(discordID, serverkey.secret());

  let tempAccount = new Account(pubkey, "-1");
  let transaction = new TransactionBuilder(tempAccount, {
    fee: "0",
    //todo: set the passphrase programatically based on an envvar
    networkPassphrase: Networks.PUBLIC,
  })
    // add a payment operation to the transaction
    .addOperation(
      Operation.manageData({
        name: `${oururl} auth`,
        value: clientState, //btoa(clientState).toString(),
        source: serverkey.publicKey(),
      })
    )
    .addOperation(
      Operation.manageData({
        name: "User",
        value: encryptedid,
        source: pubkey,
      })
    )
    // mark this transaction as valid only for the next 30 days
    .setTimeout(60 * 60 * 24 * 30)
    .build();
  transaction.sign(serverkey);
  const challenge = transaction.toEnvelope().toXDR("base64");
  return challenge;
}

export async function generateDefaultClaimTransaction(context, userPublicKey) {
  console.log("generateDefaultClaimTransaction")
  try{
    const {Asset, Keypair, TransactionBuilder, Operation, Account, Networks, BASE_FEE} = await import('stellar-base');
      let serverseqnumber = await getSequenceNumber(context, context.env.botpubkey);    
      let serverAccount = new Account(context.env.botpubkey, serverseqnumber);
      const serverPublicKey = context.env.botpubkey;
      const serverSecretKey = context.env.authsigningkey;
      const serverKeypair = Keypair.fromSecret(serverSecretKey);
      const defaultRole = new Asset("defaultrole", serverPublicKey);
  const transaction = new TransactionBuilder(serverAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.PUBLIC, // Use Networks.PUBLIC for the mainnet
  })
    .addOperation(
      Operation.changeTrust({
        asset: defaultRole,
        source: userPublicKey,
      })
    )
    .addOperation(
      Operation.payment({
        destination: userPublicKey,
        asset: defaultRole,
        amount: "0.0000001",
      })
    )
    .setTimeout(0)
    .build();

  transaction.sign(serverKeypair);

  const xdr = transaction.toXDR();
  console.log(`generateDefaultClaimTransaction - xdr -  ${xdr} `)
  return xdr;

  }catch(err){
      console.log(err)
  }
  
  }

export async function getAccountObject(context, pubkey){
  let server = context.env.horizonURL;
  const account: Horizon.AccountResponse = await (
      await fetch(`${server}/accounts/${pubkey}`)
    ).json();
  return account
}

export async function getSequenceNumber(context, pubkey){
  let account = await getAccountObject(context, pubkey);
  return account.sequence;
}