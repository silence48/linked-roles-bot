import { type ActionFunction, redirect } from "@remix-run/cloudflare";

// Define your action function
export const action: ActionFunction = async ({ request, context }) => {
  //const { StellarAccount } = await import("linked-roles-core");
  const { StellarAccount } = await import ('~/LRC/models/StellarAccount');
  // const { fetchRegisteredAccounts } = await import("../utils/sqproof");
  // const { sessionStorage } = context as any;
  // const accounts = await fetchRegisteredAccounts(request, context);
  if (request.method === "POST") {
    const formData = await request.formData();
    const publicKey = formData.get("publicKey");
    console.log(publicKey);
    const { DB } = context.env as any;
    //should we make this account not be active or something else rather than deleting it?
    const account = await StellarAccount.findBy("public_key", publicKey, DB);

    await StellarAccount.delete(account[0].id, DB);

    // Redirect back to the root route ("/")
    return redirect("/");
  }
};
