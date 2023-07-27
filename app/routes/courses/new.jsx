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
  const form = await request.formData()
  const db = connectDb();
  // Creating a new course object based on the form data
  try {
    const newCourse = new db.models.Course({
      course: form.get("course"),
      education: form.get("education"),
      description: form.get("description"),
      teacher: form.get("teacher"),
      startdate: form.get("startdate"),
      enddate: form.get("enddate"),
      ects: Number(form.get("ects")),
      semester: Number(form.get("semester")),
      user: session.get("userId"),
    });
    // Saving the new course to the database
    await newCourse.save();
    // Updating the teacher's courses list with the newly created course
    const teacher = await db.models.Teacher.findById(session.get("userId"));
    teacher.courses.push(newCourse);
    await teacher.save();
    // Redirecting to the newly created course's page
    return redirect(`/courses/${newCourse._id}`);
  } catch (error) {
    return json(
      { errors: error.errors, values: Object.fromEntries(form) },
      { status: 400 }
    );
  }
}
// The form to create a new course
export default function CreateCourse() {
  const actionData = useActionData();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-blue-500 ">Create Course</h1>
      <Form method="post">
        <div className="mb-4">
          <label htmlFor="course" className="block font-semibold">
            Course:
          </label>
          <input
            type="text"
            name="course"
            id="course"
            placeholder="Course"
            defaultValue={actionData?.values.course}
            className={[
              "rounded border p-2",
              actionData?.errors.course ? "border-grey-500" : "border-grey-200",
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
            Education:
          </label>
          <input
            type="text"
            name="education"
            id="education"
            placeholder="Education"
            defaultValue={actionData?.values.education}
            className={[
              "rounded border p-2",
              actionData?.errors.education
                ? "border-grey-500"
                : "border-grey-200",
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
              actionData?.errors.description
                ? "border-grey-500"
                : "border-grey-200",
            ].join(" ")}
          />
          {actionData?.errors.description && (
            <p className="mt-1 text-red-500">
              {actionData.errors.description.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="startdate" className="block font-semibold">
            Startdate:
          </label>
          <input
            type="date"
            name="startdate"
            id="startdate"
            placeholder="Startdate"
            defaultValue={actionData?.values.startdate}
            className={[
              "rounded border p-2",
              actionData?.errors.startdate
                ? "border-grey-500"
                : "border-grey-200",
            ].join(" ")}
          />
          {actionData?.errors.startdate && (
            <p className="mt-1 text-red-500">
              {actionData.errors.startdate.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="enddate" className="block font-semibold">
            Enddate:
          </label>
          <input
            type="date"
            name="enddate"
            id="enddate"
            placeholder="End Date"
            defaultValue={actionData?.values.enddate}
            className={[
              "rounded border p-2",
              actionData?.errors.enddate
                ? "border-grey-500"
                : "border-grey-200",
            ].join(" ")}
          />
          {actionData?.errors.enddate && (
            <p className="mt-1 text-red-500">
              {actionData.errors.enddate.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="ects" className="block font-semibold">
            ECTS:
          </label>
          <input
            type="number"
            name="ects"
            id="ects"
            placeholder="ECTS"
            defaultValue={actionData?.values.ects}
            className={[
              "rounded border p-2",
              actionData?.errors.ects ? "border-grey-500" : "border-grey-200",
            ].join(" ")}
          />
          {actionData?.errors.ects && (
            <p className="mt-1 text-red-500">
              {actionData.errors.ects.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="semester" className="block font-semibold">
            Semester:
          </label>
          <input
            type="number"
            name="semester"
            id="semester"
            placeholder="Semester"
            defaultValue={actionData?.values.semester}
            className={[
              "rounded border p-2",
              actionData?.errors.semester
                ? "border-grey-500"
                : "border-grey-200",
            ].join(" ")}
          />
          {actionData?.errors.semester && (
            <p className="mt-1 text-red-500">
              {actionData.errors.semester.message}
            </p>
          )}
        </div>

        <label htmlFor="teacher" className="mb-1 block font-semibold">
          Teacher:
        </label>
        <input
          type="text"
          name="teacher"
          id="teacher"
          placeholder="Teacher"
          defaultValue={actionData?.values.semester}
          className={[
            "border-grey-200 rounded border  p-2",
            actionData?.errors.teacher ? "border-grey-500 border-2" : "",
          ].join(" ")}
        />
        {actionData?.errors.teacher && (
          <p className="mb-0 mt-1 text-red-500">
            {actionData.errors.teacher.message}
          </p>
        )}

        <div className="mt-4">
          <button
            type="submit"
            className="rounded bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </Form>
    </div>
  );
}
