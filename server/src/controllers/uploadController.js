import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { uploadImageAsset, uploadResumeAsset } from "../services/uploadService.js";

export const uploadImage = asyncHandler(async (req, res) => {
  const asset = await uploadImageAsset(req.file);
  sendSuccess(res, 201, "Image uploaded", asset);
});

export const uploadResume = asyncHandler(async (req, res) => {
  const profile = await uploadResumeAsset(req.file);
  sendSuccess(res, 201, "Resume uploaded", profile);
});
