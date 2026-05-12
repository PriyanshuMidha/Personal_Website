import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    actionType: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "upload", "publish", "unpublish"],
      index: true,
    },
    module: {
      type: String,
      required: true,
      enum: ["profile", "project", "skill", "experience", "achievement", "education", "resume"],
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

export default ActivityLog;
