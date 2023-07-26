import { Form, useActionData, useLoaderData, useCatch } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";
import { format } from "date-fns";

export async function loader({ params, request }) {
  const session = await requireUserSession(request);
  const db = connectDb();
  // It fetches the course data from the database based on the courseId.
  const course = await db.models.Course.findById(params.courseId);
  // Checking if the course is found and if the user has permission to view it
  if (!course) {
    throw new Response(`Couldn't find course with id ${params.courseId}`, {
      status: 404,
      statusText: "Not Found",
    });
  }
  if (course.user.toString() !== session.get("userId")) {
    throw new Response(`You don't have permission to view this course`, {
      status: 403,
    });
  }
  // Returning the course data as JSON
  return json(course);
}

export default function Editcourse() {
  const course = useLoaderData();
  const actionData = useActionData();

  // Rendering the form to edit the course
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Edit Course</h1>
      <Form method="post">
        <label htmlFor="title" className="mb-1 block font-semibold">
          Course:
        </label>
        <input
          type="text"
          name="course"
          id="course"
          placeholder="Course"
          defaultValue={course.course ?? actionData?.values.course}
          className={[
            "rounded border border-orange-200  p-2",
            actionData?.errors.course ? "border-2 border-red-500" : "",
          ].join(" ")}
        />
        {actionData?.errors.course && (
          <p className="mb-0 mt-1 text-red-500">
            {actionData.errors.course.message}
          </p>
        )}

        <label htmlFor="title" className="mb-1 block font-semibold">
          Education:
        </label>
        <input
          type="text"
          name="education"
          id="education"
          placeholder="Education"
          defaultValue={course.education ?? actionData?.values.education}
          className={[
            "rounded border border-orange-200  p-2",
            actionData?.errors.education ? "border-2 border-red-500" : "",
          ].join(" ")}
        />
        {actionData?.errors.education && (
          <p className="mb-0 mt-1 text-red-500">
            {actionData.errors.education.message}
          </p>
        )}

        <label htmlFor="description" className="mb-1 block font-semibold">
          Description:
        </label>
        <textarea
          name="description"
          id="description"
          rows="4"
          placeholder="Description"
          defaultValue={course.description ?? actionData?.values.description}
          className={[
            "rounded border border-orange-200  p-2",
            actionData?.errors.description ? "border-2 border-red-500" : "",
          ].join(" ")}
        />
        {actionData?.errors.description && (
          <p className="mb-0 mt-1 text-red-500">
            {actionData.errors.description.message}
          </p>
        )}

        <label htmlFor="title" className="mb-1 block font-semibold">
          Startdate:
        </label>
        <input
          type="date"
          name="startdate"
          id="startdate"
          placeholder="Startdate"
          defaultValue={
            actionData?.values.startdate ?? course.startdate
              ? format(new Date(course.startdate), "yyyy-MM-dd")
              : ""
          }
          className={[
            "rounded border border-orange-200  p-2",
            actionData?.errors.startdate ? "border-2 border-red-500" : "",
          ].join(" ")}
        />
        {actionData?.errors.startdate && (
          <p className="mb-0 mt-1 text-red-500">
            {actionData.errors.startdate.message}
          </p>
        )}

        <label htmlFor="title" className="mb-1 block font-semibold">
          Enddate:
        </label>
        <input
          type="date"
          name="enddate"
          id="enddate"
          placeholder="Enddate"
          defaultValue={
            actionData?.values.enddate ?? course.enddate
              ? format(new Date(course.enddate), "yyyy-MM-dd")
              : ""
          }
          className={[
            "rounded border border-orange-200  p-2",
            actionData?.errors.enddate ? "border-2 border-red-500" : "",
          ].join(" ")}
        />
        {actionData?.errors.enddate && (
          <p className="mb-0 mt-1 text-red-500">
            {actionData.errors.enddate.message}
          </p>
        )}
        <label htmlFor="ects" className="mb-1 block font-semibold">
          ECTS:
        </label>
        <input
          type="number"
          name="ects"
          id="ects"
          placeholder="ECTS"
          defaultValue={course.ects ?? actionData?.values.ects}
          className={[
            "rounded border border-orange-200  p-2",
            actionData?.errors.ects ? "border-2 border-red-500" : "",
          ].join(" ")}
        />
        {actionData?.errors.ects && (
          <p className="mb-0 mt-1 text-red-500">
            {actionData.errors.ects.message}
          </p>
        )}

        <label htmlFor="semester" className="mb-1 block font-semibold">
          Semester:
        </label>
        <input
          type="number"
          name="semester"
          id="semester"
          placeholder="Semester"
          defaultValue={course.semester ?? actionData?.values.semester}
          className={[
            "rounded border border-orange-200  p-2",
            actionData?.errors.semester ? "border-2 border-red-500" : "",
          ].join(" ")}
        />
        {actionData?.errors.semester && (
          <p className="mb-0 mt-1 text-red-500">
            {actionData.errors.semester.message}
          </p>
        )}

        <label htmlFor="teacher" className="mb-1 block font-semibold">
          Teacher:
        </label>
        <input
          type="text"
          name="teacher"
          id="teacher"
          placeholder="Teacher"
          defaultValue={course.teacher ?? actionData?.values.teacher}
          className={[
            "rounded border border-orange-200  p-2",
            actionData?.errors.teacher ? "border-2 border-red-500" : "",
          ].join(" ")}
        />
        {actionData?.errors.teacher && (
          <p className="mb-0 mt-1 text-red-500">
            {actionData.errors.teacher.message}
          </p>
        )}

        <br />
        <button
          type="submit"
          className="mt-3 rounded bg-orange-600 p-2 text-white transition-colors hover:bg-orange-700"
        >
          Save
        </button>
      </Form>
    </div>
  );
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
// Error handeling
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
  const form = await request.formData();
  const db = connectDb();

  try {
    // Checking if the course is found and if the user has permission to edit it
    const course = await db.models.Course.findById(params.courseId);
    if (!course) {
      return new Response(`Couldn't find course with id ${params.courseId}`, {
        status: 404,
      });
    }
    if (course.user.toString() !== session.get("userId")) {
      return new Response("That's not your course, my man", {
        status: 403,
      });
    }

    // Updating the course data based on the form inputs
    course.course = form.get("course");
    course.education = form.get("education");
    course.teacher = form.get("teacher");
    course.description = form.get("description");
    course.startdate = form.get("startdate");
    course.enddate = form.get("enddate");
    course.ects = Number(form.get("ects"));
    course.semester = Number(form.get("semester"));

    // Saving the updated course data in the database
    await course.save();
    // Redirecting to the course page after successful update
    return redirect(`/courses/${course._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}
