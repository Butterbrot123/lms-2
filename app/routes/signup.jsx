import { useActionData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import bcrypt from "bcryptjs";
import { json, redirect } from "@remix-run/node";

export async function action({ request }) {
  const db = connectDb();
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  // Check if any required fields are empty
  const requiredFields = ["username", "emailaddress", "firstName", "lastName", "password", "passwordConfirm"];
  const emptyFields = requiredFields.filter(field => !data[field]);
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

  return (
    <div>
      {errors && <div>{errors.errorMessage}</div>}

      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form method="post" action="/signup" className="space-y-4">
        <div>
          <label htmlFor="username" className="block">
            Username:
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            className="rounded border border-gray-300 px-3 py-2 text-slate-700"
          />
        </div>

        <div>
          <label htmlFor="firstName" className="block">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="First Name"
            className="rounded border border-gray-300 px-3 py-2 text-slate-700"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Last Name"
            className="rounded border border-gray-300 px-3 py-2 text-slate-700"
          />
        </div>

        <div>
          <label htmlFor="emailaddress" className="block">
            Email Address:
          </label>
          <input
            type="text"
            name="emailaddress"
            id="emailaddress"
            placeholder="Email Address"
            className="rounded border border-gray-300 px-3 py-2 text-slate-700"
          />
        </div>

        <div>
          <label htmlFor="password" className="block">
            Password:
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="rounded border border-gray-300 px-3 py-2 text-slate-700"
          />
        </div>

        <div>
          <label htmlFor="passwordConfirm" className="block">
            Confirm Password:
          </label>
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            placeholder="Repeat Password"
            className="rounded border border-gray-300 px-3 py-2 text-slate-700"
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2">
          Register
        </button>
      </form>
    </div>
  );
}