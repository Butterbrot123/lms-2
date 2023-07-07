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



let filteredCourses = courses
const sanitizedSearchTerm = searchTerm.toLowerCase().trim()

if (sanitizedSearchTerm) {
  filteredCourses = courses.filter(course => {
    return course.title.toLowerCase().includes(sanitizedSearchTerm) //|| album.artist.toLowerCase().includes(sanitizedSearchTerm)
  })
}

  
  return (
    <div className="gap-4 md:grid md:grid-cols-2">
      <div className="mb-5 border-orange-200 md:mb-0 md:mr-3 md:border-r md:pr-5">
        <h1 className="mb-4 text-2xl font-bold">My favorite Courses</h1>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Filter by Course"
          className="mb-3 w-full rounded border border-orange-200 p-2"
        />
        <p>{searchTerm}</p>
        <ul className="ml-5 list-disc">
          {filteredCourses.map((course) => {
            return (
              <li key={course._id}>
                <Link
                  to={`/courses/${course._id}`}
                  className="text-orange-600 hover:underline"
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
