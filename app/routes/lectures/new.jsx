import { Form, useActionData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ request }) {
  await requireUserSession(request);
  return null;
}

export async function action({ request }) {
  const session = await requireUserSession(request);
  const form = await request.formData();
  const db = connectDb();
  try {
    const newLecture = new db.models.Lecture({
      title: form.get("title"),
      course: form.get("course"),
      description: form.get("description"),
      date: Date(form.get("date")),
      time: Number(form.get("time")),
      user: session.get("userId"),
    });
    await newLecture.save();
    const teacher = await db.models.Lecture.findById(session.get("userId"));
    teacher.courses.push(newLecture);
    await teacher.save();
    return redirect(`/lectures/${newLecture._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateLecture() {
  const actionData = useActionData();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Create Lecture</h1>
      <Form method="post">
        <div className="mb-4">
          <label htmlFor="course" className="block font-semibold">
            Title:
          </label>
          <input
            type="text"
            name="lecture"
            id="lecture"
            placeholder="Lecture"
            defaultValue={actionData?.values.lecture}
            className={[
              "rounded border p-2",
              actionData?.errors.lecture ? "border-red-500" : "border-orange-200",
            ].join(" ")}
          />
          {actionData?.errors.course && (
            <p className="mt-1 text-red-500">
              {actionData.errors.course.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="education" className="block font-semibold">
            Course:
          </label>
          <input
            type="text"
            name="education"
            id="education"
            placeholder="Education"
            defaultValue={actionData?.values.education}
            className={[
              "rounded border p-2",
              actionData?.errors.education ? "border-red-500" : "border-orange-200",
            ].join(" ")}
          />
          {actionData?.errors.education && (
            <p className="mt-1 text-red-500">
              {actionData.errors.education.message}
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
              actionData?.errors.description ? "border-red-500" : "border-orange-200",
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
              actionData?.errors.date ? "border-red-500" : "border-orange-200",
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
            time:
          </label>
          <input
            type="number"
            name="time"
            id="time"
            placeholder="time"
            defaultValue={actionData?.values.time}
            className={[
              "rounded border p-2",
              actionData?.errors.time ? "border-red-500" : "border-orange-200",
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
          className="rounded bg-orange-600 p-2 text-white transition-colors hover:bg-orange-700"
        >
          Save
        </button>
      </Form>
    </div>
  );
}
