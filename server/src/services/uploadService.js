import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import { getProfile, updateProfile } from "./profileService.js";
import { createActivityLog } from "./activityService.js";

export const uploadImageAsset = async (file) => uploadToCloudinary(file, "portfolio/images");

export const uploadResumeAsset = async (file) => {
  const asset = await uploadToCloudinary(file, "portfolio/resume", "raw");
  const profile = await getProfile();
  const updatedProfile = await updateProfile({ ...profile.toObject(), resume: asset, resumeUrl: asset.url }, { skipActivityLog: true });
  await createActivityLog({
    actionType: "upload",
    module: "resume",
    title: asset.originalName || "Resume uploaded",
    description: "Uploaded or replaced the public resume document.",
  });
  return updatedProfile;
};
