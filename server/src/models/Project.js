import mongoose from "mongoose";

const screenshotSchema = new mongoose.Schema(
  {
    assetId: String,
    publicId: String,
    url: String,
    originalName: String,
    bytes: Number,
    format: String,
    resourceType: String,
    caption: { type: String, default: "" },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    shortDescription: { type: String, required: true },
    longDescription: { type: String, default: "" },
    problemSolved: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    features: { type: [String], default: [] },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    screenshots: { type: [screenshotSchema], default: [] },
    category: { type: String, default: "Other" },
    status: { type: String, default: "Live" },
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
