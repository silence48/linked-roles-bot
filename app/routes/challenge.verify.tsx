import { type ActionArgs } from "@remix-run/cloudflare";

export async function action({ request, context, params }: ActionArgs) {
  const jwt = await import("@tsndr/cloudflare-worker-jwt");
  const { User, StellarAccount } = await import("~/models");
  const { updateUserSession, getUser } = await import("~/utils/session.server");
  const { parse } = await import("cookie");
  const { TransactionBuilder, Networks } = await import("stellar-base");
  const { getrefreshtoken, getaccesstoken } = await import("~/utils/auth.server");
  const { AccountForm } = await import("~/forms");

  const { sessionStorage } = context as any;
  const body = await request.formData();
  const signedEnvelope = body.get("signed_envelope_xdr");
  console.log(`from challenge.verify - action - signedEnvelope ${signedEnvelope}`);
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") as any;
  const cookies = request.headers.get("Cookie") ?? null;
  if (!cookies) return null;
  const cookieHeader = parse(cookies);
  const { clientState } = cookieHeader;
  const { discord_user_id } = (await getUser(request, sessionStorage)) ?? {};
console.log(`in challenge verify ${discord_user_id}`)
  let areq = {
    Transaction: signedEnvelope,
    NETWORK_PASSPHRASE: Networks.PUBLIC,
    discord_user_id: discord_user_id
  };
  const { Transaction, NETWORK_PASSPHRASE } = areq;
  let passphrase: Networks = Networks.PUBLIC;
  if (NETWORK_PASSPHRASE) {
    passphrase = NETWORK_PASSPHRASE;
  }


  const { DB } = context.env as any;
  let transaction = new (TransactionBuilder.fromXDR as any)(Transaction, passphrase);
  //verify the state.
  const decoder = new TextDecoder();
  let authedstate = decoder.decode(transaction.operations[0].value);
  console.log(`from challenge.verify - action - authedstate ${authedstate} - clientState ${clientState}`);
  console.log(`the auth request is ${JSON.stringify(areq)}`);
  if (clientState !== authedstate) {
    let errmsg = JSON.stringify("State verification failed.");
    return new Response(errmsg, {
      status: 403,
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  }

  const refreshtoken = await getrefreshtoken(transaction, request, context);

  if (refreshtoken != false) {
    const userExists = (await User.findBy("discord_user_id", discord_user_id, DB)).length;
    console.log(`from challenge.verify - action - userExists ${userExists}`)
    const accesstoken = await getaccesstoken(refreshtoken, request, context);
    if (accesstoken) {
      const { payload } = jwt.decode(refreshtoken)
      console.log('chk2 in auth.ts function')
      console.log(`the user table object is ${JSON.stringify(await User.findBy('discord_user_id', discord_user_id, DB))}`)

      if (!userExists) {
        const errmsg = JSON.stringify("User does not exist.");
        return new Response(errmsg, {
          status: 403,
          headers: {
            "content-type": "application/json;charset=UTF-8",
          },
        });
      } else {
        const user = await User.findBy("discord_user_id", discord_user_id, DB);
        const stellarAccounts = await StellarAccount.findBy("discord_user_id", discord_user_id, DB);
        const userOwnedAccounts = stellarAccounts.length;
        console.log(`the ${userOwnedAccounts} accounts are ${JSON.stringify(stellarAccounts)}`)
        let publickey = transaction.source;
        console.log(`the publickey is ${publickey}`)
        let accountRecord = await StellarAccount.findBy("public_key", publickey, DB);
        console.log(`the accountRecord is ${JSON.stringify(accountRecord)}`)
        // check if the account has already been registered to a different user.
        if ((accountRecord.length != 0) && (accountRecord[0].discord_user_id != discord_user_id)) {

          //take other action like ban the user.
          const errmsg = JSON.stringify("Account is owned by a different discord user!");
          return new Response(errmsg, {
            status: 403,
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
          });
        };
        // then update or create the registration.
        if (accountRecord.length != 0) {
          stellarAccounts[userOwnedAccounts].discord_user_id = discord_user_id;
          stellarAccounts[userOwnedAccounts].public_key = publickey;
          stellarAccounts[userOwnedAccounts].access_token = accesstoken;
          stellarAccounts[userOwnedAccounts].refresh_token = refreshtoken;
          console.log(await StellarAccount.update(stellarAccounts[userOwnedAccounts], DB));
        } else {
          const accountForm = new AccountForm(
            new StellarAccount({
              discord_user_id: discord_user_id,
              public_key: publickey,
              access_token: accesstoken,
              refresh_token: refreshtoken,
            })
          );
          console.log(`the accountForm is ${JSON.stringify(accountForm)}`)

          console.log(await StellarAccount.create(accountForm, DB));

        }

        let responsetext = JSON.stringify({ token: accesstoken });

        // add provider
        if (!provider) return;
        return updateUserSession(
          request,
          sessionStorage,
          { isAuthed: true, token: accesstoken, provider },
          { redirectTo: "/" }
        );
      }
    } else {
      let errortext = JSON.stringify({
        error: "The provided transaction is not valid",
      });
      return new Response(errortext, {
        status: 401,
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    //let authedstate = transaction.operations[0].value
    // Verify auth

    // Generate JWT

    // Store as a Token
  }
}