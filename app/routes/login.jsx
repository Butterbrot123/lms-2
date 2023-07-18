import { json, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getSession, commitSession } from "~/sessions.server.js";

export async function loader({ request }) {
  const session = await getSession(request.headers.get("Cookie"));
  // Our session cookie is HTTPOnly, so we have to read it on the server and
  // return it to the client as loader data
  return json({ userId: session.get("userId") });
}

export default function Login() {
  const actionData = useActionData();
  const { userId } = useLoaderData();
  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">Login</h1>
      {actionData?.errorMessage && (
        <p className="mb-3 rounded border border-red-500 bg-red-50 p-2 text-red-900">
          {actionData?.errorMessage}
        </p>
      )}
      {userId ? (
        <div>
          <p>
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
        <Form method="post" reloadDocument>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            defaultValue={actionData?.values?.username}
          />
          <Label htmlFor="emailaddress">Email-Address</Label>
          <Input
            type="text"
            name="emailaddress"
            id="emailaddress"
            placeholder="Email-Address"
            defaultValue={actionData?.values?.emailaddress}
          />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            defaultValue={actionData?.values?.password}
          />
          <br />
          <Button>Login</Button>
        </Form>
      )}
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const formDataObject = Object.fromEntries(formData);
  // console.log(formDataObject);
  const session = await getSession(request.headers.get("Cookie"));
  const db = connectDb();

  const user = await db.models.Teacher.findOne({
    username: formData.get("username").trim(),
  });
  //  console.log(user);
  if (!user) {
    return json(
      // Also return values so we can pre-populate the form
      { errorMessage: "User not found", values: formDataObject },
      { status: 404 }
    );
  }

  const passwordIsValid = await bcrypt.compare(
    formData.get("password").trim(),
    user.password
  );
  if (!passwordIsValid) {
    return json(
      // Also return values so we can pre-populate the form
      { errorMessage: "Invalid password", values: formDataObject },
      { status: 401 }
    );
  }
  // If the user exists and the password is valid, set the userId in the session...
  session.set("userId", user._id);
  // ...and go to the albums page, updating the session cookie in the process
  return redirect("/courses", {
    headers: {
      // Because we've set a value on the session, we need to commit it to the
      // session cookie
      "Set-Cookie": await commitSession(session),
    },
  });
}

// Components --------------------------------------------------------
function Button({ children }) {
  return (
    <button
      type="submit"
      className="mt-3 rounded bg-orange-600 p-2 text-white transition-colors hover:bg-orange-700"
    >
      {children}
    </button>
  );
}

function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block font-semibold">
      {children}
    </label>
  );
}

function Input({ name, id = name, type = "text", ...rest }) {
  return (
    <input
      type={type}
      name={name}
      id={id}
      className="mb-3 rounded border border-slate-200 p-2"
      {...rest}
    />
  );
}
