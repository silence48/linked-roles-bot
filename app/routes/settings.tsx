import { type LoaderArgs } from "@remix-run/cloudflare";
import { Layout } from "~/components/Layout";
import { useModal } from "~/context/Modal";
import { Button } from "~/components/Button";

export const loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  return null;
};

export default function Settings() {
  const { openModal } = useModal();

  return (
    <Layout customCss="bg-neutral-600 p-[40px] rounded-md">
      <div>Settings</div>
      <Button
        onClick={() => openModal({ type: "add_account" })}
        text="Add Account"
      />
    </Layout>
  );
}
