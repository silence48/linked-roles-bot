import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import React, { useState, useEffect, useRef } from "react";

// Define your action function
export let loader = async ({ request, context }: LoaderArgs) => {
  const { badgeDetails, seriesFourIssuers } = await import(
    "../utils/badge-details"
  );

  return json({ badgeDetails});
};

export default function Index() {
  const { badgeDetails} = useLoaderData();

  const [Data, setData] = useState([]); // initialize Data as an empty array
  const [selectedBadge, setSelectedBadge] = useState(null);

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accountData, setAccountData] = useState(null);

  const [isLoading, setIsLoading] = useState(false); // initialize isLoading as false

  const tableModalRef = useRef(null);

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
    tableModalRef.current.showModal();
  };

  const handleAddressClick = async (address: any) => {
    setSelectedBadge({ filename: address });
    setIsLoading(true);
    const response = await fetch(`/api/fetchaccount/${address}`);
    const data = await response.json();
    setData(data);
    setIsLoading(false);
    tableModalRef.current.showModal();
  };

  const handleDarkModeToggleEnd = (isDarkMode: boolean) => {
    console.log(`Dark mode is now ${isDarkMode ? "enabled" : "disabled"}`);
  };

  const handleSignOut = () => {
    console.log("Signing out...");
  };


  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <div className="w-[1024px] mx-auto">
    <div className="flex flex-wrap justify-center bg-gray-800 p-4">
      

      {badgeDetails.map((badge, index) => (
        <div
          className="flex w-full min-w-[120px] max-w-[240px] m-[1vw] sm:m-1"
          key={index}
        >
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSelectedBadge(null)}
          ></div>
          <dialog
            ref={tableModalRef}
            id="table_modal"
            className="modal modal-open backdrop-blur z-20"
          >
            <div className="modal-box w-5/6 h-4/5 flex flex-col max-w-full">
              <div className="p-2">
                <div className="flex justify-between items-center">
                  <h2>{selectedBadge.filename}</h2>
                  <button
                    className="btn"
                    onClick={() => setSelectedBadge(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="overflow-auto flex-grow">
                {isLoading ? (
                  <span className="loading loading-spinner loading-md"></span> // display the spinner while isLoading is true
                ) : Data && Data.length > 0 ? ( // only try to map over Data if it's an array with length > 0
                  <>
                    <div className="overflow-x-auto">
                      <table className="table table-xs">
                        <thead>
                          <tr>
                            <th className="lg:table-cell hidden">ID</th>
                            <th className="xl:table-cell hidden">
                              Transaction ID
                            </th>
                            <th>Asset ID</th>
                            <th>Account ID</th>
                            <th className="xl:table-cell hidden">Balance</th>
                            <th className="2xl:table-cell hidden">
                              Date Acquired
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {Data.map((record, index) => (
                            <tr key={index}>
                              <td className="lg:table-cell hidden">
                                {record.id}
                              </td>
                              <td className="xl:table-cell hidden">
                                {record.tx_id}
                              </td>
                              <td>{record.asset_id}</td>
                              <td>
                                <button
                                  className="btn btn-secondary btn-xs"
                                  onClick={() =>
                                    handleAddressClick(record.account_id)
                                  }
                                >
                                  {record.account_id}
                                </button>
                              </td>
                              <td className="xl:table-cell hidden">
                                {record.balance}
                              </td>
                              <td className="whitespace-nowrap 2xl:table-cell hidden">
                                {record.date_acquired}
                              </td>
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
          </dialog>
        </>
      )}
    </div>
    </div>
  );
}
