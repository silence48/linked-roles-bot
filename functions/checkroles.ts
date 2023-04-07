
import { parse } from 'cookie';
import { verifyAndRenewAccess } from './auth';
import { Discord, User } from '../app/models';
//import { UserForm } from '../app/forms/UserForm';
import jwt from '@tsndr/cloudflare-worker-jwt'
//import { Horizon } from '../horizon-api'
//import { redirect } from "@remix-run/cloudflare";

interface Env {
  SESSION_STORAGE: KVNamespace;
  ROLEDATA: KVNamespace;
  authsigningkey: any;
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const cookies = context.request.headers.get("Cookie")
    const cookieHeader = parse(cookies);
    const { clientState, accesstoken } = cookieHeader;
    const { payload } = jwt.decode(accesstoken);
    const { discord_user_id } = payload;
    const public_key = payload.sub
    console.log(`checking role asset ownership for: ${public_key}`);
    try{
      verifyAndRenewAccess(accesstoken, context);
      const user = await User.findOne('discord_user_id', discord_user_id, context.env.DB);
      console.log(user);
      const roles = await checkRoles(context, public_key, discord_user_id);
      console.log(roles);
      const ourURL = new URL(context.request.url).origin;
      const claimURL = new URL('/defaultclaim', ourURL).toString();
     return Response.redirect(claimURL, 301);

  //    return redirect(claimURL, {
   //     status: 301,
    //    headers: {
          //"Set-Cookie": `clientState=${state}; Max-Age=300000;}`,
  //      },
 //   }
    

    
    } catch{
      return new Response("You are not logged in", {status: 401})
    }
  }

async function checkRoles(context, publickey, discord_user_id){
  let server = context.env.horizonURL
  //const account: Horizon.AccountResponse = await (await fetch(`${server}/accounts/${publickey}`)).json()
  const account: any = await (await fetch(`${server}/accounts/${publickey}`)).json()
  //const balances: Horizon.BalanceLine[] = account.balances
  const balances: any = account.balances
  
  console.log(JSON.stringify(account.balances));
  //todo: get the roles and assets from the kv store
  let theAssets: Array<Array<string>> = [
    ["DefaultRole", context.env.botpubkey],
  ]
  var metadata = {
    defaultrole: 0,
  }

  function updateMetadata(role: string){
    switch(role){
      case 'defaultrole':
      console.log('found defaultrole')
      metadata.defaultrole = 1
    }}
    
    try{
      balances.map(async(balance)=>{
        for (let asset in theAssets){
          let AssetCode: string = theAssets[asset][0];
          let AssetIssuer: string = theAssets[asset][1];
          console.log(`the asset ${AssetCode}:${AssetIssuer} is being checked against ${JSON.stringify(balance)}\n`)
          if( balance.asset_code == AssetCode && balance.asset_issuer == AssetIssuer ){
            console.log(`i found the ${AssetCode}:${AssetIssuer} in account ${publickey}`)
            updateMetadata(AssetCode)
          }
        }
        });
        console.log(JSON.stringify(metadata))
        await Discord.pushMetadata(discord_user_id, metadata, context)
      }
    catch(err: any){
      console.error('therewas an error\n', err)
    }
  }