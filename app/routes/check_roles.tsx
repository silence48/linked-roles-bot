import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { checkRoles } from "~/utils/checkRoles.server";
import { getUser } from "~/utils/session.server";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { Discord } from "~/models";
export const loader = async ({ context, request }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const { discord_user_id, token: access_token } = await getUser(request, sessionStorage) ?? {}
  const {payload} = jwt.decode(access_token) as any;
  const metadata = await checkRoles(context, payload.sub, discord_user_id)
  if (typeof(metadata) == 'undefined') {
    throw("there is no metadata something is broken")
  }
  try{
    await Discord.pushMetadata(discord_user_id, metadata, context.env);
    return json({ ok: true });
  }catch{
    return json({ ok: false, error: "something is borked with the discord api" });
  }
  
 
};