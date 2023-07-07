import { useLoaderData, Form, Link } from "@remix-run/react";
import { json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";


export async function loader({ params, request }) {
  const session = await requireUserSession(request);
  const db = connectDb();

  const userId = session.get("userId") 
  const teacher = await db.models.Teacher.findById(userId);
  console.log(teacher)

  const course = await db.models.Course.findById(params.courseId);

  console.log(course)  
  console.log(params.courseId)

  if (!course) {
    throw new Response(`Couldn't find Course with id ${params.courseId}`, {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (!course) {
    throw new Response(`Couldn't find Course with id ${params.courseId}`, {
      status: 404,
      statusText: "Not Found",
    });
  }
  if (course.user.toString() !== session.get("userId")) {
    throw new Response(`You don't have permission to view this course`, {
      status: 403,
    });
  }
  
  const courses = []; 

 // const teacher = await db.models.Teacher.findById(course.user.toString());
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
  const {
    courses,
    username,
    email,
    firstName,
    lastName,
    
  } = useLoaderData();

  // Sort courses by createdAt date in descending order
  const sortedCourses = [...courses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <>
      <div className="flex">
        <ul>
          <h1 className="text-4xl font-bold mb-4">
            Hello, {username}! Welcome to your profile.
          </h1>
          <span className="font-bold text-2xl mb-4">Email:</span> {email}
          <br />
          <span className="font-bold">First Name:</span> {firstName}
          <br />
          <span className="font-bold">Last Name:</span> {lastName}
          <br />
          <br />

          <h2 className="text-3xl font-bold mb-4">Your Courses:</h2>
          {courses.length < 1 && <div>You don't have any courses yet.</div>}
          {sortedCourses.map((course) => {
            return (
              <div key={course._id}>

                <Link
                  to={`/${course._id}/edit`}
                  className="bg-blue-400 py-2 px-3 rounded"
                >
                  Edit
                </Link>
                <Form method="delete" action={`/${course._id}`}>
                  <button type="submit" className="bg-blue-400 py-2 px-3 rounded">
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