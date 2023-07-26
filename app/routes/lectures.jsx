import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { useState } from "react";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

// The loader function is responsible for fetching data on the server-side before rendering the page
export async function loader({ request }) {
  // Require that the user has an active session.
  const session = await requireUserSession(request);
  // Connect to the database using the connectDb function
  const db = connectDb();
  // Fetch lectures from the database for the user with the matching userId from the session
  const lectures = await db.models.Lecture.find({
    user: session.get("userId"),
  });
  return lectures;
}

// The Index component handles the user interface for the index page
export default function Index() {
  const lectures = useLoaderData();
  // Use state to manage the search term for filtering lectures
  const [searchTerm, setSearchTerm] = useState("");

  let filteredLectures = lectures;
  // Convert the search term to lowercase and remove leading/trailing spaces
  const sanitizedSearchTerm = searchTerm.toLowerCase().trim();
  // If there's a search term, filter the lectures based on the lecture title
  if (sanitizedSearchTerm) {
    filteredLectures = lectures.filter((lecture) => {
      return lecture.title.toLowerCase().includes(sanitizedSearchTerm);
    });
  }

  return (
    <div className="gap-4 md:grid md:grid-cols-2">
      <div className="mb-5 border-gray-300 md:mb-0 md:mr-3 md:border-r md:pr-5">
        <h1 className="text-blue-500 font-bold mb-4 text-2xl">
          My favorite Lectures
        </h1>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Filter by Lecture"
          className="w-full rounded  border bg-gray-50 px-3 py-2 text-slate-700 focus:border-blue-500 focus:outline-none"
        />
        <ul className="ml-5 list-disc">
          {filteredLectures.map((lecture) => {
            return (
              <li key={lecture._id}>
                <Link
                  to={`/lectures/${lecture._id}`}
                  className="text-blue-500 hover:underline"
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
