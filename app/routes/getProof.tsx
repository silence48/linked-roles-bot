// routes/delink.tsx

import { type ActionFunction, redirect } from "@remix-run/cloudflare";

// Define your action function
export const action: ActionFunction = async ({ request, context }) => {
  const { fetchRegisteredAccounts, generateProofs } = await import("../utils/sqproof");

  const { sessionStorage } = context as any;
  const stellarAccounts = await fetchRegisteredAccounts(request, context);
  const accounts = stellarAccounts.map((account) => account.public_key);
  const proofs = await generateProofs(request, context, accounts);
  
  // Save proofs in session (or wherever you like)
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  session.set("proofs", proofs);
  await sessionStorage.commitSession(session);
  //sessionStorage.set("proofs", proofs);
  
  // Redirect back to the root route ("/")
  return redirect("/");
};