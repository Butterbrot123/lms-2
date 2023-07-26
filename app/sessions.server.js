import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { sessionCookie } from "~/cookies.server.js";

// Create session storage using the session cookie.
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: sessionCookie,
  });

export { getSession, commitSession, destroySession };

// Function to check if a user session exists, and if not, redirect to the login page.
export async function requireUserSession(request) {
  const cookie = request.headers.get("Cookie");
  const session = await getSession(cookie);

  if (!session.has("userId")) {

    throw redirect("/login");
  }

  return session;
}
