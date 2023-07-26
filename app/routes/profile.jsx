import { useLoaderData, Form, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ params, request }) {
  // Check if the user is authenticated (has a valid session)
  const session = await requireUserSession(request);
  // Connect to the database using the connectDb function
  const db = connectDb();
  // Get the user ID from the session
  const userId = session.get("userId");
  // Find the teacher's data based on the user ID
  const teacher = await db.models.Teacher.findById(userId);
  // Find all courses associated with the user (teacher)
  const courses = await db.models.Course.find({ user: userId });

  if (!courses) {
    throw new Response(`Couldn't find Course with id ${params.courseId}`, {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (!teacher) {
    throw new Response(`Couldn't find Course with id ${params.courseId}`, {
      status: 404,
      statusText: "Not Found",
    });
  }
  // Extract the necessary data from the teacher object
  const { username, email, firstName, lastName } = teacher;

  // Return the fetched data in JSON format
  return json({
    courses,
    username,
    email,
    firstName,
    lastName,
  });
}
//The Index component displays the teacher's profile and their courses
export default function Index() {
  //getrting the data
  const { courses, username, email, firstName, lastName } = useLoaderData();

  // Sort courses by createdAt date in descending order
  const sortedCourses = [...courses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Display the information
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="mt-8 max-w-xl rounded-lg border bg-gray-50 p-6 shadow-md">
        <h1 className="mb-4 text-center text-3xl font-bold text-black lg:text-4xl">
          Hello, <span className="text-blue-600">{username}</span>!
          <br />
          <span className="text-2xl font-semibold text-gray-700">
            Welcome to your profile.
          </span>
        </h1>
        <div className="mb-4 text-center">
          <span className="text-lg font-bold text-gray-900">Email:</span>{" "}
          {email}
        </div>
        <div className="mb-4 text-center">
          <span className="text-lg font-bold text-gray-900">First Name:</span>{" "}
          {firstName}
        </div>
        <div className="mb-4 text-center">
          <span className="text-lg font-bold text-gray-900">Last Name:</span>{" "}
          {lastName}
        </div>
        <div className="mt-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 lg:text-3xl">
            Your Courses:
          </h2>
          <br />
          {courses.length < 1 && <div>You don't have any courses yet.</div>}
          {sortedCourses.map((course) => (
            <div
              key={course._id}
              className="mb-4 rounded-md bg-white p-4 shadow-md"
            >
              <h1 className="mb-2 text-center text-xl font-bold text-blue-600 lg:text-2xl">
                <span></span> {course.course}
              </h1>
              <p className="mb-2 text-center text-gray-900">
                <span className="font-bold"></span>{" "}
                {course.description}
              </p>
              <p className="mb-2 text-center text-gray-900">
                <span className="font-bold">Start Date:</span>{" "}
                {formatDate(course.startdate)}
              </p>
              <p className="mb-2 text-center text-gray-900">
                <span className="font-bold">End Date:</span>{" "}
                {formatDate(course.enddate)}
              </p>
              <p className="mb-2 text-center text-gray-900">
                <span className="font-bold">ECTS:</span> {course.ects}
              </p>
              <p className="mb-2 text-center text-gray-900">
                <span className="font-bold">Semester:</span> {course.semester}
              </p>
              <p className="mb-2 text-center text-gray-900">
                <span className="font-bold">Teacher:</span> {course.teacher}
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <Link
                  to={`/courses/${course._id}/edit`}
                  className="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none"
                >
                  Edit
                </Link>
                <Form method="delete" action={`/courses/${course._id}`}>
                  <button
                    type="submit"
                    className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 focus:bg-red-700 focus:outline-none"
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

// Function to format the date in a readable format (MM/DD/YYYY)
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US");
}
