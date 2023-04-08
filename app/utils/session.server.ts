import { redirect, json } from "@remix-run/cloudflare";

interface SessionI {
  discord_user_id?: string;
  token?: string;
  clientState?: string;
  isAuthed?: boolean;
  metadata?: any;
  isClaimed?: boolean;
  provider?: "albedo" | "rabet" | "freighter" | "wallet_connect" | null;
}

interface RespI {
  redirectTo?: string
  message?: string
}

export async function createUserSession(
  sessionStorage: Storage,
  sessionData: SessionI,
  { redirectTo, message }: RespI
) {
  const session = await sessionStorage.getSession();
  session.set("data", {
    ...sessionData,
  });
  
  if (!redirectTo) return;
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

async function getUserSession(request: Request, sessionStorage: Storage) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function getUser(request: Request, sessionStorage: Storage) {
  const session = await getUserSession(request, sessionStorage);
  return session.get("data");
}

export async function updateUserSession(
  request: Request,
  sessionStorage: Storage,
  sessionData: SessionI,
  { redirectTo, message}: RespI
) {
  let session = await getUser(request, sessionStorage);
  let newSession = await sessionStorage.getSession();
  newSession.set("data", {
      ...session,
      ...sessionData,
  });
  if (!!redirectTo) {
    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(newSession),
      },
    });
  } else {
    return json(
      { message },
      {
        status: 200,
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(newSession),
        },
      }
    );
  }
}

export async function logout(request: Request, sessionStorage: Storage) {
  let session = await getUserSession(request, sessionStorage);
  return redirect(`/`, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}