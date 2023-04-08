import {
  Account,
  TransactionBuilder,
  Networks,
  Operation,
  BASE_FEE,
  type Keypair
} from 'stellar-base';

export async function generateAuthChallenge(
  serverkey: Keypair,
  pubkey: string,
  discordID: string,
  oururl: string,
  clientState: string
) {
  let tempAccount = new Account(pubkey, "-1");
  let transaction = new TransactionBuilder(tempAccount, {
    fee: BASE_FEE,
    //todo: set the passphrase programatically based on an envvar
    networkPassphrase: Networks.TESTNET,
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
        name: "DiscordID",
        value: discordID,
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
