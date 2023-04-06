import type { MetaFunction, LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import designStyle from 'communi-design-system/styles/index.css';
import { ModalProvider } from '~/context';

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "CommuniDAO",
  viewport: "width=device-width,initial-scale=1",
});

export const links: LinksFunction = () => ([
  { rel: 'stylesheet', href: designStyle },
]);

export default function App() {
  return (
    <html lang="en" className="light">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.9.4/lottie.min.js" integrity="sha512-ilxj730331yM7NbrJAICVJcRmPFErDqQhXJcn+PLbkXdE031JJbcK87Wt4VbAK+YY6/67L+N8p7KdzGoaRjsTg==" crossOrigin="anonymous" referrerPolicy="no-referrer"></script>

        <Meta />
        <Links />
      </head>
      <body>
        <ModalProvider>
        <Outlet />
        </ModalProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload port={8002} />
      </body>
    </html>
  );
}
