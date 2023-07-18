import { json } from "@remix-run/node";
import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Form,
} from "@remix-run/react";
import styles from "~/tailwind.css";
import { getSession } from "./sessions.server";

export const links = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export function meta() {
  return {
    charset: "utf-8",
    title: "awu-exam",
    viewport: "width=device-width,initial-scale=1",
  };
}

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  return json({
    isAuthenticated: session.has("userId"),
  });
}

export default function App() {
  const { isAuthenticated } = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-orange-50 p-4 font-sans text-amber-900">
        <header className="mb-4 flex flex-row items-center justify-between border-b border-orange-200 pb-3">
          <div>
            <Link to="/courses" className="text-orange-600 hover:underline">
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/courses/new"
                  className="ml-3 text-orange-600 hover:underline"
                >
                  New course
                </Link>

                <Link
                  to="/lectures/new"
                  className="ml-3 text-orange-600 hover:underline"
                >
                  New lecture
                </Link>

                <Link
                  to="/profile"
                  className="ml-3 text-orange-600 hover:underline"
                >
                  Profile
                </Link>

                <Link
                  to="/explore"
                  className="ml-3 text-orange-600 hover:underline"
                >
                  Explore
                </Link>
              </>
            )}
          </div>

          <div>
            {isAuthenticated ? (
              <Form method="post" action="/logout" className="inline">
                <button className="text-orange-600 hover:underline">
                  Logout
                </button>
              </Form>
            ) : (
              <>
                <Link to="/signup" className="text-orange-600 hover:underline">
                  Signup
                </Link>

                <Link
                  to="/login"
                  className="ml-3 text-orange-600 hover:underline"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
