
import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { fetchRegisteredAccounts } from "~/utils/sqproof";

import { useLoaderData } from "@remix-run/react";
import { VerificationGrid } from "~/components/VerificationGrid";
import type { UserBadgeDetail } from "~/types";
  
export let loader = async ({ request, context }: LoaderArgs) => {
    const { badgeDetails, seriesFourIssuers } = await import(
        "../utils/badge-details"
      );
      const { DB } = context.env;
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

console.log(userBalancesResults);
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
  
  console.log(userOwnedBadges);

      return json({ userOwnedBadges });
}

export default function Index() {
    const { userOwnedBadges } = useLoaderData();
return (
    <>
   <VerificationGrid badges={userOwnedBadges} />
    {/* <Card badge={badgeDetails[0]} />*/}
    </>
);
}
