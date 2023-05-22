import { Networks } from 'stellar-base';
import { handleResponse } from './scfapi';
import { badgeDetails, seriesFourIssuers } from './badge-details';
import jwt from "@tsndr/cloudflare-worker-jwt";
import { getrefreshtoken, getaccesstoken } from "~/utils/auth.server";
import { Horizon } from 'horizon-api';

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
    return token;
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