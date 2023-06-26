import type {
  V2_MetaFunction,
  LinksFunction,
  LoaderArgs,
} from "@remix-run/cloudflare";
import * as React from "react";
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
import { Button } from '~/components';
import { useModal, useWallet } from "~/context";
import { json } from "@remix-run/cloudflare";
import { getUserAuthProgress, getUser } from "~/utils/session.server";
import tailwind from "~/styles/main.css";
import { Discord } from 'linked-roles-core';
import { ModalProvider, WalletProvider } from "~/context";
import { ModalTypeE } from "~/context/Modal";

export const meta: V2_MetaFunction = () => [{ title: "CommuniDAO" }];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
  //{ rel: 'stylesheet', href: designStyle },
];

type Require = "discord_auth" | "wallet_auth";

function checkRequirement(
  authProgress: { requires: Require[]; view: string },
  requirement: Require
) {
  if (
    authProgress &&
    authProgress.requires &&
    Array.isArray(authProgress.requires)
  ) {
    return authProgress.requires.includes(requirement);
  }
  return false;
}

export const loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage, env } = context as any;
  const { STELLAR_NETWORK } = env;
  const authProgress =
    (await getUserAuthProgress(request, sessionStorage)) ?? {};
  const { provider, account, discord_user_id } = (await getUser(request, sessionStorage)) ?? {};
  if (authProgress === null) return null;
  const requiresDiscord = checkRequirement(authProgress, "discord_auth");
  const requiresWallet = checkRequirement(authProgress, "wallet_auth");
  let discordUser = null;
  //console.log(token, 'token in root')
  if (!requiresDiscord) {
    const response = await fetch(`https://discord.com/api/v8/users/${discord_user_id}`, {
      headers: {
        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`
      }
    });
    if (!response.ok) throw new Error('Discord API error');
    discordUser = await response.json();

  }

  return json({
    discordUser,
    requiresDiscord,
    requiresWallet,
    authProgress,
    provider,
    account,
    STELLAR_NETWORK,
  });
};


const Menu = ({ walletAuthed, discordAuthed, discordUser }: any) => {
  const { openModal } = useModal();

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link className="btn btn-ghost normal-case text-xl" to="/">
            Stellar Linked Roles
          </Link>
        </div>
        <div className="flex-none gap-2">
          {discordAuthed ? (
            <button
              className="btn btn-primary normal-case text-xl"
              onClick={() => openModal({ type: ModalTypeE.DISCORD_LOGIN })}
            >
              Login
            </button>
          ) : (
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
                  <Button onClick={() => openModal({ type: ModalTypeE.SETTINGS })} text='settings' />
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const Layout = ({
  authProgress,
  discordAuthed,
  walletAuthed,
  discordUser,
}: {
  authProgress: any;
  discordAuthed: boolean;
  walletAuthed: boolean;
  discordUser: any;
}) => {
  const { newSession } = useWallet();

  React.useEffect(() => {
    if (!discordAuthed && walletAuthed) {
      newSession();
    }
  }, [authProgress, discordAuthed, walletAuthed]);

  return (
    <>
      <Menu discordAuthed={discordAuthed} walletAuthed={walletAuthed} discordUser={discordUser} />
      <Outlet />
    </>
  );
};

export default function App() {
  let routeError = useRouteError();
  const {
    discordUser,
    authProgress,
    requiresDiscord,
    requiresWallet,
    provider,
    account,
    STELLAR_NETWORK,
  } = useLoaderData() ?? {};

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
    <html lang="en" className="light">
      <head>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.9.4/lottie.min.js"
          integrity="sha512-ilxj730331yM7NbrJAICVJcRmPFErDqQhXJcn+PLbkXdE031JJbcK87Wt4VbAK+YY6/67L+N8p7KdzGoaRjsTg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <WalletProvider
          walletAuthed={!requiresWallet}
          publicKey={account}
          provider={provider}
          network={STELLAR_NETWORK}
        >
          <ModalProvider>
            <Layout
              discordUser={discordUser}
              authProgress={authProgress}
              discordAuthed={requiresDiscord}
              walletAuthed={requiresWallet}
            />
          </ModalProvider>
        </WalletProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
