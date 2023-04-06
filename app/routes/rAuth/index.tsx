import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
    return json({

    })
}

export default function AccountId() {
    // useLoaderData returns the json object from the loader; 
    // const data = useLoaderData();

    return (
      <main>
        <h1>AccountID</h1>
      </main>
    );
  }