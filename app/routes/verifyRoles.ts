
import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { fetchRegisteredAccounts } from "~/utils/sqproof";

import type { UserBadgeDetail } from "~/types";

interface Env {
  DB: D1Database;
  ROLEDATA: KVNamespace;
}

export let loader = async ({ request, context }: LoaderArgs) => {
  const { getUser } = await import("~/utils/session.server");
  const { Discord } = await import("linked-roles-core");
  const { badgeDetails } = await import("../utils/badge-details");

  const { discord_user_id } = await getUser(request, context.sessionStorage);

  const { env } = context as any;
  const SCFTIERKV: KVNamespace = env.ROLEDATA;
  const scfmembers = await SCFTIERKV.get("SCFTIERS", "json")
  
  let tier = 0

  const member = scfmembers.members.find(member => member.id === discord_user_id);
    if (member) {
      tier = member.tier;
      console.log(`Tier for member ${discord_user_id} is ${member.tier}`);
    } else {
      console.log(`No member found with id ${discord_user_id}`);
    }

  
  const DB: D1Database = env.DB;
  const stmt = DB.prepare(`
      SELECT * 
      FROM balances 
      WHERE account_id = ?1 
    `);

  const accounts = await fetchRegisteredAccounts(request, context);
  console.log('acounts in testr')
  console.log(accounts)
  const userpubkeys = accounts.map(account => account.public_key);
  console.log(userpubkeys)

  const userBalancesPromises = userpubkeys.map(async (publicKey) => {
    return stmt.bind(publicKey).all();
  })
  const userBalances = await Promise.all(userBalancesPromises);
  const userBalancesResults = userBalances.flatMap(balance => balance.results);

  //console.log(userBalancesResults);
  const userOwnedBadges: UserBadgeDetail[] = badgeDetails.filter(badge =>
    userBalancesResults.some(balance =>
      balance.asset_id === badge.code && balance.issuer_id === badge.issuer
    )
  );
  // Add new keys to owner_details object
  userOwnedBadges.forEach(badge => {
    const balance = userBalancesResults.find(b => b.asset_id === badge.code && b.issuer_id === badge.issuer);
    badge.owner_details = {
      date_acquired: balance.date_acquired,
      tx_id: balance.tx_id,
      id: balance.id,
      public_key: balance.account_id
    };
  });
  const soroban = userOwnedBadges.filter((item) => item.soroban === true);
  const sorobanCount = soroban.length;
  const classicCount = userOwnedBadges.length - sorobanCount;
  const metadata = {
    sorobanquest: sorobanCount,
    stellarquest: classicCount,
    scftier: tier
  };
/*
const currentmd = await Discord.getMetadata(discord_user_id, null, context.env)
  console.log('current metadata')
  console.log(currentmd)
  */
  console.log(metadata, 'metadata')
  const pushed = await Discord.pushMetadata(discord_user_id, metadata, context.env);
  console.log(pushed, "PUSHED")
  //console.log(userOwnedBadges);

  return json({ userOwnedBadges, sorobanCount, classicCount, tier });
}