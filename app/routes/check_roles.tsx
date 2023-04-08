import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { checkRoles } from "~/utils/checkRoles.server";
import { getUser } from "~/utils/session.server";
export const loader = async ({ context, request }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const { discord_user_id } = await getUser(request, sessionStorage) ?? {}
  
  // checkRoles()
  return json({ ok: true });
};