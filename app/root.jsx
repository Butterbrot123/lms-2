import { json } from "@remix-run/node";
import {
  Links,
  Link,
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

// Function to define the meta tags for the HTML document.
export function meta() {
  return {
    charset: "utf-8",
    title: "awu-exam",
    viewport: "width=device-width,initial-scale=1",
  };
}

// Loader function to fetch and prepare data needed for the component.
export async function loader({ request }) {
  // Get the user session information
  const session = await getSession(request.headers.get("Cookie"));

  // Return the user authentication status as JSON data.
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
      <body className="bg-gray-100 p-4 font-sans text-gray-900">
        <header className="mb-4 flex flex-row items-center justify-between border-b border-gray-300 pb-3">
          <div>
            <Link to="/courses" className="text-black hover:text-blue-600">
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/courses/new"
                  className="ml-3 text-black hover:text-blue-600"
                >
                  New course
                </Link>

                <Link
                  to="/lectures/new"
                  className="ml-3 text-black hover:text-blue-600"
                >
                  New lecture
                </Link>

                <Link
                  to="/profile"
                  className="ml-3 text-black hover:text-blue-600"
                >
                  Profile
                </Link>

                <Link
                  to="/explore"
                  className="ml-3 text-black hover:text-blue-600"
                >
                  Explore
                </Link>
              </>
            )}
          </div>

          <div>
            {isAuthenticated ? (
              <Form method="post" action="/logout" className="inline">
                <button className="font-bold text-black hover:text-blue-600">
                  Logout
                </button>
              </Form>
            ) : (
              <>
                <Link to="/signup" className="text-black hover:text-blue-600">
                  Signup
                </Link>

                <Link
                  to="/login"
                  className="ml-3 text-black hover:text-blue-600"
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
      </body>
    </html>
  );
}
