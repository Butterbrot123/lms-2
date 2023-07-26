import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { useState } from "react";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ request }) {
  const session = await requireUserSession(request);
  const db = connectDb();
  const courses = await db.models.Course.find({
    user: session.get("userId"),
  });
  return courses;
}

export default function Index() {
  const courses = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");

  // Create a copy of the 'courses' array to hold filtered courses
  let filteredCourses = courses;
  // Sanitize the search term by converting to lowercase and removing extra spaces
  const sanitizedSearchTerm = searchTerm.toLowerCase().trim();

  // Filtering the courses based on the search term
  if (sanitizedSearchTerm) {
    filteredCourses = courses.filter((course) => {
      return course.course.toLowerCase().includes(sanitizedSearchTerm);
    });
  }

  return (
    <div className="gap-4 md:grid md:grid-cols-2">
      <div className="mb-5 border-blue-200 md:mb-0 md:mr-3 md:border-r md:pr-5">
        <h1 className="mb-4 text-2xl font-bold text-blue-500">
          My favorite Courses
        </h1>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Filter by Course"
          className="border-grey-200 mb-3 w-full rounded border p-2"
        />

        <ul className="ml-5 list-disc">
          {filteredCourses.map((course) => {
            return (
              <li key={course._id}>
                <Link
                  to={`/courses/${course._id}`}
                  className="text-grey-400 hover:underline"
                >
                  {course.course}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
