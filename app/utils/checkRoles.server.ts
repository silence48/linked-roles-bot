import { Discord } from '~/models';
import type { Horizon } from '~/types';

export async function checkRoles(context: any, publickey: string, discord_user_id: string) {
  console.log('excessively logging the flow and now were in the role check function');
  let server = context.env.horizonURL;
  console.log(`${server}/accounts/${publickey}`)
  const account: Horizon.AccountResponse = await (
    await fetch(`${server}/accounts/${publickey}`)
  ).json();
  const balances: Horizon.BalanceLine[] = account.balances;

  console.log(JSON.stringify(account.balances));
  //todo: get the roles and assets from the kv store
  let theAssets: Array<Array<string>> = [
    //todo: store this as an envvar
    ["defaultrole", context.env.botpubkey],
  ];
  var metadata = {
    defaultrole: 0,
  };
  //

  function updateMetadata(role: string) {
    switch (role) {
      case "defaultrole":
        console.log("found defaultrole");
        metadata.defaultrole = 1;
    }
  }

  try {
    balances.map(async (balance) => {
      for (let asset in theAssets) {
        let AssetCode: string = theAssets[asset][0];
        let AssetIssuer: string = theAssets[asset][1];
        console.log(
          `the asset ${AssetCode}:${AssetIssuer} is being checked against ${JSON.stringify(
            balance
          )}\n`
        );
        if (
          balance.asset_code == AssetCode &&
          balance.asset_issuer == AssetIssuer
        ) {
          console.log(
            `i found the ${AssetCode}:${AssetIssuer} in account ${publickey}`
          );
          updateMetadata(AssetCode);
        }
      }
    });
    console.log(JSON.stringify(metadata));
    const pushed = await Discord.pushMetadata(discord_user_id, metadata, context.env);
    console.log(pushed, "PUSHED")
    return pushed
    //return metadata; 

  } catch (err: any) {
    console.error("therewas an error\n", err);
  }
}
