import { useLoaderData, Form, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ params, request }) {
  const session = await requireUserSession(request);
  const db = connectDb();
  const userId = session.get("userId");
  const teacher = await db.models.Teacher.findById(userId);
  const courses = await db.models.Course.find({ user: userId });

  if (!courses) {
    throw new Response(`Couldn't find Course with id ${params.courseId}`, {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (!teacher) {
    // TODO: change
    throw new Response(`Couldn't find Course with id ${params.courseId}`, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { username, email, firstName, lastName } = teacher;

  return json({
    courses,
    username,
    email,
    firstName,
    lastName,
  });
}

export default function Index() {
  const { courses, username, email, firstName, lastName } = useLoaderData();

  // Sort courses by createdAt date in descending order
  const sortedCourses = [...courses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="flex flex-col items-start">
      <h1 className="mb-4 text-4xl font-bold">
        Hello, {username}! Welcome to your profile.
      </h1>
      <div className="mb-4">
        <span className="text-2xl font-bold">Email:</span> {email}
      </div>
      <div className="mb-4">
        <span className="font-bold">First Name:</span> {firstName}
      </div>
      <div className="mb-4">
        <span className="font-bold">Last Name:</span> {lastName}
      </div>
      <div className="mb-4">
        <h2 className="text-3xl font-bold">Your Courses:</h2>
        <br></br>
        {courses.length < 1 && <div>You don't have any courses yet.</div>}
        {sortedCourses.map((course) => (
          <div key={course._id} className="mb-4">
            <h1 className="text-xl font-bold">{course.course}</h1>
            <br></br>
            <div className="flex space-x-2">
              <br></br>
              <Link
                to={`/courses/${course._id}/edit`}
                className="rounded bg-blue-400 px-3 py-2 text-white"
              >
                Edit
              </Link>
              <Form method="delete" action={`/courses/${course._id}`}>
                <button
                  type="submit"
                  className="rounded bg-red-500 px-3 py-2 text-white"
                >
                  Delete
                </button>
              </Form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}