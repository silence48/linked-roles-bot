import { Networks, TransactionBuilder } from 'stellar-base';
import { handleResponse } from './scfapi';
import { badgeDetails } from './badge-details';
import jwt from "@tsndr/cloudflare-worker-jwt";
import { Horizon } from 'horizon-api';
import { Discord, StellarAccount } from '~/models';
import { getUser } from './session.server';
import {Balance, Cursor } from '~/models';
import {BalanceForm, CursorForm} from '~/forms';
import { Model } from '~/models/model-one';


export async function fetchRegisteredAccounts(request: Request, context: any) {
  const { DB } = context.env as any;
  const { discord_user_id } = await getUser(request, context.sessionStorage);
  const stellarAccounts = await StellarAccount.findBy("discord_user_id", discord_user_id, DB);
  return stellarAccounts;
}
export async function getAccessToken(account: string, request: Request, context: any) {
  const { DB } = context.env as any;
  const { discord_user_id } = await getUser(request, context.sessionStorage);
  const record = await StellarAccount.findBy("public_key", account, DB);
  return record[0].refresh_token;
}
export async function generateProofs(request: Request, context: any, accounts: string[]) {
  const { sessionStorage } = context as any;
  const user = await getUser(request, sessionStorage);
  const { discord_user_id } = user ?? false;

  const proofs = [];
  var totalSorobanQuestCodes = 0;
  var totalStellarQuestCodes = 0;
  for (const account of accounts) {
    const accesstoken = await getAccessToken(account, request, context);
    const decoded = await jwt.decode(accesstoken)
    let passphrase: Networks = Networks.PUBLIC;
    let transaction = new (TransactionBuilder.fromXDR as any)(decoded.payload.xdr, passphrase);
    const signature = transaction.signatures[0].signature().toString("base64");
    const token = await getVerificationToken(account, 'production', transaction, signature);
    proofs.push(token);
    totalSorobanQuestCodes += token.soroban.length;
    totalStellarQuestCodes += token.userBadges.length;
  }
  console.log(proofs, 'THE PROOFS')

  const metadata = {
    sorobanquest: totalSorobanQuestCodes,
    stellarquest: totalStellarQuestCodes
  };

  console.log(metadata, 'metadata')
  const pushed = await Discord.pushMetadata(discord_user_id, metadata, context.env);
  console.log(pushed, "PUSHED")

  return proofs;
}

export async function generateVerificationHash(verificationObject: any) {
  let jsonString = JSON.stringify(verificationObject);
  let hash = await crypto.subtle.digest('SHA-256', Buffer.from(jsonString));
  let hashHex = Buffer.from(hash).toString('hex');
  return hashHex;
}

let generateVerificationOperations = (assets: any[]) => {
  return assets.reduce((acc, item, i, a) => {
    return acc.concat(item.operation);
  }, []);
};

export const horizonUrl = (env: any) =>
  env === 'production'
    ? 'https://horizon.stellar.org'
    : 'https://horizon-testnet.stellar.org';

export const networkPassphrase = (env: any) =>
  env === 'production' ? Networks['PUBLIC'] : Networks['TESTNET'];

// 12/13/2023
export const DEADLINE = 1702486141;

export const stellarNetwork = (env: any) =>
  env === 'production' ? 'PUBLIC' : 'TESTNET';

export const stellarExpertTxLink = (hash: string, env: any) =>
  `https://stellar.expert/explorer/${stellarNetwork(
    env,
  ).toLowerCase()}/tx/${hash}`;



export async function fetchOperations(
  env: any,
  account: string,
) {
  return fetch(
    horizonUrl(env) +
      `/accounts/${account}/operations?limit=200&order=desc&include_failed=false`,
  ).then(handleResponse);
}

export async function fetchOperation(
  env: any,
  operationId: string,
) {
  return fetch(horizonUrl(env) + `/operations/${operationId}`).then(
    handleResponse,
  );
}



export async function getVerificationToken(
    pubkey: string,
    env: any,
    message: any,
    signature: any,
  ) {
    let accountOperations: any  = [];
    let opRes: any = await fetchOperations(env, pubkey);
    if (opRes.status === 404) {
      return ;
    }
    console.log('opRes', opRes)
    let iter = 0
    while (
      accountOperations.length % 200 === 0 ||
      opRes._embedded.records.length !== 0 
    ) {
      //handle extremely large accounts
      if (iter> 1000){break}
      accountOperations= accountOperations.concat(opRes._embedded.records);
      opRes = await fetch(opRes['_links'].next.href).then(handleResponse);
      iter += 1
    }
  
    const badgePayments = accountOperations
      .filter(
        (item: any) => item.type === 'payment' && item.asset_type !== 'native',
      )
      .filter((item: any) =>
        badgeDetails.find(
          ({ code, issuer }) => item.asset_code === code && item.from === issuer,
        ),
      );
  
    const badgeOperations = accountOperations
      .filter(
        (item: any) =>
          item.type === 'create_claimable_balance' &&
          item.claimants.some((e: any) => e.destination === pubkey),
      )
      .filter((item: any) =>
        badgeDetails.find(
          ({ code, issuer }) =>
            item.asset.split(':')[0] === code &&
            item.asset.split(':')[1] === issuer,
        ),
      );
  
    let allBadges = await Promise.all(
      badgeDetails.map(async (item) => {
        let payment;
        if (/^SSQ0[234]|SQ040[1-6]$/.test(item.code)) {
          payment = badgeOperations.find(
            ({ asset, source_account }: any) =>
              item.code === asset.split(':')[0] &&
              item.issuer === source_account &&
              item.issuer === asset.split(':')[1],
          );
        } else {
          payment = badgePayments.find(
            ({ asset_code, from }: any) =>
              item.code === asset_code && item.issuer === from,
          );
        }
        if (!payment) return item;
        return {
          ...item,
          owned: true,
          date: new Date(payment.created_at).toISOString().split('T')[0],
          hash: payment.transaction_hash,
          operation: payment.id,
          prize: await getPrizeTransaction(payment.transaction_hash, env),
        };
      }),
    );
    let userBadges = allBadges.filter((item) => item.owned === true);
    console.log(userBadges)
    let soroban = userBadges.filter((item) => item.soroban === true);
    console.log(soroban)
    console.log(soroban.length)
    console.log('user badges - soroban badges', userBadges.length - soroban.length)
    let verificationObject = {
      p: pubkey,
      m: message,
      s: signature,
      d: new Date(),
      o: generateVerificationOperations(userBadges),
    };
  
    const hash = await generateVerificationHash(verificationObject);
    let finalArray = new Array(JSON.stringify(verificationObject), hash);
    let token = Buffer.from(finalArray.join(',')).toString('base64');
    console.log(token)
    return {token, userBadges, soroban};
  }

  
async function getPrizeTransaction(hash: string, env: any) {
  let res = await fetch(
    horizonUrl(env) + '/transactions/' + hash + '/operations',
  );
  let json: any = await res.json();
  let prizeRecord = json._embedded.records.filter(
    (item: any) =>
      item.hasOwnProperty('asset_type') && item.asset_type === 'native',
  );
  return prizeRecord.length > 0 ? parseInt(prizeRecord[0].amount) : false;
}
export async function fetchPayments(
  env: any,
  issuer: string,
) {
  return fetch(
    horizonUrl(env) +
    `/accounts/${issuer}/payments?limit=100&order=desc&include_failed=false`,
  ).then(handleResponse);
}

export async function getOriginalClaimants(
  env: any,
  context: any,
  issuer: any,
  assetid: any,
) {
  const { DB } = context.env;
  return null
}

export async function getOriginalPayees(
  env: any,
  context: any,
  issuer: any,
  assetid: any,
) {
  const { DB } = context.env;
  let accountPayments: any  = [];
  let owners: [{asset_id?: string, account_id?: string, balance?: string, date_acquired?: string }] = [{}];
  let paymentResponse: any  = await fetchPayments(env, issuer);
  if (paymentResponse.status === 404) {
    return ;
  }
  //console.log('paymentResponse', paymentResponse._embedded.records)
  let iter = 0
  let needsNext = false
  let nextcursor = "blank"
  while (
    paymentResponse.length % 200 === 0 ||
    paymentResponse._embedded.records.length !== 0 
  ) {
    //handle extremely large accounts
    console.log(iter, "iter")
    if (iter > 100){
      needsNext = true;
      nextcursor = paymentResponse['_links'].next.href
      break}
    accountPayments = accountPayments.concat(paymentResponse._embedded.records);
    console.log(assetid, iter)
    let balanceForms = [];
    for (let record in paymentResponse._embedded.records){
      if (paymentResponse._embedded.records[record].asset_code === assetid){
        const balanceid = paymentResponse._embedded.records[record].id;
        const balanceExists = (await Balance.findBy("balance_id", balanceid, DB )).length;
    
        if (!balanceExists){
          const balanceForm = new BalanceForm(
            new Balance({
              balance_id: paymentResponse._embedded.records[record].id,
              asset_id: assetid, 
              account_id: paymentResponse._embedded.records[record].to,
              balance: paymentResponse._embedded.records[record].amount,
              date_acquired: paymentResponse._embedded.records[record].created_at,
            })
          );
    
        balanceForms.push(balanceForm);
        // await Balance.create(balanceForm, DB)
        }

        owners.push({asset_id: assetid, 
                     account_id: paymentResponse._embedded.records[record].to,
                     balance: paymentResponse._embedded.records[record].amount,
                     date_acquired: paymentResponse._embedded.records[record].created_at,
                    })
      }
    }
    const preparedStatements = balanceForms.map((form) => {
      const { keys, values } = Model.deserializeData(form.data);  // Assuming Model is imported
    
      return DB.prepare(
        `INSERT INTO balances (${keys}, created_at, updated_at)
         VALUES(${values}, datetime('now'), datetime('now')) RETURNING *;`
      );
    });
    //console.log(preparedStatements)
    await DB.batch(preparedStatements);

    
    paymentResponse = await fetch(paymentResponse['_links'].next.href).then(handleResponse);
    iter += 1
  }


  //console.log('accountPayments', accountPayments)
  //console.log('owners', owners)
  //console.log(nextcursor)
  return { owners, nextcursor };
}