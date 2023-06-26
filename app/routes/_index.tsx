import { json, type LoaderArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import React, { useState, useEffect, useRef } from "react";
import { Logo } from "~/components/Logo";

export let loader = async ({ request, context }: LoaderArgs) => {
  const { badgeDetails, seriesFourIssuers } = await import(
    "../utils/badge-details"
  );
  const { getOriginalClaimants, getOriginalPayees } = await import(
    "../utils/sqproof"
  );
  const { getUser, getUserAuthProgress } = await import(
    "~/utils/session.server"
  );
  const { fetchRegisteredAccounts } = await import("~/utils/sqproof");

  const { sessionStorage } = context as any;
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  // const { DB } = context.env as any;
  const user = await getUser(request, sessionStorage);
  const { discord_user_id } = user ?? false;
  var accounts;
  if (discord_user_id) {
    accounts = await fetchRegisteredAccounts(request, context);
  } else {
    accounts = [];
  }

  // Get the session and then get proofs from session
  const proofs = session.get("proofs");

  return json({ badgeDetails, discord_user_id, accounts, proofs });
};

const BadgeGrid = ({
  badgeDetails,
  handleBadgeClick,
}: {
  badgeDetails: any;
  handleBadgeClick: (badge: any) => void;
}) => {
  return (
    <>
      {badgeDetails.length > 0 &&
        badgeDetails.map((badge: any, index: number) => (
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
        ))}{" "}
    </>
  );
};
export default function Index() {
  const { badgeDetails, discord_user_id, accounts, proofs } = useLoaderData();
  const [Data, setData] = useState([]); // initialize Data as an empty array
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isLoginVisable, setIsLoginVisable] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // initialize isLoading as false

  const tableModalRef = useRef(null);
  const loginModalRef = useRef(null);

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

  const handleLoginClick = async () => {
    setIsLoginVisable(true);

    loginModalRef.current.showModal();
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
      <BadgeGrid
        badgeDetails={badgeDetails}
        handleBadgeClick={handleBadgeClick}
      />
    </div>
  );
}
