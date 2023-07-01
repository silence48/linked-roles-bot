// routes/cachepayments.tsx

import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import React, { useState, useEffect } from "react";

// Define your action function
export let loader = async ({ request, context }: LoaderArgs) => {
  const { badgeDetails, seriesFourIssuers } = await import(
    "../utils/badge-details"
  );
  const { getOriginalClaimants, getOriginalPayees } = await import(
    "../utils/sqproof"
  );

  const { sessionStorage } = context as any;
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  //await getOriginalPayees("production", context, "GBM43D3V7UFKD6KDH3FVERBIMKPIFEZO7STTEEHGWPEBJQJ5YDEX2LVO", "SQ0601" );
  const { DB } = context.env as any;

  // this updates and caches all the data to the database, ignore it
  var subrequests = 0;
  for (const badge in badgeDetails) {
    if (subrequests > 499) {
      break;
    }
    console.log(`badge: ${badgeDetails[badge].code}`);
    const sr = await getOriginalClaimants(
      "production",
      context,
      badgeDetails[badge].issuer,
      badgeDetails[badge].code,
      subrequests
    );
    subrequests += sr;
    const op = await getOriginalPayees(
      "production",
      context,
      badgeDetails[badge].issuer,
      badgeDetails[badge].code,
      subrequests
    );
    subrequests += op;
    console.log(`subrequests: ${subrequests}, sr  ${sr}`);
    if (subrequests > 700) {
      break;
    }
  }
/*
  for (const badge in badgeDetails) {
    await getOriginalPayees("production", context, badgeDetails[badge].issuer, badgeDetails[badge].code, subrequests);
  }
*/
  return json({ badgeDetails });
};

export default function Index() {
  const { badgeDetails } = useLoaderData();

  const [Data, setData] = useState([]); // initialize Data as an empty array
  const [selectedBadge, setSelectedBadge] = useState(null);

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accountData, setAccountData] = useState(null);

  const [isLoading, setIsLoading] = useState(false); // initialize isLoading as false
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (badgeDetails) {
      setIsLoading(false);
    }
  }, [badgeDetails]);

  const handleBadgeClick = async (badge: React.SetStateAction<null>) => {
    setSelectedBadge(badge);
    setIsLoading(true);
    const response = await fetch(
      `/api/fetchbalances/${badge.code}/${badge.issuer}`
    );
    const data = await response.json();
    setData(data);
    setIsLoading(false);
  };

  const handleAddressClick = async (address: any) => {
    setSelectedBadge({ filename: address });
    setIsLoading(true);
    const response = await fetch(`/api/fetchaccount/${address}`);
    const data = await response.json();
    setData(data);
    setIsLoading(false);
  };
  const handleDarkModeToggleEnd = (isDarkMode: boolean) => {
    console.log(`Dark mode is now ${isDarkMode ? "enabled" : "disabled"}`);
  };

  const handleSignOut = () => {
    console.log("Signing out...");
  };

  const handleMenuOpen = () => {
    console.log("Opening menu...");
  };
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div className="flex flex-wrap justify-center bg-gray-800 p-4 w-full">

    {badgeDetails.map((badge, index) => (
     <div
     className="flex w-full min-w-[120px] max-w-[240px] m-[1vw] sm:m-1"
     key={index}>

<button
  className="relative w-full bg-transparent border-none cursor-pointer overflow-hidden transition-colors duration-300 bg-cover bg-center flex items-center justify-center"
  style={{
    backgroundImage: `url(/assets/badges/${badge.filename})`,
    paddingTop: "100%", // This makes the aspect ratio 1:1
  }}
  onClick={() => handleBadgeClick(badge)}
>
  <div className="absolute bottom-0 w-full p-2 text-center bg-black bg-opacity-60 text-white text-sm">
    {badge.filename}
  </div>
  <div className="absolute top-0 left-0 w-full h-full bg-purple-500 opacity-0 z-10 hover:opacity-70 transition-opacity duration-300"></div>
</button>


     </div>
    ))}
{selectedBadge && (
  <>
    <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setSelectedBadge(null)}></div>
    
    <div className="fixed inset-0 flex items-center justify-center z-20">
      <button
      className="btn btn-sm btn-circle absolute right-2 top-2 z-30"
      onClick={() => setSelectedBadge(null)}
    >
      ✕
    </button>
      <div className="bg-base-200 max-w-4/5 max-h-[80vh] flex flex-col p-4 rounded-lg">
        <h2>{selectedBadge.filename.substring(0, 32)}</h2>
        {isLoading ? (
          <Spinner /> // display the spinner while isLoading is true
        ) : Data && Data.length > 0 ? ( // only try to map over Data if it's an array with length > 0
          <>
            <div>
              <table className="table w-full table-compact table-striped">
                <thead>
                  <tr className="bg-base-200">
                    <th>ID</th>
                    <th>Transaction ID</th>
                    <th>Asset ID</th>
                    <th>Account ID</th>
                    <th>Balance</th>
                    <th>Date Acquired</th>
                    <th>Verified Ownership</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="overflow-auto">
              <table className="table w-full table-compact table-striped">
                <tbody>
                  {Data.map((record, index) => (
                    <tr key={index}>
                      <td>{record.id}</td>
                      <td>{record.tx_id}</td>
                      <td>{record.asset_id}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-md"
                          onClick={() => handleAddressClick(record.account_id)}
                        >
                          {record.account_id}
                        </button>
                      </td>
                      <td>{record.balance}</td>
                      <td>{record.date_acquired}</td>
                      <td>{record.verified_ownership}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>No data to display</p> // display a message if Data is an empty array
        )}
      </div>
    </div>
  </>
)}





    </div>
  );
}
