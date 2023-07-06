import type { V2_MetaFunction , LinksFunction, LoaderArgs } from "@remix-run/cloudflare";

import {
  Links,
  useRouteError,
  isRouteErrorResponse,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Link,
} from "@remix-run/react";
import React from "react";
import { ModalProvider, WalletProvider, useModal } from "~/context";
import { json } from "@remix-run/cloudflare";


import {fetchRegisteredAccounts} from '~/utils/sqproof'
import tailwind from '~/styles/main.css'

export const meta: V2_MetaFunction  = () => ([
  {title: "CommuniDAO"},
  { name: 'color-scheme', content: 'light only'}
]);


export const links: LinksFunction = () => ([
  { rel: "stylesheet", href: tailwind },
]);


export const loader = async ({ request, context }: LoaderArgs) => {
  const { getUser, isDiscordAuthed } = await import("~/utils/session.server");
  const { sessionStorage, env } = context as any;
  const { STELLAR_NETWORK } = env;

  const discordAuthed = await isDiscordAuthed(request, sessionStorage)
  const { provider, account, discord_user_id } = (await getUser(request, sessionStorage)) ?? {};
  console.log(account, 'account in root')
  
  let userStellarAccounts
  let discordUser = null;
  if (discordAuthed) {
    userStellarAccounts = await fetchRegisteredAccounts(request, context);
    console.log('fetchhing discord stuff')
    const response = await fetch(`https://discord.com/api/v8/users/${discord_user_id}`, {
      headers: {
        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`
      }
    });
    if (!response.ok) throw new Error('Discord API error');
    discordUser = await response.json();
  } else {
    userStellarAccounts = []
  }
  const walletAuthed=true
  console.log(userStellarAccounts, 'userStellarAccounts in root')
  console.log(discordAuthed, 'discordAuthed in root')
  return json({
    userStellarAccounts,
//    proofs,
    discordUser,
    discordAuthed,
    walletAuthed,
    provider,
    account,
    STELLAR_NETWORK,
  });
};

const UserMenu = ({ discordUser }) => {
  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
        {discordUser ? (
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={`https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`} alt={discordUser.username} />
            </div>
          </div>
        ) : (
          <div className="bg-neutral-focus text-neutral-content rounded-full w-12"></div>
        )}
      </label>
      <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52" style={{ zIndex: 9999 }}>
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li>
          <a>Settings</a>
        </li>
        <li>
          <a>Logout</a>
        </li>
      </ul>
    </div>
  );
};

type MenuProps = {
  discordUser: any; 
  userAccounts: any[]; 
};

const Menu: React.FC<MenuProps> = ({ discordUser, userAccounts }) => {
  const { openModal } = useModal();
  //console.log(userAccounts, 'userAccounts in menu')
  return (
  
  <>
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/">
          Stellar Linked Roles
        </Link>
      </div>
      <div className="flex-none gap-2">
      {!discordUser ? (
        <div><button
          className="btn btn-primary normal-case text-xl"
          onClick={() => openModal({ type: "discord_login" })}
        >
          Login
        </button></div>) : 
        ( <div><button
          className="btn btn-primary normal-case text-xl"
          onClick={() => openModal({ type: "stellar_accounts", size: "large", content: { userAccounts } })}
        >
          Link Stellar Accounts
        </button></div>)
        }

        <UserMenu discordUser={discordUser} />

      </div>
    </div>
  </>
);
};


export default function App() {

  let routeError = useRouteError();
  const { userStellarAccounts, discordUser, walletAuthed, discordAuthed, provider, account, STELLAR_NETWORK } = useLoaderData() ?? {};
  const copyToClipboard = (token) => {
    navigator.clipboard.writeText(token);
  };
  // Render proofs if they are available
  /*let renderProofs = null;
  if (proofs) {
    renderProofs = true;
  }*/

  if (routeError) {
    if (isRouteErrorResponse(routeError)) {
      // This was an error from a route loader or action
      if (routeError.error instanceof Error) {
        // Now it's safe to access routeError.error.message
      return (
        <div>
          <h1>Error: {routeError.status}</h1>
          <p>{routeError.statusText}</p>
          <pre>{routeError.error?.message}</pre>{" "}
          {/* Access message property of the error object */}
        </div>
      );
    }
  }
    // This was an error thrown in a component outside of loaders or actions
    throw routeError;
  }

  return (
    <html lang="en" data-theme="dark">
      <head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js" integrity="sha512-jEnuDt6jfecCjthQAJ+ed0MTVA++5ZKmlUcmDGBv2vUI/REn6FuIdixLNnQT+vKusE2hhTk2is3cFvv5wA+Sgg==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>
      
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <WalletProvider
          walletAuthed={!walletAuthed}
          publicKey={account}
          provider={provider}
          network={STELLAR_NETWORK}
        >
          <ModalProvider>
          <>
              <Menu 
                discordUser={discordUser}
                userAccounts={userStellarAccounts} />
              <Outlet />
          </>

          </ModalProvider>
        </WalletProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
