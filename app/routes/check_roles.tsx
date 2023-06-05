import { json, type LoaderArgs } from "@remix-run/cloudflare";

export const loader = async ({ context, request }: LoaderArgs) => {
  const { checkRoles } = await import("~/utils/checkRoles.server");
  const { getUser } = await import("~/utils/session.server");
  const { jwt } = await import('@tsndr/cloudflare-worker-jwt');


  const { sessionStorage } = context as any;
  const { discord_user_id, token: access_token } = await getUser(request, sessionStorage) ?? {}
  const {payload} = jwt.decode(access_token) as any;
  const metadata = await checkRoles(context, payload.sub, discord_user_id)
  if (typeof(metadata) == 'undefined') {
    throw("there is no metadata something is broken")
  }
  try{
    const md = await checkRoles(context, payload.sub, discord_user_id) as any;
    if (md.defaultrole === 1) {
      return json({ ok: true })
    } else {
      return json({ ok: false })
    }
  }catch{
    return json({ ok: false, error: "something is borked with the discord api" });
  }
 
};