//import { Button } from "communi-design-system";
import { Link, useLoaderData } from "@remix-run/react";
import { type LoaderArgs, json } from "@remix-run/cloudflare";
import { getUser } from "~/utils/session.server";
import { FiUser, FiKey, FiLink, FiCheckCircle, FiTrash2, FiClipboard } from 'react-icons/fi';
import { Page, Container, GridContainer, TableContainer, Table, TableRow, TableCell, TableHeader, AccountContainer, ProofContainer, Button, IconButton, IconText } from "~/components";
import { fetchRegisteredAccounts } from "~/utils/sqproof";

// Define your loader function
export let loader = async ({ request, context }: LoaderArgs) => {
  const { sessionStorage } = context as any;
  const user = await getUser(request, sessionStorage);
  const { discord_user_id } = user ?? false;
  var accounts;
  if (discord_user_id) {
    accounts = await fetchRegisteredAccounts(request, context);
  }else{
    accounts = []
  }
  

  // Get the session and then get proofs from session
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const proofs = session.get("proofs");


  return json({ discord_user_id, accounts, proofs });
};

export default function Index() {
  const { discord_user_id, accounts, proofs } = useLoaderData();
  const copyToClipboard = (token) => {
    navigator.clipboard.writeText(token);
  };
  // Render proofs if they are available
  let renderProofs = null;
  if (proofs) {
    renderProofs = true;
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
                <p>User Badges:</p>
                <GridContainer>
                  {proofObj.userBadges.map((badge, badgeIndex) => (
                    <div key={badgeIndex}>
                      {badge.code}
                    </div>
                  ))}
                </GridContainer>
                <p>Soroban:</p>
                <GridContainer>
                  {proofObj.soroban.map((badge, badgeIndex) => (
                    <div key={badgeIndex}>
                      {badge.code}
                    </div>
                  ))}
                </GridContainer>
                <TableContainer>
                  <Table>
                    <thead>
                      <TableRow>
                        <TableHeader>Token <IconButton onClick={() => copyToClipboard(proofObj.token)}>
                          <FiClipboard />  </IconButton>
                        </TableHeader>
                      </TableRow>
                    </thead>
                    <tbody>
                      <TableRow>
                        <TableCell>{proofObj.token}</TableCell>
                      </TableRow>
                    </tbody>
                  </Table>
                </TableContainer>
              </ProofContainer>
            )}
          </div>
        }
      </Container>
    </Page>
  );
}