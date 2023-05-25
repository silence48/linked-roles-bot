// routes/cacheaccount.tsx
import { badgeDetails } from '../utils/badge-details';
import { ActionFunction, json, redirect, LoaderArgs } from "@remix-run/cloudflare";
import styled from "@emotion/styled";
import { fetchRegisteredAccounts, generateProofs } from "../utils/sqproof";
import {fetchOperations} from "../utils/sqproof";
import { Page, Container } from "~/components";
import { useLoaderData } from '@remix-run/react';
import { getOriginalPayees } from '../utils/sqproof';
import {Balance} from "../models";
import {BalanceForm} from "~/forms";

// Define your action function
export let loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const {owners, nextcursor} = await getOriginalPayees("production", context, "GBM43D3V7UFKD6KDH3FVERBIMKPIFEZO7STTEEHGWPEBJQJ5YDEX2LVO", "SQ0601" );
  const { DB } = context.env as any;

  //for (const badge in badgeDetails) {

  //  console.log(badgeDetails[badge].issuer)
  //  }
  //const accountops = await fetchOperations(request, context, session.get("account"));
  // Redirect back to the root route ("/")
  return json({ owners, nextcursor });
  
};

export default function Index() {

    const { owners, nextcursor } = useLoaderData();
  
    return (
      <Page>
        <Container>
            <p>{nextcursor}</p>
          {Object.keys(owners).map((pos) => {
            const owner = owners[pos];
            return (
              <div key={pos}>
                <p>{owner.account_id}</p>
                {/* Render other badge properties as needed */}
              </div>
            );
          })}
        </Container>
      </Page>
    );
  }