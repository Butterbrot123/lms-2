import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { sessionCookie } from "~/cookies.server.js";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: sessionCookie,
  });

export { getSession, commitSession, destroySession };

export async function requireUserSession(request) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  if (!session.has("userId")) {
    // If there is no user session, redirect to the login page
    throw redirect("/login");
  }

  return session;
}
