
import {
  Keypair,
  TransactionBuilder,
  Networks
} from 'stellar-base';
import { User } from 'linked-roles-core';
import jwt from '@tsndr/cloudflare-worker-jwt'


export async function gatherTxSigners(transaction: any, signers: any) {
  const hashedSignatureBase = transaction.hash();
  console.log("gatherTxSigners: hashedSignatureBase",hashedSignatureBase)
  console.log("gatherTxSigners: signers",signers)

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

export async function verifyTxSignedBy(transaction: any, accountID: any) {
  try{
   //todo: check thresholds and compile eligible account signers, instead of just checking if source signed.
  //  const authInfo = getAccountAuthorization(transaction.source)
 
   const signedby = await gatherTxSigners(transaction, [accountID]) 
   console.log("verifyTxSignedBy signedby", signedby)
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

export async function getRefreshToken(transaction: any, request: any, context: any){
  const { authsigningkey } = context.env;
  const decoder = new TextDecoder();
  const userid = decoder.decode(transaction.operations[1].value)
  const jti = decoder.decode(transaction.operations[0].value)
  console.log('await verifyTxSignedBy(transaction,transaction.source)', await verifyTxSignedBy(transaction,transaction.source))
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
      }, authsigningkey
    ) 
    console.log(token, 'we got the refresh token')
    return token
  } else{
    return false
  }  
}


export async function getAccessToken(refreshtoken: any, request: any, context: any){
  const { NETWORK_PASSPHRASE } = context.env
  let validity = jwt.verify(refreshtoken, context.env.authsigningkey)
  if (!validity){
    throw('the token is not valid')
  }
  const { payload } = jwt.decode(refreshtoken) // decode the refresh token
  // let passphrase = NETWORK_PASSPHRASE
  console.log('trying to get an access token')
  const ntransaction = new (TransactionBuilder.fromXDR as any)(payload.xdr, NETWORK_PASSPHRASE)
  //let transaction = payload.xdr
 // console.log(ntransaction)
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

export async function verifyAndRenewAccess(accesstoken: any, context: any){
  let validity = jwt.verify(accesstoken, context.env.authsigningkey)
  if (await validity){
    const { DB } = context.env as any
    const { payload } = jwt.decode(accesstoken)
    if (payload.exp === undefined) return
    const user = await User.findBy('discord_user_id', payload.userid, DB)
    const { lastaccesstoken } = user.stellar_access_token
    if (lastaccesstoken == accesstoken){
      if (payload.exp < Date.now()){
        const refreshtoken = user.stellar_refresh_token
        const newaccesstoken = await getAccessToken(refreshtoken, request, context)
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

export async function getAccountAuthorization(pubkey: string, horizonURL: string): Promise<accountAuth> {
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