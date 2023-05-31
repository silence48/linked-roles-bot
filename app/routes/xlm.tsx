// routes/cacheaccount.tsx
import { badgeDetails } from '../utils/badge-details';
import { ActionFunction, json, redirect, LoaderArgs, LinksFunction } from "@remix-run/cloudflare";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { fetchRegisteredAccounts, generateProofs, getOriginalClaimants, getOriginalPayees } from "../utils/sqproof";
import { fetchOperations } from "../utils/sqproof";
import { Page, Container } from "~/components";
import { useLoaderData } from '@remix-run/react';
import { Balance } from "../models";
import { BalanceForm } from "~/forms";
import React, { useState, useEffect } from 'react';
//import { ProjectLogo, TextLink, TextLinkVariant, NavButton, Layout, ToggleDarkMode, IconButton, IconButtonPreset, IconButtonVariant, Icon } from '../components'
import {Cartel} from "communi-design-system";
//import {Layout, TextLink} from "xlm-design-system";


export let loader = async ({ request, context }: LoaderArgs) => {

        const { sessionStorage } = context as any;
        const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    
        const { DB } = context.env as any;
    
        // this updates and caches all the data to the database, ignore it
    
        //for (const badge in badgeDetails) {
        //await getOriginalPayees("production", context, badgeDetails[badge].issuer, badgeDetails[badge].code);
        //}
    
        return json({ badgeDetails });
    };

export default function Index() {
    const { badgeDetails } = useLoaderData();
    const handleDarkModeToggleEnd = (isDarkMode: boolean) => {
      console.log(`Dark mode is now ${isDarkMode ? 'enabled' : 'disabled'}`);
    };
  
    const handleSignOut = () => {
      console.log('Signing out...');
    };
  
    const handleMenuOpen = () => {
      console.log('Opening menu...');
    };
  
    return (
      <>
        <Layout.Header
          projectTitle="My Project"
          projectLink="https://myproject.com"
          hasDarkModeToggle={true}
          onDarkModeToggleEnd={handleDarkModeToggleEnd}
          onSignOut={handleSignOut}
          showButtonBorder={true}
          menu={{
            isEnabled: true,
            onOpen: handleMenuOpen,
          }}
          contentCenter={<TextLink >Center Content</TextLink>}
          contentRight={<TextLink >Right Content</TextLink>}
        />
        <Layout.Content>
          <p>This is the main content of the page.</p>
        </Layout.Content>
        <Layout.Footer
          marginTop="2rem"
          hideLegalLinks={false}
          hideTopBorder={false}
          gitHubLink="https://github.com/myproject"
          gitHubLabel="My Project on GitHub"
        >
          
        </Layout.Footer>
      </>
    );
}