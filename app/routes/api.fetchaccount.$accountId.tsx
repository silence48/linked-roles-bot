import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { getUser } from "~/utils/session.server";
import { generateAuthChallenge } from '~/utils/stellarUtils.server';
import { Keypair } from "stellar-base";


export const loader = async ({ request, context, params }: LoaderArgs) => {
    const { sessionStorage } = context as any;
    const { accountId } = params
    const { DB } = context.env;
    const stmt = DB.prepare(`
    SELECT * 
    FROM balances 
    WHERE account_id = ?1 
  `);

  const records = await stmt.bind(accountId).all();

  return json(records.results);
}