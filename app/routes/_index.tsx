//import { Button } from "communi-design-system";
import styled from "@emotion/styled";

import { TransactionBuilder, Networks } from "stellar-base";
import { Link, useLoaderData } from "@remix-run/react";
import { type LoaderArgs, json, type ActionFunction, redirect } from "@remix-run/cloudflare";
import { StellarAccount } from "../models";
import { getUser } from "~/utils/session.server";
import { getVerificationToken } from "~/utils/sqproof";
import jwt from "@tsndr/cloudflare-worker-jwt";
import { FiUser, FiKey, FiLink, FiCheckCircle, FiTrash2 } from 'react-icons/fi';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableHeader = styled.th`
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #4a5568;
  color: white;
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;
const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1A202C;
`;

const Container = styled.div`
  width: 100%;
  max-width: 42rem;
  padding: 2.5rem;
  margin: 2rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 #1A202C, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background-color: #F7FAFC;
`;

const AccountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 #1A202C, 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  background-color: #EDF2F7;
`;
const ProofContainer = styled.div`
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: #EDF2F7;
  overflow: auto;
  max-height: 200px;
  overflow-wrap: anywhere;
`;

const Button = styled.button`
  display: block;
  width: auto;
  padding: 0.75rem;
  border: none;
  border-radius: 0.375rem;
  color: #F7FAFC;
  background-color: #00ffff;
  cursor: pointer;

  &:hover {
    background-color: #0000ff;
  }

  &:disabled {
    background-color: #d2d9df;
    cursor: not-allowed;
    color: #F7FAFC;
  }
`;

const IconButton = styled.button`
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  color: #F7FAFC;
  background-color: #E53E3E;
  cursor: pointer;

  &:hover {
    background-color: #a86c53;
  }
`;

const IconText = styled.span`
  margin-left: 0.1rem; // Adjust as needed
`;

export async function fetchRegisteredAccounts(request: Request, context: any) {
  const { DB } = context.env as any;
  const { discord_user_id } = await getUser(request, context.sessionStorage);
  const stellarAccounts = await StellarAccount.findBy("discord_user_id", discord_user_id, DB);
  //const accounts = stellarAccounts.map((account) => account.public_key);
  return stellarAccounts;
}
export async function getAccessToken(account: string, request: Request, context: any) {
  const { DB } = context.env as any;
  const { discord_user_id } = await getUser(request, context.sessionStorage);
  console.log(discord_user_id)
  const record = await StellarAccount.findBy("public_key", account, DB);
  console.log(record)

  console.log(record[0].refresh_token)
  return record[0].refresh_token;
}
export async function generateProofs(request: Request, context: any, accounts: string[]) {
  const proofs = [];
  for (const account of accounts) {
    console.log('account', account)
    const accesstoken = await getAccessToken(account, request, context);
    console.log(accesstoken, 'accesstoken')
    const decoded = await jwt.decode(accesstoken)
    let passphrase: Networks = Networks.TESTNET;
    let transaction = new (TransactionBuilder.fromXDR as any)(decoded.payload.xdr, passphrase);
    console.log(decoded, 'decoded')
    console.log(transaction, 'transaction')
    const signature = transaction.signatures[0].signature().toString("base64");
    const token = await getVerificationToken(account, 'production', transaction, signature);
    proofs.push(token);
  }
  console.log(proofs, 'THE PROOFS')
  return proofs;
}

// Define your loader function
export let loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const user = await getUser(request, sessionStorage);
  const { discord_user_id } = user ?? false;
  const accounts = await fetchRegisteredAccounts(request, context);

  // Get the session and then get proofs from session
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const proofs = session.get("proofs");


  return json({ discord_user_id, accounts, proofs });
};

export default function Index() {
  const { discord_user_id, accounts, proofs } = useLoaderData();

  // Render proofs if they are available
  let renderProofs = null;
  if (proofs) {
    renderProofs = proofs.map((proof, index) => <p key={index}>{proof}</p>);
  }

  return (
    <Page>
      <Container>

        {discord_user_id &&
          <div className="flex items-center justify-center mb-6">
            <FiUser size={24} className="mr-2" />
            <p>Connected as: {discord_user_id}</p>
          </div>
        }

        <div className="flex justify-center mb-4">
          <Button as={Link} to="/verify" disabled={!!discord_user_id}>
            <FiLink /> Connect with Discord
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-center mb-4">
            <FiKey size={24} className="mr-2" />
            <p>You have {accounts.length} accounts linked.</p>
          </div>

          {accounts.map((account) => (
            <AccountContainer key={account.id}>
              <p className="break-all flex-shrink">{account.public_key}</p>
              <form method="post" action="/delink">
                <input
                  type="hidden"
                  name="publicKey"
                  value={account.public_key}
                />
                <IconButton type="submit">
                  <FiTrash2 /> <IconText>Remove</IconText>
                </IconButton>
              </form>
            </AccountContainer>
          ))}

          <div className="flex justify-center mt-2">
            <Button as={Link} to="/connect">
              Add a public key
            </Button>
          </div>
        </div>

        {accounts.length > 0 &&
          <div className="mb-4">
            <form method="post" action="/getProof" className="mt-2">
              <div className="flex justify-center mt-2">
                <Button type="submit">
                  <FiCheckCircle />
                  <IconText>Prove your roles!</IconText>
                </Button>
              </div>
            </form>
          </div>
        }

{renderProofs &&
    <div className="overflow-auto">
        <h3 className="text-center mb-4">Generated Proofs:</h3>
        {proofs.map((proofObj, index) =>
            <ProofContainer key={index}>
                <p>{proofObj.Proof}</p>
                <p>User Badges:</p>
                <Table>
                    <thead>
                        <TableRow>
                            <TableHeader>User Badge Code</TableHeader>
                            <TableHeader>Soroban Code</TableHeader>
                        </TableRow>
                    </thead>
                    <tbody>
                        {proofObj.userBadges.map((badge, badgeIndex) => (
                            <TableRow key={badgeIndex}>
                                <TableCell>{badge.code}</TableCell>
                                <TableCell>{proofObj.soroban.code}</TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </ProofContainer>
        )}
    </div>
}
      </Container>
    </Page>
  );
}