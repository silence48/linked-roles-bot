import {
    Account,
    TransactionBuilder,
    Networks,
    Operation,
    BASE_FEE,
    Asset,
    Keypair
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
  
  export async function generateDefaultClaimTransaction(context, userPublicKey) {
    console.log("IT CALLED THE FUNCTION YES")
    try{
        let serverseqnumber = await getSequenceNumber(context, context.env.botpubkey);    
        let serverAccount = new Account(context.env.botpubkey, serverseqnumber);
        console.log(serverseqnumber, serverAccount)
        console.log(context.env.botpubkey)
        const serverPublicKey = context.env.botpubkey;
        const serverSecretKey = context.env.authsigningkey;
        console.log(`the server secret key is ${context.env.authsigningkey} and it's type is ${context.env.authsigningkey} 
        and the serverSecretKey is ${serverSecretKey} and it's type is ${typeof(serverSecretKey)}`)
        console.log(typeof(serverPublicKey))
        const serverKeypair = Keypair.fromSecret(serverSecretKey);

        const defaultRole = new Asset("defaultrole", serverPublicKey);
        console.log('it set the other shit too.')
    const transaction = new TransactionBuilder(serverAccount, {
      fee: BASE_FEE,
      networkPassphrase: Networks.TESTNET, // Use Networks.PUBLIC for the mainnet
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
    console.log(xdr);
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