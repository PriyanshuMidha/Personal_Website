import mongoose from "mongoose";

const uploadedAssetSchema = new mongoose.Schema(
  {
    assetId: String,
    publicId: String,
    url: String,
    originalName: String,
    bytes: Number,
    format: String,
    resourceType: String,
  },
  { _id: false }
);

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: "" },
    headline: { type: String, default: "" },
    subheadline: { type: String, default: "" },
    shortIntro: { type: String, default: "" },
    bio: { type: String, default: "" },
    about: { type: String, default: "" },
    location: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    heroDescription: { type: String, default: "" },
    aboutTitle: { type: String, default: "" },
    aboutDescription: { type: String, default: "" },
    yearsOfExperience: { type: Number, default: 0 },
    currentRole: { type: String, default: "" },
    currentCompany: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    profileImageUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    profileImage: uploadedAssetSchema,
    resume: uploadedAssetSchema,
    socialLinks: { type: [socialLinkSchema], default: [] },
    highlights: { type: [String], default: [] },
    specialties: { type: [String], default: [] },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
