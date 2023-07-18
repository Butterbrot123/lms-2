import { json } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { useState } from "react";
import { requireUserSession } from "~/sessions.server";

export async function loader({ request }) {
  const session = await requireUserSession(request);
  const db = await connectDb(); // Added 'await' to connectDb() function call
  const courses = await db.models.Course.find({
    user: session.get("userId"),
  });
  return json(courses);
}

export default function Index() {
  const courses = useLoaderData();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(0);

  let filteredCourses = courses;

  const sanitizedSearchTerm = searchTerm?.toLowerCase()?.trim() ?? "";
  if (sanitizedSearchTerm) {
    filteredCourses = courses.filter((course) => {
      return (
        course.course.toLowerCase().includes(sanitizedSearchTerm) ||
        course.description.toLowerCase().includes(sanitizedSearchTerm)
      );
    });
  }

  if (selectedSemester !== 0) {
    filteredCourses = filteredCourses.filter((course) => {
      return course.semester == selectedSemester;
    });
  }

  // TODO
  let uni =  [...new Set(courses)]
  console.log(uni)

  let optionItems = courses.map((course) => {
    let _selectedSemester =
      course.semester === selectedSemester ? " selected" : "";
    return (
      <option key={course._id} {..._selectedSemester}>
        {course.semester}
      </option>
    );
  });

  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="mb-8 text-4xl font-bold">Explore all our courses</h1>
      <div className="mb-6 flex justify-center space-x-4">
        <input
          type="search"
          placeholder="Search for a course"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="mb-6 w-64 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="semester" className="block font-semibold">
          Semester:
        </label>

        <select
          id="semester"
          placeholder="Semester"
          name="Semester"
          onChange={(event) => setSelectedSemester(event.target.value)}
        >
          {optionItems}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredCourses.map((course) => (
          <div key={course._id} className="rounded-md bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-bold text-blue-600">
              {course.course}
            </h2>
            <p className="mb-2 text-gray-800">
              <span className="font-bold">Description: </span>
              {course.description}
            </p>
            <p className="mb-2 text-gray-800">
              <span className="font-bold">Education: </span>
              {course.education}
            </p>
            <p className="mb-2 text-gray-800">
              <span className="font-bold">Start Date: </span>
              {formatDate(course.startdate)}
            </p>
            <p className="mb-2 text-gray-800">
              <span className="font-bold">End Date: </span>
              {formatDate(course.enddate)}
            </p>
            <p className="mb-2 text-gray-800">
              <span className="font-bold">ECT: </span>
              {course.ects}
            </p>
            <p className="mb-2 text-gray-800">
              <span className="font-bold">Semester: </span>
              {course.semester}
            </p>
            <p className="mb-2 text-gray-800">
              <span className="font-bold">Teacher: </span>
              {course.teacher}
            </p>

            <div className="mt-4 flex space-x-2">
              <Link
                to={`/courses/${course._id}/edit`}
                className="rounded bg-blue-600 px-3 py-2 text-white"
              >
                Edit
              </Link>
              <Form method="delete" action={`/courses/${course._id}`}>
                <button
                  type="submit"
                  className="rounded bg-red-600 px-3 py-2 text-white"
                >
                  Delete
                </button>
              </Form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// Function to format the date
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US");
}
