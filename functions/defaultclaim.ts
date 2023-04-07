import { PagesFunction } from "@cloudflare/workers-pages";
import { Keypair, TransactionBuilder, BASE_FEE, Asset, Networks, Operation } from "stellar-base";
import jwt, { JwtPayload } from '@tsndr/cloudflare-worker-jwt'
import Buffer from "buffer-polyfill";
interface Env {
    SESSION_STORAGE: KVNamespace;
    authsigningkey: any;
    DB: D1Database;
  }

globalThis.Buffer = Buffer as unknown as BufferConstructor;

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const accessToken = context.request.headers.get("Cookie")?.match(/accesstoken=([^;]+)/)?.[1];
    if (!accessToken) {
      return new Response("Missing access token", { status: 400 });
    }
    const serverPublicKey = context.env.botpubkey;
    const serverSecretKey = context.env.serversecretkey;
    const validity = jwt.verify(accessToken, serverSecretKey);
    const decoded: JwtPayload = jwt.decode(accessToken);
    if (!validity) {
      return new Response("Invalid JWT", { status: 400 });
    }

    const userPublicKey = decoded.sub;

    const serverKeypair = Keypair.fromSecret(serverSecretKey);

    const defaultRole = new Asset("defaultrole", serverPublicKey);

    const transaction = new TransactionBuilder(serverKeypair, {
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

    return new Response(xdr, { status: 200, headers: { "Content-Type": "text/plain" } });
  } catch (err) {
    console.error(err);
    return new Response("Error processing request", { status: 500 });
  }
};