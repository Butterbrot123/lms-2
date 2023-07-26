import { json, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getSession, commitSession } from "~/sessions.server.js";

// The loader function is responsible for fetching data on the server-side before rendering the page
export async function loader({ request }) {
  // Retrieve the user's session using the getSession function and the "Cookie" header from the request
  const session = await getSession(request.headers.get("Cookie"));
  return json({ userId: session.get("userId") });
}

export default function Login() {
  // Fetch the userId and actiondata
  const actionData = useActionData();
  const { userId } = useLoaderData();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="mx-auto mt-12 max-w-md rounded-lg border bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-blue-600">
          Login
        </h1>
        {actionData?.errorMessage && (
          <p className="mb-3 rounded border border-red-500 bg-red-50 p-2 text-red-900">
            {actionData?.errorMessage}
          </p>
        )}
        {userId ? (
          <div>
            <p className="mb-3">
              You are already logged in as:
              <code className="ml-2 inline-block rounded bg-black p-2 text-white">
                {userId}
              </code>
            </p>
            <Form method="post" action="/logout">
              <Button>Logout</Button>
            </Form>
          </div>
        ) : (
          <Form method="post" reloadDocument className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block font-semibold text-black"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                className="w-full rounded  border bg-gray-50 px-3 py-2 text-slate-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block font-semibold text-black"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                className="w-full rounded border bg-gray-50 px-3 py-2 text-slate-700 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <Button>Login</Button>
          </Form>
        )}
      </div>
    </div>
  );
}
export async function action({ request }) {
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);
  // Retrieve the user's session using the getSession function and the "Cookie" header from the request
  const session = await getSession(request.headers.get("Cookie"));
  const db = connectDb();

  // Find the user in the database based on the provided username
  const user = await db.models.Teacher.findOne({
    username: formData.get("username").trim(),
  });

  if (!user) {
    return json(
      // If the user is not found, return an error response with status 404
      { errorMessage: "User not found", values: formDataObject },
      { status: 404 }
    );
  }
  // Check if the provided password matches the hashed password stored in the database
  const passwordIsValid = await bcrypt.compare(
    formData.get("password").trim(),
    user.password
  );
  // If the password is invalid, return an error response with status 401
  if (!passwordIsValid) {
    return json(
      { errorMessage: "Invalid password", values: formDataObject },
      { status: 401 }
    );
  }
  // If the user exists and the password is valid, set the userId in the session
  session.set("userId", user._id);
  // Redirect the user to the "/courses" page after successful login
  return redirect("/courses", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

function Button({ children }) {
  return (
    <button
      type="submit"
      className="mt-4 w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none"
    >
      {children}
    </button>
  );
}
