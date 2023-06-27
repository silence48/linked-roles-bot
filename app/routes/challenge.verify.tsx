import { type ActionArgs } from "@remix-run/cloudflare";
export interface StellarAccountsDataI {
  id?: string;
  discord_user_id?: string;
  public_key?: string;
  access_token?: string;
  refresh_token?: string;
}
export interface UserDataI {
  id?: string;
  discord_user_id?: string;
  discord_access_token?: string;
  discord_refresh_token?: string;
  discord_expires_at?: string;
}

interface AccountBuilderI {
  discord_user_id: string;
  data: any;
  DB: any;
  setup: (user: UserDataI) => Promise<void>;
  build: () => Promise<void>;
  updateDiscordCredentials: (user: UserDataI) => Promise<void>;
  addStellarAccount: (account: any) => Promise<void>;
  removeStellarAccount: (account: any) => Promise<void>;
  getStellarAccounts: () => Promise<{ accounts: any[] }>;
}

export async function action({ request, context }: ActionArgs) {
  const jwt = await import("@tsndr/cloudflare-worker-jwt");
  const { AccountBuilder } = await import("linked-roles-core");
  const { updateUserSession, getUser } = await import("~/utils/session.server");
  const { parse } = await import("cookie");
  const { TransactionBuilder, Networks } = await import("stellar-base");
  const { getRefreshToken, getAccessToken } = await import("~/utils/auth.server");

  const { sessionStorage } = context as any;
  const body = await request.formData();
  const signedEnvelope = body.get("signed_envelope_xdr");
  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") as any;
  const addAccount = (url.searchParams.get("addAccount") as any) ?? {};
  const cookies = request.headers.get("Cookie") ?? null;
  if (!cookies) throw new Error("No cookies found");
  const cookieHeader = parse(cookies);
  const { clientState } = cookieHeader;
  const { discord_user_id } = (await getUser(request, sessionStorage)) ?? {};

  let areq = {
    Transaction: signedEnvelope,
    NETWORK_PASSPHRASE: Networks.PUBLIC,
    discord_user_id: discord_user_id
  };
  const { Transaction, NETWORK_PASSPHRASE } = areq;
  let passphrase: Networks = Networks.PUBLIC;
  if (NETWORK_PASSPHRASE) {
    passphrase = NETWORK_PASSPHRASE;
  }

  const { DB } = context.env as any;
  let builtTx = new (TransactionBuilder.fromXDR as any)(Transaction, passphrase);
  const decoder = new TextDecoder();
  let authedstate = decoder.decode(builtTx.operations[0].value);

  if (clientState !== authedstate) {
    throw new Error('State verification failed.');
  }

  const refreshtoken = await getRefreshToken(builtTx, request, context);
  if (refreshtoken != false) {
    const accesstoken = await getAccessToken(refreshtoken, request, context);
    if (accesstoken) {
      const accountBuilder = await AccountBuilder.find({ discord_user_id, DB });
      if (!accountBuilder.data.user) {
        throw new Error('User does not exist.');
      } else {
        await accountBuilder.addStellarAccount({ public_key: builtTx.source, access_token: accesstoken, refresh_token: refreshtoken });
      }

      if (!provider) return;
      return updateUserSession(
        request,
        sessionStorage,
        { token: accesstoken, provider, account: builtTx.source },
        {
          message: 'Challenge verified',
          body: { account: builtTx.source, provider }
        }
      );
    }
  } else {
    throw new Error('Error Verifying Challenge.');
  }
}
