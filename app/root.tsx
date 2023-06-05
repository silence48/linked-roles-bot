import type { V2_MetaFunction , LinksFunction } from "@remix-run/cloudflare";

import {
  Links,
    useRouteError,
  isRouteErrorResponse,
  //LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import designStyle from 'communi-design-system/styles/index.css';
//import designStyle from 'xlm-design-system/build/styles.min.css';

import { ModalProvider } from '~/context';

export const meta: V2_MetaFunction  = () => ([
  {title: "CommuniDAO"},  
]);

export const links: LinksFunction = () => ([
  { rel: 'stylesheet', href: designStyle },
]);

export default function App() {

  let routeError = useRouteError();

  
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

        <Meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ModalProvider>
        <Outlet />
        </ModalProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
