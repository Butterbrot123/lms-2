import { useLoaderData, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
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
    <>
      <div className="flex">
        <ul>
          <h1 className="mb-4 text-4xl font-bold">
            Hello, {username}! Welcome to your profile.
          </h1>
          <span className="mb-4 text-2xl font-bold">Email:</span> {email}
          <br />
          <span className="font-bold">First Name:</span> {firstName}
          <br />
          <span className="font-bold">Last Name:</span> {lastName}
          <br />
          <br />
          <h2 className="mb-4 text-3xl font-bold">Your Courses:</h2>
          {courses.length < 1 && <div>You don't have any courses yet.</div>}
          {sortedCourses.map((course) => {
            // TODO: fix me or delete me
            return (
              <div key={course._id}>
                <br />
                <h1></h1> {course.course}
                <br />
                <br />
                <Link
                  to={`/courses/${course._id}/edit`}
                  className="rounded bg-blue-400 px-3 py-2"
                >
                  Edit
                </Link>
                
                <Form method="delete" action={"/courses"}>
                  <button
                    type="submit"
                    className="rounded bg-blue-400 px-3 py-2"
                  >
                    Delete
                  </button>
                </Form>
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
}
