import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    impact: { type: String, default: "" },
    date: Date,
    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

achievementSchema.index({ isPublished: 1, isFeatured: 1, displayOrder: 1 });

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;
