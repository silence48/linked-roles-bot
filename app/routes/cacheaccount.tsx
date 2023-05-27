// routes/cacheaccount.tsx
import { badgeDetails } from '../utils/badge-details';
import { ActionFunction, json, redirect, LoaderArgs } from "@remix-run/cloudflare";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { fetchRegisteredAccounts, generateProofs, getOriginalClaimants, getOriginalPayees } from "../utils/sqproof";
import {fetchOperations} from "../utils/sqproof";
import { Page, Container } from "~/components";
import { useLoaderData } from '@remix-run/react';

import {Balance} from "../models";
import {BalanceForm} from "~/forms";

import React, { useState , useEffect} from 'react';
//import { BadgeGrid, BadgeButton, DetailModal, CloseButton, DataTable, DataRow } from './styledComponents'; // import the styled components

const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  justify-items: center;
  background-color: #F5F5F5;
`;

const BadgeButton = styled.button`
  padding: 10px;
  background-color: #4F8A10;
  color: white;
  border: none;
  cursor: pointer;
  text-align: center;
  border-radius: 8px;
  font-size: 1em;
  width: 180px;
  height: 80px;
`;

const AddressButton = styled.button`
  padding: 10px;
  background-color: #4F8A10;
  color: white;
  border: none;
  cursor: pointer;
  text-align: center;
  border-radius: 8px;
  font-size: 1em;
  width: 300px;
  height: 80px;
`;
const DetailModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-height: 80%;
  overflow: auto;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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
`;

const DataRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;
const rotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
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
  for (const badge in badgeDetails) {
      await getOriginalPayees("production", context, badgeDetails[badge].issuer, badgeDetails[badge].code );
  }
  

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
    setSelectedBadge({"filename": address});
    setIsLoading(true);
    const response = await fetch(`/api/fetchaccount/${address}`);
    const data = await response.json();
    setData(data);
    setIsLoading(false);
  };

  return (
    <BadgeGrid>
      {badgeDetails.map((badge, index) => (
        <BadgeButton key={index} onClick={() => handleBadgeClick(badge)}>
          {badge.filename.substring(0, 12)}
        </BadgeButton>
      ))}
      {selectedBadge && (
        <DetailModal>
          <CloseButton onClick={() => setSelectedBadge(null)}>x</CloseButton>
          <h2>{selectedBadge.filename.substring(0, 32)}</h2>
          {isLoading ? (
            <Spinner />  // display the spinner while isLoading is true
            ) : Data && Data.length > 0 ? (  // only try to map over Data if it's an array with length > 0
            <DataTable>
            <thead>
              <DataRow>
                <th>ID</th>
                <th>Transaction ID</th>
                <th>Account ID</th>
                <th>Balance</th>
                <th>Date Acquired</th>
                <th>Verified Ownership</th>
              </DataRow>
            </thead>
            <tbody>
              {Data.map((record, index) => (
                <DataRow key={index}>
                  <td>{record.id}</td>
                  <td>{record.tx_id}</td>
                  <td><AddressButton onClick={() => handleAddressClick(record.account_id)}>
                  {record.account_id}
                    </AddressButton></td>
                  <td>{record.balance}</td>
                  <td>{record.date_acquired}</td>
                  <td>{record.verified_ownership}</td>
                </DataRow>
              ))}
            </tbody>
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