// routes/cacheaccount.tsx
import { badgeDetails } from '../utils/badge-details';
import { ActionFunction, json, redirect, LoaderArgs } from "@remix-run/cloudflare";
import styled from "@emotion/styled";
import { fetchRegisteredAccounts, generateProofs } from "../utils/sqproof";
import {fetchOperations} from "../utils/sqproof";
import { Page, Container } from "~/components";
import { useLoaderData } from '@remix-run/react';

// Define your action function
export let loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  for (const badge in badgeDetails) {
    console.log(badgeDetails[badge].issuer)
    }
  //const accountops = await fetchOperations(request, context, session.get("account"));
  // Redirect back to the root route ("/")
  return json({ badgeDetails });
  
};

export default function Index() {
    const { badgeDetails } = useLoaderData();
  
    return (
      <Page>
        <Container>
          {Object.keys(badgeDetails).map((badgeKey) => {
            const badge = badgeDetails[badgeKey];
            return (
              <div key={badgeKey}>
                <h3>{badgeKey}</h3>
                <p>Issuer: {badge.issuer}</p>
                {/* Render other badge properties as needed */}
              </div>
            );
          })}
        </Container>
      </Page>
    );
  }