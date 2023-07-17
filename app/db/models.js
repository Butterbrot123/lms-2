import { mongoose } from "mongoose";
const { Schema } = mongoose;

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
  

  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Course",
  },
});

// course contains 1 or many lectures as embedded documents

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

 /* CourseDates: {
    type: {
      start: {
        type: Date,
        required: [
          function () {
            return this.searching;
          },
          "You need to provide a start date if you are creating a Course",
        ],
      },
      end: {
        type: Date,
        required: [
          function () {
            return this.searching;
          },
          "You need to provide an end date if you are creating a course",
        ],
        validate: {
          validator: function (value) {
            return value >= this.start;
          },
          message: "End date must be after or equal to start date.",
        },
      },
      searching: { type: Boolean, required: true },
    },
  },

  */

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
  lecture: {
    type: String, //Schema.Types.ObjectId,
    ref: "Lecture",
    minLength: [2, "That's too short"],
  },
});

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
    user: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
    courses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Course",
    },

    
  },
  { timestamps: true }
);

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
