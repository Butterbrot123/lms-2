import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { useState } from "react";
import { requireUserSession } from "~/sessions.server";
 export async function loader({ request }) {
  const session = await requireUserSession(request);
  const db = connectDb(); 
  const courses = await db.models.Course.find({
    user: session.get("userId"),
  });
  return json(courses);
}
 export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const courses = useLoaderData();
   let filteredCourses = courses;


  const sanitizedSearchTerm = searchTerm.toLowerCase().trim();
   if (sanitizedSearchTerm) {
    filteredCourses = courses.filter((course) => {
      return (
        course.course.toLowerCase().includes(sanitizedSearchTerm) ||
        course.description.toLowerCase().includes(sanitizedSearchTerm)
      )
    })
  }
   return (
    <main>
      <input
        type="search"
        placeholder="Search for a course"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

 <code className="mt-5 block rounded-md border bg-green-100 p-3 text-green-700">
        <pre>{JSON.stringify(filteredCourses, null, 2)}</pre>
      </code>
       </main>
  );
}