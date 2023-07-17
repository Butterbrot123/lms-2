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
    <div className="flex flex-col items-center justify-center  min-h-screen ">
    <div className="w-full max-w-xl mt-8 bg-gray-50 p-8 rounded-lg shadow-md">
    <h1 className="mb-4 text-3xl lg:text-4xl font-bold">
      Hello, <span className="text-gray-900">{username}</span>! Welcome to your profile.
    </h1>
        <div className="mb-4">
          <span className="font-bold text-lg text-gray-900">Email:</span>{" "}
          {email}
        </div>
        <div className="mb-4">
          <span className="font-bold text-lg text-gray-900">First Name:</span>{" "}
          {firstName}
        </div>
        <div className="mb-4">
          <span className="font-bold text-lg text-gray-900">Last Name:</span>{" "}
          {lastName}
        </div>
        <br></br>
        <br></br>
        <div className="mb-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Your Courses:
          </h2>
          <br />
          {courses.length < 1 && <div>You don't have any courses yet.</div>}
          {sortedCourses.map((course) => (
            <div
              key={course._id}
              className="mb-4 p-4 bg-white rounded-md shadow-md"
            >
              <h1 className="mb-2 text-xl lg:text-2xl font-bold text-gray-800">
                <span className="text-blue-600">Course:</span> {course.course}
              </h1>
              <p className="mb-2 text-gray-900">
                <span className="font-bold">Description:</span>{" "}
                {course.description}
              </p>
              <p className="mb-2 text-gray-900">
                <span className="font-bold">Start Date:</span> {formatDate(course.startdate)}
              </p>
              <p className="mb-2 text-gray-900">
                <span className="font-bold">End Date:</span> {formatDate(course.enddate)}
              </p>
              <p className="mb-2 text-gray-900">
                <span className="font-bold">ECTS:</span> {course.ects}
              </p>
              <p className="mb-2 text-gray-900">
                <span className="font-bold">Semester:</span> {course.semester}
              </p>
              <p className="mb-2 text-gray-900">
                <span className="font-bold">Teacher:</span> {course.teacher}
              </p>
              <p className="mb-2 text-gray-900">
                <span className="font-bold">Lectures:</span> {course.lecture}
              </p>
              <br />
              <div className="flex space-x-2">
                <br />
                <Link
                  to={`/courses/${course._id}/edit`}
                  className="rounded bg-blue-600 text-white px-3 py-2"
                >
                  Edit
                </Link>
                <Form method="delete" action={`/courses/${course._id}`}>
                  <button
                    type="submit"
                    className="rounded bg-red-600 text-white px-3 py-2"
                  >
                    Delete
                  </button>
                </Form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Function to format the date
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US");
}