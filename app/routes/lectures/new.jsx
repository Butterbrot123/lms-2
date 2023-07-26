import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ params, request }) {
  const session = await requireUserSession(request);
  const db = connectDb();
  const courses = await db.models.Course.find({
    user: session.get("userId"),
  });
  return json(courses);
}

export async function action({ request }) {
  const session = await requireUserSession(request);
  const form = await request.formData();
  const db = connectDb();

  try {
    const userId = session.get("userId");
    // Find courses associated with the user based on the selected course in the form.
    const courses = await db.models.Course.find({
      course: form.get("course"),
      user: userId,
    });
    // Creating a new lecture object with the form data
    const newLecture = new db.models.Lecture({
      title: form.get("title"),
      courses: courses.map((course) => course._id),
      teacher: form.get("teacher"),
      description: form.get("description"),
      date: Date(form.get("date")),
      time: Date(form.get("time")),
      user: userId,
    });

    // Saving the new lecture to the database
    await newLecture.save();

    return redirect(`/lectures/${newLecture._id}`);
  } catch (error) {
    return json(
      //Error handeling
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateLecture() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  // Creating an array of option items for the course dropdown
  let optionItems = loaderData.map((course) => (
    <option key={course._id}>{course.course}</option>
  ));

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-blue-500">Create Lecture</h1>
      <Form method="post">
        <div className="mb-4">
          <label htmlFor="course" className="block font-semibold">
            Lecture:
          </label>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Lecture"
            defaultValue={actionData?.values.lecture}
            className={[
              "rounded border p-2",
              actionData?.errors.lecture
                ? "border-gray-500"
                : "border-gray-200",
            ].join(" ")}
          />
          {actionData?.errors.lecture && (
            <p className="mt-1 text-red-500">
              {actionData.errors.lecture.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="education" className="block font-semibold">
            Course:
          </label>

          <select id="course" placeholder="course" name="course">
            {optionItems}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="teacher" className="block font-semibold">
            Teacher:
          </label>
          <input
            type="text"
            name="teacher"
            id="teacher"
            placeholder="Teacher"
            defaultValue={actionData?.values.teacher}
            className={[
              "rounded border p-2",
              actionData?.errors.teacher
                ? "border-gray-500"
                : "border-gray-200",
            ].join(" ")}
          />
          {actionData?.errors.teacher && (
            <p className="mt-1 text-red-500">
              {actionData.errors.teacher.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block font-semibold">
            Description:
          </label>
          <textarea
            name="description"
            id="description"
            rows="4"
            placeholder="Description"
            defaultValue={actionData?.values.description}
            className={[
              "rounded border p-2",
              actionData?.errors.description
                ? "border-gray-500"
                : "border-gray-200",
            ].join(" ")}
          />
          {actionData?.errors.description && (
            <p className="mt-1 text-red-500">
              {actionData.errors.description.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block font-semibold">
            Date:
          </label>
          <input
            type="date"
            name="date"
            id="date"
            placeholder="Date"
            defaultValue={actionData?.values.date}
            className={[
              "rounded border p-2",
              actionData?.errors.date ? "border-gray-500" : "border-gray-200",
            ].join(" ")}
          />
          {actionData?.errors.date && (
            <p className="mt-1 text-red-500">
              {actionData.errors.date.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="time" className="block font-semibold">
            Time:
          </label>
          <input
            type="Time"
            name="time"
            id="time"
            placeholder="time"
            defaultValue={actionData?.values.time}
            className={[
              "rounded border p-2",
              actionData?.errors.time ? "border-gray-500" : "border-gray-200",
            ].join(" ")}
          />
          {actionData?.errors.time && (
            <p className="mt-1 text-red-500">
              {actionData.errors.time.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="rounded bg-blue-500 p-2 text-white transition-colors hover:bg-blue-500"
        >
          Save
        </button>
      </Form>
    </div>
  );
}
