import { json, type LoaderArgs } from "@remix-run/cloudflare";

// URL: /challenge/$public_key 
export const loader = async ({ request, context, params }: LoaderArgs) => {
  const {getUser} = await import("~/utils/session.server");
  const {generateAuthChallenge} = await import("~/utils/stellarUtils.server");
  const { Keypair } = await import("stellar-base");
  const { sessionStorage } = context as any;
  const { publicKey } = params
  console.log('challenge.$publickey loader', publicKey)
  // Check if publicKey is a valid ED25519 address
  if (!publicKey) return;
  const { discord_user_id, clientState } = await getUser(request, sessionStorage)
  console.log('challenge.$publickey loader', discord_user_id, clientState)
  const { authsigningkey } = context.env as any;
  console.log("authsigningkey", authsigningkey)
  const uri = new URL(request.url).origin
  console.log('Keypair', Keypair)
  let serverKeypair = Keypair.fromSecret(String(authsigningkey));
  const challenge = await generateAuthChallenge(serverKeypair, publicKey, discord_user_id, uri, clientState)
  return json({ challenge });
};