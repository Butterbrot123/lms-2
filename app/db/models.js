import { mongoose } from "mongoose";
const { Schema } = mongoose;

// Define the schema for the Teacher model.
const teacherSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please enter Username"],
    minLength: [3, "That's too short"],
  },

  firstName: {
    type: String,
    trim: true,
    required: true,
    minLength: [2, "That's too short"],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, "Please enter last name"],
    minLength: [2, "Last name must be at least 2 characters long."],
  },
  email: {
    type: String,
    required: [true, "Please enter an email address."],
    minLength: [3, "That's too short"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email address",
    ],
    lowercase: true,
    unique: [true, "Email already exists. Have you tried signing in?"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password."],
    trim: true,
    minLength: [3, "That's too short"],
  },

  // Array of courses taught by the teacher.
  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Course",
  },
});

// Define the schema for the Course model.
const courseSchema = new Schema({
  course: {
    type: String,
    required: true,
    minLength: [2, "That's too short"],
  },

  teacher: {
    type: String,
    required: true,
    minLength: [2, "That's too short"],
  },

  education: {
    type: String,
    required: true,
    minLength: [2, "That's too short"],
  },


  startdate: {
    type: Date,
    required: true,
  },
  enddate: {
    type: Date,
    required: true,
  },

  ects: {
    type: Number,
    required: true,
    minLength: [2, "That's too short"],
  },
  semester: {
    type: Number,
    required: true,
  },
    // Reference to the teacher who created the course.
  user: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
  },
  description: {
    type: String,
    required: false,
    minLength: [2, "That's too short"],
    maxLength: [
      280,
      "Description is too long. Maximum allowed is 280 characters.",
    ],
  },
    // Reference to the lecture associated with the course.
  lecture: {
    type: String,
    ref: "Lecture",
    minLength: [2, "That's too short"],
  },
});

// Define the schema for the Lecture model.
const lectureSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [2, "That's too short"],
    },
    teacher: {
      type: String,
      required: true,
      minLength: [2, "That's too short"],
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: false,
      minLength: [2, "That's too short"],
    },
     // Reference to the teacher who created the lecture.
    user: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
     // Array of courses associated with the lecture.
    courses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Course",
    },
  },
  { timestamps: true }
);

// Export an array of models, each with its name, schema, and collection name.
export const models = [
  {
    name: "Teacher",
    schema: teacherSchema,
    collection: "teachers",
  },
  {
    name: "Course",
    schema: courseSchema,
    collection: "courses",
  },
  {
    name: "Lecture",
    schema: lectureSchema,
    collection: "lectures",
  },
];
