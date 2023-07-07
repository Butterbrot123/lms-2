import { useActionData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server";
import { getSession, requireUserSession } from "~/sessions.server";
import bcrypt from 'bcryptjs';
import { json, redirect } from "@remix-run/node";

export async function loader({ request }) {
  await requireUserSession(request);
  return null;
}

export async function action({ request }) {
  const session = await getSession(request);
  const db = connectDb();
  const formData = await request.formData();
  let data = Object.fromEntries(formData);
  const Teacher = db.models.Teacher.find({
    user: session.get("userId"), 
  });

  


   // Check if any required fields are empty
   if (data.password === "" || data.username === "" || data.email === ""  || data.firstName === "" || data.lastName === "" ) {
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
     const newTeacher = new Teacher({
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
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
  const dataAction = useActionData();
  return (
    <div>
      {errors && <div>{errors.errorMessage}</div>}

      <div>Register</div>
      <form method="post" action="/signup">
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="First Name"
            className="text-slate-700 border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Last Name"
            className="text-slate-700 border border-gray-300 rounded px-3 py-2"
          />
        </div>

        <div>
          <label>Email Address:</label>
          <input
            type="text"
            name="emailaddress"
            id="emailaddress"
            placeholder="Email Address"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="pwd1"
            id="pwd1"
            placeholder="Password"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value="password"
            id="pwd1"
            placeholder="password"
            defaultValue={dataAction?.values?.password}
          />
        </div>
        <div>
          <label>Repeat Password:</label>
          <input
            type="password"
            value="repeatpassword"
            id="pwd2"
            placeholder="repeat password"
            defaultValue={dataAction?.values?.passwordConfirm}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
