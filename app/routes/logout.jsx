import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions.server";


// The 'loader' function is afunction that handles the request.
export function loader(request) {
  return redirect("/login");
}
  //  We retrieve the user's session using the 'getSession' function,
  // passing the "Cookie" header from the request.
export async function action({ request }) {
  const session = await getSession(request.headers.get("Cookie"));

   // After obtaining the session, we destroy it using the 'destroySession' function.
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
