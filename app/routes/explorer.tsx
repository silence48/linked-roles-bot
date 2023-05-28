// routes/cacheaccount.tsx
import { badgeDetails } from '../utils/badge-details';
import { ActionFunction, json, redirect, LoaderArgs } from "@remix-run/cloudflare";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { fetchRegisteredAccounts, generateProofs, getOriginalClaimants, getOriginalPayees } from "../utils/sqproof";
import { fetchOperations } from "../utils/sqproof";
import { Page, Container } from "~/components";
import { useLoaderData } from '@remix-run/react';

import { Balance } from "../models";
import { BalanceForm } from "~/forms";

import React, { useState, useEffect } from 'react';

//import { allBadges } from '../assets/badges/allBadges'; // import all the badges
//import { BadgeGrid, BadgeButton, DetailModal, CloseButton, DataTable, DataRow } from './styledComponents'; // import the styled components

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const BadgeWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 80px;
  
  @media (min-width: 600px) {
    width: 180px;
  }
`;

const BadgeImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
`;

const Loader = styled.div`
  --Loader-color: var(--color-gray-80);
  --Loader-size: 1rem;
  position: relative;
  width: var(--Loader-size);
  height: var(--Loader-size);
`;

const LoaderInner = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: calc(var(--Loader-size) * 0.8);
  height: calc(var(--Loader-size) * 0.8);
  margin: calc(var(--Loader-size) * 0.1);
  border: calc(var(--Loader-size) * 0.1) solid var(--Loader-color);
  border-radius: 50%;
  animation: ${rotate} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: var(--Loader-color) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
`;

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 20px;
  justify-items: center;
  background-color: #2e2e32;

  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
`;

const BadgeButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: rgba(99, 76, 201, 0.6);
  color: white;
  border: none;
  cursor: pointer;
  text-align: center;
  border-radius: 8px;
  font-size: 1em;
  z-index: 1;
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
  animation: ${rotate} 2s linear infinite;
`;

// Define your action function
export let loader = async ({ request, context }: LoaderArgs) => {

    const { sessionStorage } = context as any;
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));

    //await getOriginalPayees("production", context, "GBM43D3V7UFKD6KDH3FVERBIMKPIFEZO7STTEEHGWPEBJQJ5YDEX2LVO", "SQ0601" );
    const { DB } = context.env as any;

    // this updates and caches all the data to the database, ignore it

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

    useEffect(() => {
        if (badgeDetails) {
            setIsLoading(false);
        }
    }, [badgeDetails]);

    const handleBadgeClick = async (badge) => {
        setSelectedBadge(badge);
        setIsLoading(true);
        const response = await fetch(`/api/fetchbalances/${badge.code}/${badge.issuer}`);
        const data = await response.json();
        setData(data);
        setIsLoading(false);
    };

    const handleAddressClick = async (address) => {
        setSelectedBadge({ "filename": address });
        setIsLoading(true);
        const response = await fetch(`/api/fetchaccount/${address}`);
        const data = await response.json();
        setData(data);
        setIsLoading(false);
    };

    return (
        <BadgeGrid>
            {badgeDetails.map((badge, index) => (
                <BadgeWrapper key={index}>
                    <BadgeButton onClick={() => handleBadgeClick(badge)}>
                        {badge.filename.substring(0, 12)}
                    </BadgeButton>
                    <BadgeImage src={`/assets/badges/${badge.filename}`} alt={badge.filename} /> 
                    {/* Note the leading slash indicating the file path is relative to the root directory */}
                </BadgeWrapper>
            ))}

            {selectedBadge && (
                <DetailModal>
                    <CloseButton onClick={() => setSelectedBadge(null)}>x</CloseButton>
                    <h2>{selectedBadge.filename.substring(0, 32)}</h2>
                    {isLoading ? (
                        <Spinner />  // display the spinner while isLoading is true
                    ) : Data && Data.length > 0 ? (  // only try to map over Data if it's an array with length > 0
                        <DataTable>
                            <ResponsiveTableHeader>
                                <DataRow>
                                    <TableHeader>ID</TableHeader>
                                    <TableHeader>Transaction ID</TableHeader>
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
                        <p>No data to display</p>  // display a message if Data is an empty array
                    )
                    }

                </DetailModal>
            )}
        </BadgeGrid>
    );
}