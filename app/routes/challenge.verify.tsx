import { json, type ActionArgs } from "@remix-run/cloudflare";
import { TransactionBuilder } from "stellar-base";
import { parse } from 'cookie';
import { updateUserSession } from "~/utils/session.server";

export async function action({ request, context }: ActionArgs) {
  const { sessionStorage } = context as any;
  const body = await request.formData();
  const signedEnvelope = body.get("signed_envelope_xdr");
  const cookies = request.headers.get("Cookie") ?? null
  if (!cookies) return null;
  const cookieHeader = parse(cookies);
  const { clientState } = cookieHeader;

  const transaction = new (TransactionBuilder.fromXDR as any) (signedEnvelope, 'Test SDF Network ; September 2015')
  let authedstate = transaction.operations[0].value
  // Verify auth

  // Generate JWT

  // Store as a Token
  return updateUserSession(request, sessionStorage, { isAuthed: true }, { redirectTo: '/claim'})
}