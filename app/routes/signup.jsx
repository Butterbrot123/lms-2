import { useActionData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import { json, redirect } from "@remix-run/node";

// This is the action function that handles form submission on the server-side
export async function action({ request }) {
  // Connect to the database using the connectDb function
  const db = connectDb();
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Check if any required fields are empty
  const requiredFields = [
    "username",
    "emailaddress",
    "firstName",
    "lastName",
    "password",
    "passwordConfirm",
  ];
  const emptyFields = requiredFields.filter((field) => !data[field]);
  if (emptyFields.length > 0) {
    return json(
      { errorMessage: "Please fill out all fields", values: data },
      { status: 400 }
    );
  }

  // Check if password and confirm password match
  if (data.password !== data.passwordConfirm) {
    return json(
      { errorMessage: "Passwords do not match", values: data },
      { status: 400 }
    );
  } else {
    const hashedPassword = await bcrypt.hash(data.password.trim(), 10);

    // Create a new user object with the provided data
    const newTeacher = new db.models.Teacher({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.emailaddress,
      password: hashedPassword,
    });

    // Save the new teacher to the database
    await newTeacher.save();

    // Redirect to the login page after successful signup
    return redirect("/login");
  }
}

export default function Register() {
  const errors = useActionData();

  // Form
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      {errors && <div className="text-red-500">{errors.errorMessage}</div>}
      <div className="mx-auto mt-12 max-w-md rounded-lg border bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-blue-600">
          Register
        </h1>
        <form method="post" action="/signup" className="space-y-4">
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
              htmlFor="firstName"
              className="block font-semibold text-black"
            >
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="First Name"
              className="text-slate-70 w-full  rounded border bg-gray-50 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block font-semibold text-black"
            >
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Last Name"
              className="text-slate-70 w-full  rounded border bg-gray-50 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="emailaddress"
              className="block font-semibold text-black "
            >
              Email Address:
            </label>
            <input
              type="text"
              name="emailaddress"
              id="emailaddress"
              placeholder="Email Address"
              className="w-full rounded  border bg-gray-50 px-3 py-2 text-slate-700 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-semibold text-black"
            >
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="text-slate-70 w-full  rounded border bg-gray-50 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="block font-semibold text-black"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              placeholder="Repeat Password"
              className="text-slate-70 w-full  rounded border bg-gray-50 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
