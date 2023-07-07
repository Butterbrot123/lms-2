import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/sessions.server";


export function loader( request ) {
    return redirect("/login");
}

export async function action({ request }) {
  //  const session = await requireUserSession(request);
  const session = await getSession(request.headers.get("Cookie"));

    return redirect("/login", {
        headers: {
            "Set-Cookie": await destroySession(session)
        }
    });
}