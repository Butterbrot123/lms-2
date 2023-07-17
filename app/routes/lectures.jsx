import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { useState } from "react";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ request }) {
 const session = await requireUserSession(request);
  const db = connectDb();
  const lectures = await db.models.Lecture.find({
    user: session.get("userId"),
  });
  return lectures;
}

export default function Index() {
  const lectures = useLoaderData();
  const [searchTerm, setSearchTerm] = useState("");



let filteredLectures = lectures
const sanitizedSearchTerm = searchTerm.toLowerCase().trim()

if (sanitizedSearchTerm) {
  filteredLectures = lectures.filter(lecture => {
    return lecture.title.toLowerCase().includes(sanitizedSearchTerm) 
  })
}

  
  return (
    <div className="gap-4 md:grid md:grid-cols-2">
      <div className="mb-5 border-orange-200 md:mb-0 md:mr-3 md:border-r md:pr-5">
        <h1 className="mb-4 text-2xl font-bold">My favorite Lectures</h1>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Filter by Lecture"
          className="mb-3 w-full rounded border border-orange-200 p-2"
   />
        <ul className="ml-5 list-disc">
          {filteredLectures.map((lecture) => {
            return (
              <li key={lecture._id}>
                <Link
                  to={`/lectures/${lecture._id}`}
                  className="text-orange-600 hover:underline"
                >
                  {lecture.title}
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
