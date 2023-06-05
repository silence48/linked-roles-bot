export async function gatherTxSigners(transaction, signers) {
  const { Keypair } = await import('stellar-base');
  const hashedSignatureBase = transaction.hash();
  const signersFound = new Set();
  for (const signer of signers) {
    console.log(signers[signer])
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

export async function verifyTxSignedBy(transaction, accountID) {
  try{
   //todo: check thresholds and compile eligible account signers, instead of just checking if source signed.
   const authInfo = getAccountAuthorization(transaction.source)
    console.log('verify tx signed by', transaction, accountID)
   const signedby = await gatherTxSigners(transaction, [accountID]) 
   console.log(signedby, 'signed by')
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

export async function getrefreshtoken(transaction, request, context){
  //import jwt from '@tsndr/cloudflare-worker-jwt'
  const jwt = await import ('@tsndr/cloudflare-worker-jwt')
  console.log('trying to make a refresh token')
 // console.log(transaction)
  const decoder = new TextDecoder();
  const userid = decoder.decode(transaction.operations[1].value)
  console.log(`making a refresh token for userid: ${userid}` )
  const jti = decoder.decode(transaction.operations[0].value)
  console.log(jti, 'JTI')
  if ( await verifyTxSignedBy(transaction,transaction.source) == true){
    const ourURL = new URL(request.url).origin //https://127.0.0.1/ https://stellar-discord-bot.workers.dev/
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


export async function getaccesstoken(refreshtoken, request, context){
   const {Networks, TransactionBuilder } = await import('stellar-base');
  const jwt = await import ('@tsndr/cloudflare-worker-jwt')
  
  
  let validity = jwt.verify(refreshtoken, context.env.authsigningkey)
  if (!validity){
    throw('the token is not valid')
  }
  const { payload } = jwt.decode(refreshtoken) // decode the refresh token
  let passphrase = Networks.PUBLIC
  console.log('trying to get an access token')
  const ntransaction = new (TransactionBuilder.fromXDR as any)(payload.xdr, passphrase)
  //let transaction = payload.xdr
  console.log('ntx', ntransaction)
  const decoder = new TextDecoder();
  console.log(ntransaction.operations[0].value)
  const userid =   decoder.decode(ntransaction.operations[1].value)
  const jti = decoder.decode(ntransaction.operations[0].value)
  //
  const ourURL = new URL(request.url).origin
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


//this isn't being used i don't think right now?
export async function verifyAndRenewAccess(accesstoken, context){
  const { User } = await import ('../models');
  const jwt = await import ('@tsndr/cloudflare-worker-jwt')
  let validity = jwt.verify(accesstoken, context.env.authsigningkey)
  if (await validity){
    const { DB } = context.env as any
    const { payload } = jwt.decode(accesstoken)
    const user = await User.findBy('discord_user_id', payload.userid, DB)
    const { lastaccesstoken } = user.stellar_access_token
    if (lastaccesstoken == accesstoken){
      if (payload.exp < Date.now()){
        const refreshtoken = user.stellar_refresh_token
        const newaccesstoken = await getaccesstoken(refreshtoken, request, context)
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

export async function getAccountAuthorization(pubkey): Promise<accountAuth> {
  console.log('getting account auth', pubkey)
  const horizonURL = "https://horizon.stellar.org";
  const url = horizonURL + "/accounts/" + pubkey;
  const init = {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };
  const response = await fetch(url, init);

  const json: any = await response.json()
  //console.log('json', json)
  console.log('json.thresholds', json.thresholds)
  console.log('json.signers', json.signers)
  return {signers: json.signers, threasholds: json.thresholds}
}