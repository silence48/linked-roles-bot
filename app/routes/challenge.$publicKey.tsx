import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { getUser } from "~/utils/session.server";
import { generateAuthChallenge } from '~/utils/stellarUtils.server';
import { Keypair } from "stellar-base";

// URL: /challenge/$public_key
export const loader = async ({ request, context, params }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const { publicKey } = params
  console.log('challenge.$publickey loader', publicKey)
  // Check if publicKey is a valid ED25519 address
  if (!publicKey) return;
  const { discord_user_id, clientState } = await getUser(request, sessionStorage)
  const { authsigningkey } = context.env as any;
  const uri = new URL(request.url).origin
  let serverKeypair = Keypair.fromSecret(String(authsigningkey));
  const challenge = await generateAuthChallenge(serverKeypair, publicKey, discord_user_id, uri, clientState)
  return json({ challenge });
};