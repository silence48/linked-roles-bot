// routes/cacheaccount.tsx
import { badgeDetails, seriesFourIssuers } from '../utils/badge-details';
import { json, type LoaderArgs } from "@remix-run/cloudflare";
import styled from "@emotion/styled";
import { useLoaderData } from '@remix-run/react';

import React, { useState, useEffect } from 'react';

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #2B2A50;
  color: #FFFFFF;
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
`;

const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const RightContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 1rem;
  height: 50px;
  justify-content: flex-end;
`;


const SearchBox = styled.input`
  margin-left: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #FFFFFF;
`;

const LoginButton = styled.button`
  color: #FFFFFF;
  background-color: #3C3B6E;
  border: 1px solid #FFFFFF;
  padding: 0.5rem;
  margin-right: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #FFD700;
  }
`;

const ExpandButton = styled.button`
  display: none;

  @media (max-width: 600px) {
    display: block;
  }
`;

const Logo = styled.img`
  height: 40px;
  margin-right: 1rem;
  border: 1px solid #FFFFFF;
  padding: 5px;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 1px solid #FFFFFF;
  padding: 5px;
  justify-content: flex-end;
`;

const Title = styled.h1`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 3vw;
  @media (min-width: 1024px) {
    font-size: 1.5rem;
  }
`;

const BadgeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1vw;
  background-color: #2e2e32;
  padding: 1vw;
  width: 100%;

  @media (max-width: 600px) {
    justify-content: flex-start;
    gap: 2vw;
  }
`;


const BadgeWrapper = styled.div`
  flex: 1 0 20%;
  min-width: 120px;
  max-width: 240px;
  margin: 1vw;
`;

const BadgeButton = styled.button`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: transparent;
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.3s;
  background-image: url(/assets/badges/${props => props.badge.filename});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(99, 76, 201, 0.8);
      opacity: 0.7;
      z-index: 1;
    }
  }
`;

const BadgeImage = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
`;

const BadgeLabel = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 8px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 14px;
`;

const AddressButton = styled.button`
  padding: 10px;
  background-color: #634cc9;
  color: white;
  border: none;
  cursor: pointer;
  text-align: center;
  border-radius: 8px;
  font-size: 1em;
  width: 100%;
  min-width: 200px;

  @media (min-width: 600px) {
    width: fit-content;
    min-width: 200px;
  }
`;

const DetailModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-height: 80vh;
  overflow: auto;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

  @media (min-width: 600px) {
    width: 80%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5em;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  margin-top: 20px;

  @media (max-width: 600px), (orientation: portrait) {
    display: block;
    overflow-x: auto;
  }
`;

const ResponsiveTableBody = styled.tbody`
  @media (max-width: 600px), (orientation: portrait) {
    display: block;
    width: 100%;
  }
`;

const ResponsiveTableHeader = styled.thead`
  @media (max-width: 600px), (orientation: portrait) {
    display: block;
    width: 100%;
  }
`;

const DataRow = styled.tr`
  &:nth-child(even) {
    background-color: #2e2e32;
    color: white;
  }

  @media (max-width: 600px), (orientation: portrait) {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;


const TableCell = styled.td`
  padding: 2px;

  @media (max-width: 600px), (orientation: portrait) {
    padding: 3px 5px;
    border-bottom: 1px solid #ddd;
    &:last-child {
      border-bottom: none;
    }
  }
`;
const TableHeader = styled.th`
  padding: 10px;
  font-weight: bold;

  @media (max-width: 600px), (orientation: portrait) {
    padding: 6px 10px;
    border-bottom: 1px solid #ddd;
    &:last-child {
      border-bottom: none;
    }
  }
`;

const Spinner = styled.div`
  border: 16px solid  #ededef;
  border-top: 16px solid #28282c;
  border-radius: 50%;
  width: 60px;
  height: 60px;
`;

// Define your action function
export let loader = async ({ request, context }: LoaderArgs) => {
  const dynamicImport = async (env, context, issuer, code, subrequests) => {
    const sqproof = await import("../utils/sqproof");
    const getOriginalClaimants = sqproof.getOriginalClaimants;
    return getOriginalClaimants(env,context, issuer, code, subrequests); // if it's a function
  }


    const { sessionStorage } = context as any;
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));

    //await getOriginalPayees("production", context, "GBM43D3V7UFKD6KDH3FVERBIMKPIFEZO7STTEEHGWPEBJQJ5YDEX2LVO", "SQ0601" );
    const { DB } = context.env as any;

    // this updates and caches all the data to the database, ignore it
    let subrequests = 0
    for (const badge in seriesFourIssuers) {
      if (subrequests > 699) {
        break;
      }
      console.log(`badge: ${seriesFourIssuers[badge].code}`)
      const sr = await dynamicImport("production", context, seriesFourIssuers[badge].issuer, seriesFourIssuers[badge].code, subrequests);
      subrequests = sr;
      console.log(`subrequests: ${subrequests}, sr  ${sr}`)
      if (subrequests > 699) {
        break;
      }
      }
    //for (const badge in badgeDetails) {
    //await getOriginalPayees("production", context, badgeDetails[badge].issuer, badgeDetails[badge].code);
    //}

    return json({ badgeDetails });

};


export default function Index() {

    const { badgeDetails } = useLoaderData();

    const [Data, setData] = useState([]);  // initialize Data as an empty array
    const [selectedBadge, setSelectedBadge] = useState(null);

    const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
    const [accountData, setAccountData] = useState(null);

    const [isLoading, setIsLoading] = useState(false);  // initialize isLoading as false
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (badgeDetails) {
            setIsLoading(false);
        }
    }, [badgeDetails]);

    const handleBadgeClick = async (badge: React.SetStateAction<null>) => {
        setSelectedBadge(badge);
        setIsLoading(true);
        const response = await fetch(`/api/fetchbalances/${badge.code}/${badge.issuer}`);
        const data = await response.json();
        setData(data);
        setIsLoading(false);
    };

    const handleAddressClick = async (address: any) => {
        setSelectedBadge({ "filename": address });
        setIsLoading(true);
        const response = await fetch(`/api/fetchaccount/${address}`);
        const data = await response.json();
        setData(data);
        setIsLoading(false);
    };
    const handleDarkModeToggleEnd = (isDarkMode: boolean) => {
      console.log(`Dark mode is now ${isDarkMode ? 'enabled' : 'disabled'}`);
    };
  
    const handleSignOut = () => {
      console.log('Signing out...');
    };
  
    const handleMenuOpen = () => {
      console.log('Opening menu...');
    };
    const [isModalVisible, setIsModalVisible] = useState(false);
    return (<><NavBar>
      <LeftContainer>
          <Logo src="/path/to/logo.png" alt="SDDB Logo" />
          <Title>Stellar Quest Badge Explorer</Title>
      </LeftContainer>
      <CenterContainer>
          <SearchBox type="search" placeholder="Search..." />
      </CenterContainer>
      <RightContainer>
          <LoginContainer>
              <LoginButton>Login with Discord</LoginButton>
          </LoginContainer>
          <ProfileImage src="/path/to/default-profile.png" alt="Profile" />
      </RightContainer>
  </NavBar>
      <ExpandButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Collapse' : 'Expand'}
      </ExpandButton>
      {isExpanded && (
          <div>
              {/* Your expanded navigation items */}
          </div>
      )}

        <BadgeGrid>

            {badgeDetails.map((badge: { filename: string; }, index: React.Key | null | undefined) => (
                <BadgeWrapper key={index}>
                    <BadgeButton badge={badge} onClick={() => handleBadgeClick(badge)}>
                        <BadgeLabel>{badge.filename.substring(0, 12)}</BadgeLabel>
                    </BadgeButton>
                </BadgeWrapper>
            ))}


            {selectedBadge && (
              
                <DetailModal>
                    <CloseButton onClick={() => setSelectedBadge(null)}>x</CloseButton>
                    <h2>{selectedBadge.filename.substring(0, 32)}</h2>
                    {isLoading ? (
                        <Spinner /> // display the spinner while isLoading is true
                    ) : Data && Data.length > 0 ? ( // only try to map over Data if it's an array with length > 0
                        <DataTable>
                            <ResponsiveTableHeader>
                                <DataRow>
                                    <TableHeader>ID</TableHeader>
                                    <TableHeader>Transaction ID</TableHeader>
                                    <TableHeader>Asset ID</TableHeader>
                                    <TableHeader>Account ID</TableHeader>
                                    <TableHeader>Balance</TableHeader>
                                    <TableHeader>Date Acquired</TableHeader>
                                    <TableHeader>Verified Ownership</TableHeader>
                                </DataRow>
                            </ResponsiveTableHeader>
                            <ResponsiveTableBody>
                                {Data.map((record, index) => (
                                    <DataRow key={index}>
                                        <TableCell>{record.id}</TableCell>
                                        <TableCell>{record.tx_id}</TableCell>
                                        <TableCell>{record.asset_id}</TableCell>
                                        <TableCell><AddressButton variant="secondary" size="md" onClick={() => handleAddressClick(record.account_id)}>
                                            {record.account_id}
                                        </AddressButton></TableCell>
                                        <TableCell>{record.balance}</TableCell>
                                        <TableCell>{record.date_acquired}</TableCell>
                                        <TableCell>{record.verified_ownership}</TableCell>
                                    </DataRow>
                                ))}
                            </ResponsiveTableBody>

                        </DataTable>
                    ) : (
                        <p>No data to display</p> // display a message if Data is an empty array
                    )}

                </DetailModal>
            )}
        </BadgeGrid>
     </>
    );
}