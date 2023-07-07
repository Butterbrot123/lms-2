import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";

export async function loader() {
  const db = connectDb();
  const courses = await db.models.Course.find();
  return json(courses);
}

export default function Index() {
  const courses = useLoaderData();
  return (
    <main>
    
      <h1 className="mb-2 text-lg font-bold">List of courses</h1>
      <ul className="list-inside list-decimal">
        {courses.map((course) => (
          <li key={course._id}>{course.title}</li>
        ))}
      </ul>
      {/* Just for debugging purposes */}
      <code className="mt-5 block rounded-md border  bg-green-100 p-3 text-green-700">
        <pre>{JSON.stringify(courses, null, 2)}</pre>
      </code>
    </main>
  );
}
