import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { checkRoles } from "~/utils/checkRoles.server";
import { getUser } from "~/utils/session.server";
import jwt from '@tsndr/cloudflare-worker-jwt';
export const loader = async ({ context, request }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const { discord_user_id, token: access_token } = await getUser(request, sessionStorage) ?? {}
  const {payload} = jwt.decode(access_token) as any;
  const metadata = await checkRoles(context, payload.sub, discord_user_id)
  if (typeof(metadata) == 'undefined') {
    throw("there is no metadata something is broken")
  }
  try{
    const md = await checkRoles(context, payload.sub, discord_user_id)
    return md;
  }catch{
    return json({ ok: false, error: "something is borked with the discord api" });
  }
 
};