import { useLoaderData, useCatch, Form, Link } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ params, request }) {
  const session = await requireUserSession(request);
  const db = connectDb();
  const lecture = await db.models.Lecture.findById(params.lectureId);
  if (!lecture) {
    throw new Response(`Couldn't find Lecture with id ${params.lectureId}`, {
      status: 404,
      statusText: "Not Found",
    });
  }
  if (lecture.user.toString() !== session.get("userId")) {
    throw new Response(`You don't have permission to view this lecture`, {
      status: 403,
    });
  }
  return json(lecture);
}

export default function LecturePage() {
  const lecture = useLoaderData();
  
  return (
    <div>
      <div className="flex flex-row items-center gap-1">
        <h1 className="mb-4 text-2xl font-bold">{lecture.lecture}</h1>
        <Form method="post">
          <button name="intent" value="delete" type="submit">
            Delete
          </button>
        </Form>
        <br></br>
        <Link
          to={`/lectures/${lecture._id}/edit`}
          className="rounded p-2 transition-colors hover:bg-amber-100"
        >
          edit
        </Link>
      </div>
      <dl className="my-3">
      <dt className="my-1 text-lg font-bold">Lecture:</dt>
        <dd className="my-2 ">{lecture.title}</dd>
        <dt className="my-1 text-lg font-bold">Course:</dt>
        <dd className="my-2 ">{lecture.courses}</dd>
        <dt className="my-1 text-lg font-bold">Description:</dt>
        <dd className="my-2 ">{lecture.description}</dd>
        <dt className="my-1 text-lg font-bold">Date:</dt>
        <dd className="my-2">{formatDate(lecture.date)}</dd>
        <dt className="my-1 text-lg font-bold">Time:</dt>
        <dd clasName="my-2">{formatTime(lecture.time)}</dd>
      </dl>
    </div>
  );
}
// Function to format the date
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US");
}

// Function to format the time
function formatTime(time) {
  return new Date(time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}


//* lecture.courses ?


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
  const lecture = await db.models.Lecture.findById(params.lectureId);
  if (
    formData.get("intent") === "delete" &&
    lecture.user.toString() === session.get("userId")
  ) {
    await db.models.Lecture.findByIdAndDelete(params.lectureId);
    return redirect("/lectures");
  } else {
    return null;
  }
}
