import type { V2_MetaFunction , LinksFunction, LoaderArgs } from "@remix-run/cloudflare";

import {
  Links,
    useRouteError,
  isRouteErrorResponse,
  //LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import React from "react";

import { json } from "@remix-run/cloudflare";
import { getUserAuthProgress, getUser } from "~/utils/session.server";

import designStyle from 'communi-design-system/styles/index.css';
import tailwind from '~/styles/apptailwind.css'
//import designStyle from 'xlm-design-system/build/styles.min.css';

import { ModalProvider, WalletProvider, useWallet } from "~/context";

export const meta: V2_MetaFunction  = () => ([
  {title: "CommuniDAO"},
]);

export const links: LinksFunction = () => ([
  { rel: 'stylesheet', href: tailwind },
  { rel: 'stylesheet', href: designStyle },
  
]);


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
  const { provider, account } = (await getUser(request, sessionStorage)) ?? {};
  if (authProgress === null) return null;
  const discordAuthed = checkRequirement(authProgress, "discord_auth");
  const walletAuthed = checkRequirement(authProgress, "wallet_auth");
  console.log({
    discordAuthed,
    walletAuthed,
    authProgress,
    provider,
    account,
    STELLAR_NETWORK,
  })
  return json({
    discordAuthed,
    walletAuthed,
    authProgress,
    provider,
    account,
    STELLAR_NETWORK,
  });
};

const Layout = ({
  authProgress,
  discordAuthed,
  walletAuthed,
}: {
  authProgress: any;
  discordAuthed: boolean;
  walletAuthed: boolean;
}) => {
  const { newSession } = useWallet();

  React.useEffect(() => {
    if (!discordAuthed && walletAuthed) {
      newSession();
    }
  }, [authProgress, discordAuthed, walletAuthed]);

  return <Outlet />;
};


export default function App() {

  let routeError = useRouteError();
  const {
    authProgress,
    discordAuthed,
    walletAuthed,
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
          <pre>{routeError.error?.message}</pre>  {/* Access message property of the error object */}
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
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.9.4/lottie.min.js" integrity="sha512-ilxj730331yM7NbrJAICVJcRmPFErDqQhXJcn+PLbkXdE031JJbcK87Wt4VbAK+YY6/67L+N8p7KdzGoaRjsTg==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        />
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
            <Layout
              authProgress={authProgress}
              discordAuthed={discordAuthed}
              walletAuthed={walletAuthed}
            />
          </ModalProvider>
        </WalletProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
