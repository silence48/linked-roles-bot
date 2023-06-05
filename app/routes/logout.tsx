import { type LoaderArgs } from "@remix-run/cloudflare";


export const loader = async ({ request, context }: LoaderArgs) => {
  const { logout } = await import("~/utils/session.server");
  const { sessionStorage } = context as any;
  
  return logout(request, sessionStorage)
};