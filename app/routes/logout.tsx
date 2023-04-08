import { type LoaderArgs } from "@remix-run/cloudflare";
import { logout } from "~/utils/session.server";

export const loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  
  return logout(request, sessionStorage)
};