import { redirect, json } from "@remix-run/cloudflare";

interface SessionI {
  id?: string;
  discord_user_id?: string;
  user?: any;
  token?: string;
  clientState?: string;
  metadata?: any;
  isClaimed?: boolean;
  account?: string | null;
  provider?: "albedo" | "rabet" | "freighter" | "wallet_connect" | null;
}

interface UserSessionResponseI {
  redirectTo?: string;
  message?: string;
}

export async function createUserSession(
  sessionStorage: Storage,
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

async function getUserSession(request: Request, sessionStorage: Storage) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function getUser(request: Request, sessionStorage: Storage) {
  console.log("sessionStorage", sessionStorage);

  const session = await getUserSession(request, sessionStorage);
  console.log("session", session);
  return session.get("data");
}

export async function updateUserSession(
  request: Request,
  sessionStorage: Storage,
  sessionData: SessionI,
  { redirectTo, message }: UserSessionResponseI
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
