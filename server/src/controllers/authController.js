import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { loginAdmin } from "../services/authService.js";

export const login = asyncHandler(async (req, res) => {
  const data = await loginAdmin(req.body);
  sendSuccess(res, 200, "Admin login successful", data);
});

export const me = asyncHandler(async (req, res) => {
  sendSuccess(res, 200, "Admin profile fetched", req.admin);
});

