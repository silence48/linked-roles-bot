// REACT 17
import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";

hydrate(<RemixBrowser />, document);


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