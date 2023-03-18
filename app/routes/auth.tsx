import type { LinksFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import {
  Link,
  Outlet,
  useLoaderData,
} from "@remix-run/react";

export const loader = async () => {
  return json({

  })
}

export default function AuthRoute() {
  return <Outlet />
}