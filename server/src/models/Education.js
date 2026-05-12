import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    startYear: { type: Number, required: true },
    endYear: Number,
    grade: { type: String, default: "" },
    description: { type: String, default: "" },
    coursework: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false, index: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

const Education = mongoose.model("Education", educationSchema);

export default Education;

