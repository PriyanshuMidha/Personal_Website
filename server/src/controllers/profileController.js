import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { getSerializedProfile, updateProfile } from "../services/profileService.js";

export const getPublicProfile = asyncHandler(async (_req, res) => {
  const profile = await getSerializedProfile({ publishedOnly: true });
  sendSuccess(res, 200, "Public profile fetched", profile);
});

export const getAdminProfile = asyncHandler(async (_req, res) => {
  const profile = await getSerializedProfile();
  sendSuccess(res, 200, "Admin profile fetched", profile);
});

export const updateAdminProfile = asyncHandler(async (req, res) => {
  const profile = await updateProfile(req.body);
  sendSuccess(res, 200, "Profile updated", profile);
});
