import { useLoaderData, useCatch, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ params, request }) {
  const session = await requireUserSession(request);
  const db = connectDb();
  const course = await db.models.Course.findById(params.courseId);
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
  return json(course);
}

export default function CoursePage() {
  const course = useLoaderData();
  return (
    <div>
      <div className="flex flex-row items-center gap-1">
        <h1 className="mb-4 text-2xl font-bold">{course.course}</h1>
      </div>
      <dl className="my-3">
        <dt className="my-1 text-lg font-bold">Education:</dt>
        <dd className="my-2">{course.education}</dd>
        <dt className="my-1 text-lg font-bold">Description:</dt>
        <dd className="my-2 ">{course.description}</dd>
        <dt className="my-1 text-lg font-bold">Teacher:</dt>
        <dd className="my-2 ">{course.teacher}</dd>
        <dt className="my-1 text-lg font-bold">Start Date:</dt>
        <dd className="my-2">{formatDate(course.startdate)}</dd>
        <dt className="my-1 text-lg font-bold">End Date:</dt>
        <dd className="my-2">{formatDate(course.enddate)}</dd>
        <dt className="my-1 text-lg font-bold">Semester:</dt>
        <dd className="my-2">{course.semester}</dd>
        <dt className="my-1 text-lg font-bold">ECTS:</dt>
        <dd className="my-2 ">{course.ects}</dd>
      </dl>
      <h2 className="my-3 border-t border-orange-200 pt-3 text-xl font-bold">
        Lectures
      </h2>
      <ol className="ml-5 list-decimal">
        {course.lecture?.split(",")?.map((lecture) => {
          return (
            <li key={lecture} className="my-2">
              {lecture}
            </li>
          );
        })}
      </ol>
      <div className="flex gap-2">
        <Form method="post">
          <button
            name="intent"
            value="delete"
            type="submit"
            className="rounded bg-red-600 px-3 py-2 text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </Form>
        <br></br>
        <Link
          to={`/courses/${course._id}/edit`}
          className="rounded bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
// Function to format the date
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US");
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <div>
      <h1>
        {caught.status} {caught.statusText}
      </h1>
      <h2>{caught.data}</h2>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1 className="font-bold text-red-500">
        {error.name}: {error.message}
      </h1>
      <pre>{error.stack}</pre>
    </div>
  );
}

export async function action({ request, params }) {
  const session = await requireUserSession(request);
  const formData = await request.formData();
  const db = connectDb();
  const course = await db.models.Course.findById(params.courseId);
  if (
    formData.get("intent") === "delete" &&
    course.user.toString() === session.get("userId")
  ) {
    await db.models.Course.findByIdAndDelete(params.courseId);
    return redirect("/courses");
  } else {
    return null;
  }
}
