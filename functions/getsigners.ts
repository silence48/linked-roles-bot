/*
import {
    Keypair,
    TransactionBuilder,
    Networks,
    BASE_FEE,
    Operation,
    Account,
    xdr
  } from 'stellar-base';
  //import { Buffer } from "buffer-polyfill";
  import { Transaction } from '../node_modules/stellar-base/types/index';
  import jwt from '@tsndr/cloudflare-worker-jwt'
  import { parse } from 'cookie';
  import { redirect } from "@remix-run/cloudflare";
  */
  //import * as horizon from "../horizon-api"
  //found the fix for polyfilling buffer like this from https://github.com/remix-run/remix/issues/2813
  //globalThis.Buffer = Buffer as unknown as BufferConstructor;
  interface Env {
    SESSION_STORAGE: KVNamespace;
    authsigningkey: any;
    DB: D1Database;
  }

export const onRequestGet: PagesFunction<Env> = async (context) => {

    type signer = {
    pubkey: string,
    weight: number
  }
  interface accountAuth{
    signers: [signer],
    threashold: [number, number, number]
  }

  async function getAuthorizedSigners(pubkey) {
    const horizonURL = "https://horizon.stellar.org";
    const url = horizonURL + "/accounts/" + pubkey;
    const init = {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    };
    const response = await fetch(url, init);
    //const json: horizon.Horizon.AccountResponse = await response.json()
    const json: any = await response.json()
    console.log(json.signers)
    return json.signers
  }
//~~~~~~~~~~~~~~~~~~~//
    const request = context.request
    const { searchParams } = new URL(request.url);
    const account = searchParams.get('account');
    let accounttest = await getAuthorizedSigners(account)
    return new Response(JSON.stringify(await accounttest), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

