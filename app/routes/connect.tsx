import { ImportAccount } from "~/templates/ImportAccount";
import { json } from "@remix-run/cloudflare";

export const loader = async (

) => {
  return json({ ok: true });
};

export default function Index() {
  return (
      <ImportAccount />
  );
}

