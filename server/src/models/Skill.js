import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, default: "" },
    level: { type: String, default: "" },
    icon: { type: String, default: "" },
    isPublished: { type: Boolean, default: false, index: true },
    displayOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

skillSchema.index({ isPublished: 1, category: 1, displayOrder: 1 });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
