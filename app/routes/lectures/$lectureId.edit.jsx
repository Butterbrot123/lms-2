import { Form, useActionData, useLoaderData, useCatch } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import connectDb from "~/db/connectDb.server.js";
import { requireUserSession } from "~/sessions.server";

export async function loader({ params, request }) {
  const session = await requireUserSession(request);
  const db = connectDb();
  const courses = await db.models.Course.find({
    user: session.get("userId"),
  });
  const lecture = await db.models.Lecture.findById(params.lectureId)
  return json({courses: courses, lecture: lecture});
}




export default function EditLecture() {
  const actionData = useActionData();
  const loaderData = useLoaderData();

  const lecture = loaderData.lecture;

  console.log(lecture);

  let optionItems = loaderData.courses.map((course) => {
  
    let selectedCourse  = lecture.courses.includes( course._id) ? ' selected' : '';
    console.log(lecture.courses);
    console.log(lecture.courses.includes( course._id));
    console.log(selectedCourse);
   return (
    <option key={course._id}{...selectedCourse}>{course.course}</option>
  )
});


  
  return (
    <div>
    <h1 className="mb-4 text-2xl font-bold">Create Lecture</h1>
    <Form method="post">
      <div className="mb-4">
        <label htmlFor="lecture" className="block font-semibold">
          Title:
        </label>
        <input
          type="text"
          name="lecture"
          id="lecture"
          placeholder="Lecture"
          defaultValue={lecture.title ?? actionData?.values.lecture}
          className={[
            "rounded border p-2",
            actionData?.errors.lecture ? "border-red-500" : "border-orange-200",
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
          defaultValue={lecture.description ?? actionData?.values.description}
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
          type="Date"
          name="date"
          id="date"
          placeholder="Date"
          defaultValue={lecture.date ?? actionData?.values.date}
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
          type="Time"
          name="time"
          id="time"
          placeholder="time"
          defaultValue={lecture.time ?? actionData?.values.time}
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
    //const userId = session.get("userId");
    const lecture = await db.models.Lecture.findById(params.lectureId);
    if (!lecture) {
      return new Response(`Couldn't find lecture with id ${params.lectureId}`, {
        status: 404,
      });
    }
    if (lecture.user.toString() !== session.get("userId")) {
      return new Response("That's not your lecture, my man", {
        status: 403,
      });
    }
    lecture.courses = form.get("courses");
    lecture.title = form.get("title");
    lecture.date = Date(form.get("date"));
    lecture.time = Date(form.get("time"));
    lecture.description = (form.get("description"));
   
    await lecture.save();
    return redirect(`/lectures/${lecture._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}
