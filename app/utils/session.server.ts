import { redirect, json } from "@remix-run/cloudflare";
import type { SessionData, SessionStorage } from "@remix-run/cloudflare";
interface Storage {
  getSession: (cookie?: string | null) => Promise<any>;
  commitSession: (session: any) => Promise<string>;
  destroySession: (session: any) => Promise<string>;
}

interface SessionI {
  id?: string;
  discord_user_id?: string;
  user?: any;
  token?: string;
  clientState?: string;
  metadata?: any;
  isClaimed?: boolean;
  account?: string | null;
  proofs?: string[];
  provider?: "albedo" | "rabet" | "freighter" | "wallet_connect" | null;
}

interface UserSessionResponseI {
  redirectTo?: string;
  message?: string;
  body?: any;
}

export async function createUserSession(
  sessionStorage: SessionStorage<SessionData, SessionData>,
  sessionData: SessionI,
  response?: UserSessionResponseI
) {
  const session = await sessionStorage.getSession();
  session.set("data", {
    ...sessionData,
  });
  const { message, redirectTo } = response ?? {};
  const hasRedirect = Boolean(redirectTo) && typeof redirectTo === "string";

  if (hasRedirect) {
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } else {
    return json(
      { message: message ? message : "Session Created" },
      {
        status: 200,
        headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
      }
    );
  }
}

async function getUserSession(request: Request, sessionStorage: SessionStorage) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUser(request: Request, sessionStorage: SessionStorage) {
  const session = await getUserSession(request, sessionStorage);
  return session.get("data");
}

type Require = 'discord_auth' | 'wallet_auth'

export async function getUserAuthProgress(
  request: Request,
  sessionStorage: SessionStorage
) {
  const { provider, discord_user_id, account } = await getUser(
    request,
    sessionStorage
  ) ?? {};
  console.log({ provider, discord_user_id, account }, 'session-server')
  let authProgress: { requires: Require[]; view: string } = {
    requires: [],
    view: "",
  };

  if (!provider && !account) {
    authProgress.requires.push("wallet_auth");
    authProgress.view = "loginWalletView";
  }

  if (!discord_user_id) {
    authProgress.requires.push("discord_auth");
    authProgress.view = "loginDiscordView";
  }

  if (authProgress.requires.length === 0) {
    authProgress.view = "defaultView";
  }

  // Return the authProgress object
  return authProgress;
}

export async function isDiscordAuthed(
  request: Request,
  sessionStorage: SessionStorage
){
  const { discord_user_id } = await getUser(
    request,
    sessionStorage
  ) ?? {};
 
    console.log(discord_user_id, 'discord_user_id in isdiscordauthed')
  //this should get an access token from the refresh token using the discordapi?
  let discordAuthed = false;

  if (discord_user_id) {
    discordAuthed = true
  }
  // Return the authProgress object
  return discordAuthed;
}

export async function updateUserSession(
  request: Request,
  sessionStorage: SessionStorage,
  sessionData: SessionI,
  { redirectTo, message = undefined, body = undefined }: UserSessionResponseI
) {
  let session = await getUser(request, sessionStorage);
  let newSession = await sessionStorage.getSession();
  newSession.set("data", {
    ...session,
    ...sessionData,
  });
  const hasRedirect = Boolean(redirectTo) && typeof redirectTo === "string";
  if (hasRedirect) {
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(newSession),
      },
    });
  } else {
    return json(
      { message, body },
      {
        status: 200,
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(newSession),
        },
      }
    );
  }
}

export async function logout(request: Request, sessionStorage: SessionStorage) {
  let session = await getUserSession(request, sessionStorage);
  return redirect(`/`, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
