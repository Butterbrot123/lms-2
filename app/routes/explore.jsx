import { json } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import connectDb from "~/db/connectDb.server.js";
import { useState, MenuItem } from "react";
import { requireUserSession } from "~/sessions.server";



export async function loader({ request }) {
  const session = await requireUserSession(request);
  const db = await connectDb(); // Added 'await' to connectDb() function call
  const courses = await db.models.Course.find({
    user: session.get("userId"),
  });
  return json(courses);
}

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const courses = useLoaderData();
  let filteredCourses = courses;

  const handleChange = (event) => {
    console.log(event.target.value)
    setSelectedCourse(event.target.value);
  };

  const sanitizedSearchTerm = searchTerm.toLowerCase().trim();
  if (sanitizedSearchTerm) {
    filteredCourses = courses.filter((course) => {
      return (
        course.course.toLowerCase().includes(sanitizedSearchTerm) ||
        course.description.toLowerCase().includes(sanitizedSearchTerm)
      );
    });
  }
  
  /*
  if (selectedCourse !== "All" && selectedCourse.length !== 0) {
    console.log(selectedCourse + 'helooo')
    console.log(filteredCourses)
    filteredCourses = filteredCourses.filter((course) => {
      return course.course.toLowerCase() === selectedCourse.toLowerCase();
    });
    console.log(filteredCourses)
  }
  */

  let optionItems = courses.map((course) => {
    //let selectedCourse  = lecture.courses.includes( course._id) ? ' selected' : '';
    return (
      <option key={course._id}>{course.semester}</option>
    )
    })
  // https://stackoverflow.com/questions/68563765/how-to-display-data-from-the-database-in-select-option



  return (
    <main className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Explore all our courses</h1>
      <div className="flex justify-center mb-6 space-x-4">
        <input
          type="search"
          placeholder="Search for a course"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-64 px-3 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>

        
     
<div className="mb-4">
          <label htmlFor="semester" className="block font-semibold">
            Semester:
          </label>

<select id="semester" placeholder="Semester" name="Semester">
            {optionItems}
          </select>
      
    
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filteredCourses.map((course) => (
          <div key={course._id} className="rounded-md bg-white shadow-lg p-6">
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

            <div className="flex space-x-2 mt-4">
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
    </main>
  );
}

// Function to format the date
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US");
}