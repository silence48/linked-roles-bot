import type { V2_MetaFunction , LinksFunction } from "@remix-run/cloudflare";
import React, { useContext, useEffect } from 'react'
import { withEmotionCache } from '@emotion/react'
import { ChakraProvider } from '@chakra-ui/react'
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
//import designStyle from 'communi-design-system/styles/index.css';
//import designStyle from 'xlm-design-system/build/styles.min.css';
import { ServerStyleContext, ClientStyleContext } from './context'

//import { ModalProvider } from '~/context';

export const meta: V2_MetaFunction  = () => ([
  {title: "CommuniDAO"},  
]);

export const links: LinksFunction = () => ( [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'
  },
]
  //{ rel: 'stylesheet', href: designStyle },

);
interface DocumentProps {
  children: React.ReactNode;
}
const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);


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
    <Document>
      <ChakraProvider>
        <Outlet />
      </ChakraProvider>
    </Document>
  )
  
  
  
  /*(
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
*/

