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

  console.log(form)

  try {
    const userId = session.get("userId");
    const course = await db.models.Course.find({ course: form.get("courses"), user: userId})
    console.log(course);
    console.log(course.length)
    const newLecture = new db.models.Lecture({
      title: form.get("title"),
      courses: [course._id],
      description: form.get("description"),
      date: Date(form.get("date")),
      time: Date(form.get("time")),
      user: userId,
    });
    await newLecture.save();
    
    return redirect(`/lectures/${newLecture._id}`);
  } catch (error) {
    console.log(error)
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}

export default function CreateLecture() {
  const actionData = useActionData();
  const loaderData = useLoaderData();
  let optionItems = loaderData.map((course) => (
    <option key={course._id}>{course.course}</option>
  ));

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
            name="title"
            id="title"
            placeholder="Lecture"
            defaultValue={actionData?.values.lecture}
            className={[
              "rounded border p-2",
              actionData?.errors.lecture
                ? "border-red-500"
                : "border-orange-200",
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

          <select id="courses" placeholder="courses" name="courses">
            {optionItems}
          </select>
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
                ? "border-red-500"
                : "border-orange-200",
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
