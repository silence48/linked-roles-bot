import React, { useState } from 'react'
import { CacheProvider } from '@emotion/react'
import { ClientStyleContext } from './context'
import createEmotionCache, { defaultCache } from './createEmotionCache'


import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

interface ClientCacheProviderProps {
    children: React.ReactNode;
  }
  
  function ClientCacheProvider({ children }: ClientCacheProviderProps) {
    const [cache, setCache] = useState(defaultCache)
  
    function reset() {
      setCache(createEmotionCache())
    }
  
    return (
      <ClientStyleContext.Provider value={{ reset }}>
        <CacheProvider value={cache}>{children}</CacheProvider>
      </ClientStyleContext.Provider>
    )
  }

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
          <ClientCacheProvider>
      <RemixBrowser />
      </ClientCacheProvider>
    </StrictMode>
  );
});

/*

// REACT 17
import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

hydrate(<RemixBrowser />, document);
*/

// 05/2023:  React 18.2 is not currently stable
//
// REACT 18
// import { RemixBrowser } from "@remix-run/react";
// import { startTransition, StrictMode } from "react";
// import { hydrateRoot } from "react-dom/client";

// function hydrate() {
//   startTransition(() => {
//     hydrateRoot(
//       document,
//       <StrictMode>
//         <RemixBrowser />
//       </StrictMode>
//     );
//   });
// }

// if (typeof requestIdleCallback === "function") {
//   requestIdleCallback(hydrate);
// } else {
//   // Safari doesn't support requestIdleCallback
//   // https://caniuse.com/requestidlecallback
//   setTimeout(hydrate, 1);
// }